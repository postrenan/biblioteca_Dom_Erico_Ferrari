export const useWishlistStore = () => {
    const wishlist = useState<any[]>('wishlist', () => []);
    const loading = useState('wishlist-loading', () => false);
    const { apiFetch } = useApi();
    const { user } = useAuth();

    const fetchMyWishlist = async () => {
        if (!user.value) return;
        loading.value = true;
        try {
            const data = await apiFetch(`/wishlist/${user.value.id}`);
            wishlist.value = data || [];
        } finally {
            loading.value = false;
        }
    };

    const addToWishlist = async (bookId: string) => {
        if (!user.value) return { error: 'Not authenticated' };
        try {
            await apiFetch('/wishlist', {
                method: 'POST',
                body: { userId: user.value.id, bookId }
            });
            await fetchMyWishlist();
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    };

    const removeFromWishlist = async (bookId: string) => {
        if (!user.value) return { error: 'Not authenticated' };
        try {
            await apiFetch(`/wishlist/${user.value.id}/${bookId}`, {
                method: 'DELETE'
            });
            await fetchMyWishlist();
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    };

    return {
        wishlist,
        loading,
        fetchMyWishlist,
        addToWishlist,
        removeFromWishlist
    };
};
