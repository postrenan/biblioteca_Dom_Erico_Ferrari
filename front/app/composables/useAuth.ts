// import { defineStore } from 'pinia'; // Pinia unused
import type { User, AuthResponse } from '~/types/api';

export const useAuth = () => {
    const user = useState<User | null>('auth_user', () => null);
    const token = useCookie('auth_token'); // Nuxt auto-manages cookies
    const { apiFetch } = useApi();
    const router = useRouter();

    const login = async (matricula: string, pass: string) => {
        // use apiFetch ($fetch) for imperative calls inside functions
        const data = await apiFetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: { matricula, password: pass }
        });

        if (data) {
            token.value = data.access_token;
            user.value = data.user;
            return data.user;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        router.push('/login');
    };

    const fetchProfile = async () => {
        if (!token.value) return;

        try {
            const data = await apiFetch<User>('/auth/profile');
            if (data) {
                user.value = data;
            }
        } catch (e) {
            console.error("Failed to fetch profile", e);
            token.value = null; // Clear invalid token
        }
    };

    return {
        user,
        isAuthenticated: computed(() => !!user.value),
        login,
        logout,
        fetchProfile
    };
};
