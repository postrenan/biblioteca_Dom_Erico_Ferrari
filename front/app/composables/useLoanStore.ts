import type { Loan } from '~/types/api';

export const useLoanStore = () => {
    const { apiFetch } = useApi();
    const loans = useState<Loan[]>('loans', () => []);
    const loading = useState<boolean>('loans_loading', () => false);

    // For Students/Teachers to see their own loans
    const fetchMyLoans = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<Loan[]>('/loans/my');
            if (data) {
                loans.value = data;
            }
            return { data: { value: data }, error: ref(null) };
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    // For Librarians to see all active loans (or filtered)
    const fetchAllLoans = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<Loan[]>('/loans');
            if (data) {
                loans.value = data;
            }
            return { data: { value: data }, error: ref(null) };
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    const checkoutBook = async (copyCode: string, userMatricula: string, returnDate: string) => {
        loading.value = true;
        try {
            const data = await apiFetch<Loan>('/loans', {
                method: 'POST',
                body: { copyCode, userMatricula, returnDate } // Matches backend update
            });
            if (data) {
                loans.value.push(data);
                return { data: { value: data }, error: ref(null) };
            }
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    const returnBook = async (loanId: string) => {
        loading.value = true;
        try {
            const data = await apiFetch<Loan>(`/loans/${loanId}/return`, {
                method: 'PATCH'
            });
            if (data) {
                const index = loans.value.findIndex(l => l.id === loanId);
                if (index !== -1) loans.value[index] = data;
                return { data: { value: data }, error: ref(null) };
            }
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    const renewLoan = async (loanId: string) => {
        loading.value = true;
        try {
            const data = await apiFetch<Loan>(`/loans/${loanId}/renew`, {
                method: 'PATCH'
            });
            if (data) {
                const index = loans.value.findIndex(l => l.id === loanId);
                if (index !== -1) loans.value[index] = data;
                return { data: { value: data }, error: ref(null) };
            }
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    const fetchOverdueLoans = async () => {
        loading.value = true;
        try {
            const data = await apiFetch<Loan[]>('/loans/overdue');
            if (data) {
                loans.value = data;
            }
            return { data: { value: data }, error: ref(null) };
        } catch (err) {
            return { data: { value: null }, error: ref(err) };
        } finally {
            loading.value = false;
        }
    };

    return {
        loans,
        loading,
        fetchMyLoans,
        fetchAllLoans,
        checkoutBook,
        returnBook,
        renewLoan,
        fetchOverdueLoans
    };
};
