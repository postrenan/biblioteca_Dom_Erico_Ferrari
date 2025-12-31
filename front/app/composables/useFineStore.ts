import type { Fine } from '~/types/api';

export const useFineStore = () => {
    const { apiFetch } = useApi();
    const fines = useState<Fine[]>('fines', () => []);
    const loading = useState<boolean>('fines_loading', () => false);

    const fetchAllFines = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<Fine[]>('/fines');
            if (data) {
                fines.value = data;
            }
        } catch (e) {
            // handle error
        } finally {
            loading.value = false;
        }
    };

    const fetchMyFines = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<Fine[]>('/fines/my');
            if (data) {
                fines.value = data;
            }
        } catch (e) {
            // handle error
        } finally {
            loading.value = false;
        }
    };

    const createFine = async (fineData: { userMatricula: string; value: number; reason: string; loanId?: string }) => {
        loading.value = true;
        try {
            const data = await apiFetch<Fine>('/fines', {
                method: 'POST',
                body: fineData
            });
            if (data) {
                fines.value.push(data);
                return { success: true };
            }
        } catch (error) {
            return { error };
        } finally {
            loading.value = false;
        }
    };

    const payFine = async (id: string) => {
        loading.value = true;
        try {
            const data = await apiFetch<Fine>(`/fines/${id}/pay`, { method: 'PATCH' });
            if (data) {
                const index = fines.value.findIndex(f => f.id === id);
                if (index !== -1) fines.value[index] = data;
                return { success: true };
            }
        } catch (error) {
            return { error };
        } finally {
            loading.value = false;
        }
    }

    return {
        fines,
        loading,
        fetchFines: fetchAllFines,
        fetchAllFines,
        fetchMyFines,
        createFine,
        payFine
    };
};
