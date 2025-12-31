export const useRequiredReadingsStore = () => {
    const requiredReadings = useState<any[]>('required-readings', () => []);
    const loading = useState('required-readings-loading', () => false);
    const { apiFetch } = useApi();

    const fetchMyRequiredReadings = async () => {
        loading.value = true;
        try {
            const data = await apiFetch('/required-readings/my');
            requiredReadings.value = data || [];
        } finally {
            loading.value = false;
        }
    };

    const fetchRequiredReadingsBySerie = async (serieId: string) => {
        loading.value = true;
        try {
            const data = await apiFetch(`/required-readings/serie/${serieId}`);
            return data || [];
        } finally {
            loading.value = false;
        }
    };

    const createRequiredReading = async (data: { bookId: string; serieId: string }) => {
        try {
            await apiFetch('/required-readings', {
                method: 'POST',
                body: data
            });
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    };

    const deleteRequiredReading = async (id: string) => {
         try {
            await apiFetch(`/required-readings/${id}`, {
                method: 'DELETE'
            });
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    };

    const checkReadingStatus = (bookId: string, userLoans: any[]) => {
        return userLoans.some(
            loan => loan.bookCopy?.bookId === bookId && loan.status === 'RETURNED'
        );
    };

    return {
        requiredReadings,
        loading,
        fetchMyRequiredReadings,
        fetchRequiredReadingsBySerie,
        createRequiredReading,
        deleteRequiredReading,
        checkReadingStatus
    };
};
