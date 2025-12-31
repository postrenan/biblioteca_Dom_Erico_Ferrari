export interface Category {
    id: string;
    name: string;
    _count?: {
        books: number;
    };
}

export const useCategoryStore = () => {
    const { apiFetch } = useApi();
    const categories = useState<Category[]>('categories', () => []);
    const loading = useState<boolean>('categories_loading', () => false);

    const fetchCategories = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<Category[]>('/categories');
            if (data) {
                categories.value = data;
            }
        } catch (e) {
            console.error('Error fetching categories:', e);
        } finally {
            loading.value = false;
        }
    };

    const addCategory = async (name: string) => {
        loading.value = true;
        try {
            const newCat = await apiFetch<Category>('/categories', {
                method: 'POST',
                body: { name }
            });
            if (newCat) {
                categories.value.push(newCat);
                return { data: newCat, error: null };
            }
        } catch (error) {
            return { data: null, error };
        } finally {
            loading.value = false;
        }
    };

    const removeCategory = async (id: string) => {
        loading.value = true;
        try {
            await apiFetch(`/categories/${id}`, { method: 'DELETE' });
            categories.value = categories.value.filter(c => c.id !== id);
            return { error: null };
        } catch (error) {
            return { error };
        } finally {
            loading.value = false;
        }
    };

    return {
        categories,
        loading,
        fetchCategories,
        addCategory,
        removeCategory
    };
};
