// Helper to manage copies within BookStore or separate
export const useCopyStore = () => {
    const { request } = useApi();

    // Add copy to a book
    const addCopy = async (bookId: string, copyCode: string, customLabel?: string) => {
        const { apiFetch } = useApi();
        try {
            await apiFetch(`/books/${bookId}/copies`, {
                method: 'POST',
                body: { copyCode, customLabel }
            });
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    };

    const removeCopy = async (copyId: string, reason: string) => {
        const { apiFetch } = useApi();
        try {
            await apiFetch(`/books/copies/${copyId}`, {
                method: 'DELETE',
                body: { reason }
            });
            return { error: null };
        } catch (e) {
            return { error: e };
        }
    }

    return { addCopy, removeCopy };
}
