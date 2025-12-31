import type { User, Role } from '~/types/api';

export const useUserStore = () => {
    const { request, apiFetch } = useApi();
    const users = useState<User[]>('users', () => []);
    const loading = useState<boolean>('users_loading', () => false);

    const fetchUsers = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<User[]>('/users');
            if (data) {
                users.value = data;
            }
            return { data: { value: data }, error: ref(null) };
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    const createUser = async (userData: Partial<User>) => {
        loading.value = true;
        try {
            const newUser = await apiFetch<User>('/users', {
                method: 'POST',
                body: userData
            });
            if (newUser) {
                users.value.push(newUser);
            }
            loading.value = false;
            return { data: { value: newUser }, error: ref(null) };
        } catch (err) {
            loading.value = false;
            return { data: { value: null }, error: ref(err) };
        }
    };

    const toggleStatus = async (id: string) => {
        loading.value = true;
        try {
            const updatedUser = await apiFetch<User>(`/users/${id}/status`, {
                method: 'PATCH'
            });
            if (updatedUser && users.value) {
                const index = users.value.findIndex(u => u.id === id);
                if (index !== -1) {
                    users.value[index] = updatedUser;
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // Helper to convert role strings to Display names if needed
    const roleLabels = {
        'STUDENT': 'Aluno',
        'TEACHER': 'Professor',
        'LIBRARIAN': 'Bibliotecário',
        'ADMIN': 'Administrador'
    };

    const updateUser = async (id: string, data: any) => {
        try {
           const updated = await apiFetch<User>(`/users/${id}`, {
               method: 'PATCH',
               body: data
           });
           if (updated) {
               const index = users.value.findIndex(u => u.id === id);
               if (index !== -1) {
                   users.value[index] = { ...users.value[index], ...updated };
               }
           }
           return updated;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    const searchUsers = async (query: string) => {
        if (query.length < 3) return [];
        try {
            return await apiFetch<User[]>('/users/search', { query: { q: query } });
        } catch (err) {
            console.error('Search error:', err);
            return [];
        }
    };

    const getHistory = async (userId: string) => {
        try {
            return await apiFetch<any[]>(`/users/${userId}/history`);
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    return {
        users,
        loading,
        roleLabels,
        fetchUsers,
        createUser,
        toggleStatus,
        updateUser,
        searchUsers,
        getHistory
    };
};
