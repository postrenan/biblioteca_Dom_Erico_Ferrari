import type { Book } from '~/types/api';

export const useBookStore = () => {
    const { request, apiFetch } = useApi();
    const books = useState<Book[]>('books', () => []);
    const loading = useState<boolean>('books_loading', () => false);

    const fetchBooks = async (params: any = {}) => {
        loading.value = true;
        try {
            const data = await apiFetch<Book[]>('/books', { query: params });
            if (data) {
                books.value = data;
            }
            return { data: { value: data }, error: ref(null) };
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    const createBook = async (bookData: Partial<Book>) => {
        loading.value = true;
        try {
            const newBook = await apiFetch<Book>('/books', {
                method: 'POST',
                body: bookData
            });
            if (newBook) {
                books.value.push(newBook);
            }
            loading.value = false;
            return { data: { value: newBook }, error: ref(null) };
        } catch (err) {
            loading.value = false;
            return { data: { value: null }, error: ref(err) };
        }
    };

    const updateBook = async (id: string, bookData: Partial<Book>) => {
        loading.value = true;
        try {
            const updatedBook = await apiFetch<Book>(`/books/${id}`, {
                method: 'PATCH',
                body: bookData
            });
            if (updatedBook) {
                const index = books.value.findIndex(b => b.id === id);
                if (index !== -1) books.value[index] = updatedBook;
            }
            loading.value = false;
            return { data: { value: updatedBook }, error: ref(null) };
        } catch (err) {
            loading.value = false;
            return { data: { value: null }, error: ref(err) };
        }
    };

    const deleteBook = async (id: string) => {
        loading.value = true;
        try {
            await apiFetch(`/books/${id}`, { method: 'DELETE' });
            books.value = books.value.filter(b => b.id !== id);
            loading.value = false;
            return { error: ref(null) };
        } catch (err) {
            loading.value = false;
            return { error: ref(err) };
        }
    };

    const searchBooks = async (query: string) => {
        if (query.length < 3) return [];
        try {
            return await apiFetch<Book[]>('/books/search', { query: { q: query } });
        } catch (err) {
            console.error('Search error:', err);
            return [];
        }
    };

    return {
        books,
        loading,
        fetchBooks,
        createBook,
        updateBook,
        deleteBook,
        searchBooks
    };
};
