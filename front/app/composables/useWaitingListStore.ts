import { ref } from 'vue';

export const useWaitingListStore = () => {
    const { apiFetch } = useApi();
    const loading = ref(false);
    const myQueue = ref([]);

    const joinQueue = async (bookId: string) => {
        loading.value = true;
        try {
            await apiFetch('/waiting-list/join', {
                method: 'POST',
                body: { bookId }
            });
            return { error: null };
        } catch (e) {
            return { error: e };
        } finally {
            loading.value = false;
        }
    };

    const fetchMyQueue = async () => {
        loading.value = true;
        try {
            const data = await apiFetch('/waiting-list/my');
            if (data) myQueue.value = data;
        } catch (e) {
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    const checkStatus = async (bookId: string) => {
        try {
            const data = await apiFetch(`/waiting-list/check/${bookId}`);
            return data?.inQueue || false;
        } catch (e) {
             return false;
        }
    };
    
    const fetchQueueByBook = async (bookId: string) => {
         loading.value = true;
         try {
             return await apiFetch(`/waiting-list/book/${bookId}`) || [];
         } catch(e) {
             console.error(e);
             return [];
         } finally {
             loading.value = false;
         }
    };

    const leaveQueue = async (id: string) => {
         try {
            await apiFetch(`/waiting-list/${id}`, { method: 'DELETE' });
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    };

    return {
        loading,
        myQueue,
        joinQueue,
        fetchMyQueue,
        checkStatus,
        fetchQueueByBook,
        leaveQueue
    };
};
