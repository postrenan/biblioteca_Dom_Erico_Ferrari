export const useSuggestionStore = () => {
    const suggestions = useState<any[]>('suggestions', () => []);
    const loading = useState('suggestions-loading', () => false);
    const { apiFetch } = useApi();
    const { user } = useAuth();

    const fetchAllSuggestions = async () => {
        loading.value = true;
        try {
            const data = await apiFetch('/suggestions');
            suggestions.value = data || [];
        } finally {
            loading.value = false;
        }
    };

    const createSuggestion = async (data: { title: string; author?: string; reason?: string }) => {
        if (!user.value) return { error: 'Not authenticated' };
        try {
            const res = await apiFetch('/suggestions', {
                method: 'POST',
                body: { ...data, userId: user.value.id }
            });
            return { data: res, error: null };
        } catch (e) {
            return { error: e };
        }
    };

    const updateSuggestionStatus = async (id: string, status: string) => {
        try {
            await apiFetch(`/suggestions/${id}/status`, {
                method: 'PATCH',
                body: { status }
            });
            await fetchAllSuggestions();
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    };

    const mySuggestions = useState<any[]>('my-suggestions', () => []);

    const fetchMySuggestions = async () => {
        loading.value = true;
        try {
            const data = await apiFetch('/suggestions/my');
            mySuggestions.value = data || [];
        } finally {
            loading.value = false;
        }
    };

    return {
        suggestions,
        mySuggestions,
        loading,
        fetchAllSuggestions,
        fetchMySuggestions,
        createSuggestion,
        updateSuggestionStatus
    };
};
