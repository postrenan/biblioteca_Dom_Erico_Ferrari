import type { UseFetchOptions } from 'nuxt/app';

export const useApi = () => {
    const config = useRuntimeConfig();
    const token = useCookie('auth_token');

    // Default to localhost:3001 if not configured
    const baseURL = (config.public.apiBase as string) || 'http://localhost:3001';

    // For reactive data fetching (in setup/top-level)
    const request = async <T>(url: string, options: UseFetchOptions<T> = {}) => {
        const defaults: UseFetchOptions<T> = {
            baseURL,
            key: url,
            headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
            onResponseError({ response }: { response: any }) {
                if (response.status === 401) {
                    const router = useRouter();
                    token.value = null;
                    router.push('/login');
                }
            }
        };

        return useFetch(url, { ...defaults, ...options });
    };

    // For imperative calls (mutations like POST, PUT, DELETE inside functions)
    const apiFetch = async <T>(url: string, options: any = {}) => {
        const defaults = {
            baseURL,
            headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
            onResponseError({ response }: { response: any }) {
                if (response.status === 401) {
                    const router = useRouter();
                    token.value = null;
                    router.push('/login');
                }
            }
        };

        return $fetch<T>(url, { ...defaults, ...options });
    };

    return {
        request,
        apiFetch,
        baseURL
    };
};
