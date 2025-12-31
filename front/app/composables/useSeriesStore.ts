export const useSeriesStore = () => {
    const { apiFetch } = useApi();
    const series = useState<any[]>('series', () => []);
    const loading = useState<boolean>('series_loading', () => false);

    const fetchSeries = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<any[]>('/series');
            if (data) {
                series.value = data;
            }
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const createSeries = async (name: string) => {
        loading.value = true;
        try {
            const newSeries = await apiFetch<any>('/series', {
                method: 'POST',
                body: { name }
            });
            if (newSeries) {
                series.value.push(newSeries);
            }
            return newSeries;
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteSeries = async (id: string) => {
        loading.value = true;
        try {
            await apiFetch(`/series/${id}`, { method: 'DELETE' });
            series.value = series.value.filter(s => s.id !== id);
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        series,
        loading,
        fetchSeries,
        createSeries,
        deleteSeries
    };
};
