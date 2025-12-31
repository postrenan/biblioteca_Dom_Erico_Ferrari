<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
      <AppHeader />

      <AppSubHeader title="Gerenciar Multas">
        <template #actions>
          <!-- Calculator removed as requested -->
        </template>
      </AppSubHeader>

      <!-- Tabs -->
      <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active fw-bold"
            id="pills-open-tab"
            data-bs-toggle="pill"
            @click="activeTab = 'PENDING'"
            type="button"
          >
            <i class="bi bi-exclamation-circle me-1"></i> Em Aberto
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link fw-bold"
            id="pills-history-tab"
            data-bs-toggle="pill"
            @click="activeTab = 'PAID'"
            type="button"
          >
            <i class="bi bi-clock-history me-1"></i> Histórico
          </button>
        </li>
      </ul>

      <!-- Search Filter -->
      <div class="card glass-card border-0 mb-4">
        <div class="card-body p-3">
             <div class="input-group">
                 <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-search"></i></span>
                 <input type="text" class="form-control bg-transparent border-start-0" placeholder="Filtrar por nome do aluno ou título do livro..." v-model="searchText">
             </div>
        </div>
      </div>

      <!-- Fines List -->
      <div class="card glass-card border-0">
        <div class="card-body p-0">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="filteredFines.length === 0" class="text-center py-5 text-muted">
             <i class="bi bi-check-circle fs-1 opacity-50 d-block mb-3"></i>
             <span v-if="searchText">Nenhum resultado encontrado para a busca.</span>
             <span v-else-if="activeTab === 'PENDING'">Nenhuma multa em aberto.</span>
             <span v-else>Nenhum histórico de multas pagas.</span>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">Aluno</th>
                  <th>Livro / Empréstimo</th>
                  <th>Valor</th>
                  <th>Motivo</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fine in filteredFines" :key="fine.id">
                  <td class="ps-4">
                    <div class="fw-bold">{{ fine.user?.name || 'Desconhecido' }}</div>
                    <small class="text-muted">{{ fine.user?.matricula }}</small>
                  </td>
                  <td>
                    <div v-if="fine.loan?.bookCopy?.book">
                        <div class="fw-bold">{{ fine.loan.bookCopy.book.title }}</div>
                        <small class="text-muted font-monospace">{{ fine.loan.bookCopy.copyCode }}</small>
                    </div>
                    <span v-else class="text-muted fst-italic">
                      {{ (fine.reason && fine.reason.includes('(')) ? 'Ver Motivo' : 'Não vinculado' }}
                    </span>
                  </td>
                  <td>
                    <span class="fw-bold text-danger">R$ {{ fine.value.toFixed(2) }}</span>
                  </td>
                  <td>{{ fine.reason }}</td>
                  <td>{{ new Date(fine.createdAt).toLocaleDateString('pt-BR') }}</td>
                  <td>
                    <span
                      class="badge rounded-pill"
                      :class="fine.status === 'PENDING' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'"
                    >
                      {{ fine.status === 'PENDING' ? 'Pendente' : 'Pago' }}
                    </span>
                  </td>
                  <td class="text-end pe-4">
                    <button
                      v-if="fine.status === 'PENDING'"
                      class="btn btn-sm btn-success"
                      @click="handlePay(fine)"
                      title="Marcar como Pago"
                    >
                      <i class="bi bi-check-lg me-1"></i> Baixar
                    </button>
                    <span v-else class="text-muted small">
                         <i class="bi bi-check2-all text-success"></i> {{ new Date(fine.paidAt).toLocaleDateString() }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-dialog modal-lg modal-content bg-white p-4 rounded shadow-lg">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h5 class="mb-0 fw-bold text-danger"><i class="bi bi-calculator me-2"></i>Calculadora de Multas</h5>
            <button class="btn btn-close" @click="closeCreateModal"></button>
        </div>

        <!-- Step 1: Select User -->
        <div v-if="!selectedUser" class="mb-3">
             <label class="form-label fw-bold">1. Selecione o Aluno</label>
             <div class="input-group mb-3">
                 <span class="input-group-text"><i class="bi bi-search"></i></span>
                 <input type="text" class="form-control" placeholder="Buscar por nome ou matrícula..." v-model="userSearch">
             </div>
             <div class="list-group" style="max-height: 200px; overflow-y: auto" v-if="userSearch">
                 <button 
                    v-for="user in userResults" 
                    :key="user.id" 
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    @click="selectUser(user)"
                 >
                    <div>
                        <div class="fw-bold">{{ user.name }}</div>
                        <small class="text-muted">{{ user.matricula }} - {{ user.role }}</small>
                    </div>
                    <i class="bi bi-chevron-right"></i>
                 </button>
                 <div v-if="userResults.length === 0 && userSearch" class="p-3 text-center text-muted">Apenas digite para buscar...</div>
             </div>
        </div>

        <!-- Step 2: Form Details (User Selected) -->
        <div v-else>
            <div class="alert alert-light border d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
                <div>
                   <strong>Aluno:</strong> {{ selectedUser.name }} ({{ selectedUser.matricula }})
                </div>
                <button class="btn btn-sm btn-outline-secondary" @click="selectedUser = null">Trocar Aluno</button>
            </div>

            <div class="row g-3">
                <div class="col-12">
                   <label class="form-label fw-bold">2. Vincular Livro (Catálogo ou Empréstimo)</label>
                   
                   <div class="input-group mb-2">
                       <span class="input-group-text bg-white border-end-0"><i class="bi bi-search small"></i></span>
                       <input type="text" class="form-control form-control-sm border-start-0" placeholder="Buscar no catálogo ou empréstimos..." v-model="bookSearch" @input="handleFineBookSearch">
                   </div>

                   <!-- Catalog Search Results -->
                   <div class="list-group mb-2 shadow-sm" style="max-height: 150px; overflow-y: auto" v-if="bookResults.length > 0">
                       <button 
                           v-for="book in bookResults" 
                           :key="book.id" 
                           class="list-group-item list-group-item-action py-1 px-2 small"
                           @click="selectCatalogBook(book)"
                       >
                           <div class="fw-bold">{{ book.title }}</div>
                           <small class="text-muted">{{ book.author }}</small>
                       </button>
                   </div>

                   <select class="form-select" v-model="form.loanId" v-if="!selectedCatalogBook">
                       <option value="">Sem vínculo (Avulso)</option>
                       <option v-for="loan in filteredUserLoans" :key="loan.id" :value="loan.id">
                           {{ loan.bookCopy?.book?.title }} ({{ loan.bookCopy?.copyCode }}) - Devolução: {{ new Date(loan.dueDate).toLocaleDateString() }}
                       </option>
                   </select>

                   <div v-if="selectedCatalogBook" class="mt-2">
                       <div class="d-flex justify-content-between align-items-center mb-1">
                           <small class="text-muted fw-bold">Exemplares de "{{ selectedCatalogBook.title }}":</small>
                           <button class="btn btn-link btn-sm p-0" @click="selectedCatalogBook = null">Cancelar busca</button>
                       </div>
                       <select class="form-select" v-model="form.copyCode">
                           <option value="">Escolha um exemplar deste livro...</option>
                           <option v-for="copy in selectedCatalogBook.copies" :key="copy.id" :value="copy.copyCode">
                               {{ copy.copyCode }} ({{ copy.status === 'AVAILABLE' ? 'Disponível' : 'Emprestado' }})
                           </option>
                       </select>
                   </div>

                   <!-- Show Selected Book Details -->
                   <div v-if="selectedLoan || (selectedCatalogBook && form.copyCode)" class="card mt-2 border-primary-subtle bg-primary-subtle">
                       <div class="card-body d-flex align-items-center p-3">
                           <div class="bg-white p-2 rounded me-3 shadow-sm d-flex align-items-center justify-content-center" style="width: 50px; height: 70px;">
                               <img v-if="currentBookInfo?.cover" :src="currentBookInfo.cover" class="img-fluid rounded" />
                               <i v-else class="bi bi-book fs-3 text-primary"></i>
                           </div>
                           <div>
                               <h6 class="fw-bold mb-1 text-primary">{{ currentBookInfo?.title }}</h6>
                               <div class="small">
                                   <span class="badge bg-white text-dark border me-2">{{ currentBookInfo?.copyCode }}</span>
                                   <span class="text-muted" v-if="selectedLoan"><i class="bi bi-calendar-event me-1"></i>Devolução: {{ new Date(selectedLoan.dueDate).toLocaleDateString() }}</span>
                               </div>
                           </div>
                       </div>
                   </div>

                </div>
                
                <div class="col-md-3">
                    <label class="form-label fw-bold">Dias Atraso</label>
                    <input type="number" class="form-control" v-model="calculator.days" placeholder="0">
                </div>

                <div class="col-md-3">
                    <label class="form-label fw-bold">Valor/Dia (R$)</label>
                    <input type="number" step="0.50" class="form-control" v-model="calculator.rate" placeholder="0.00">
                </div>
                
                <div class="col-md-6">
                    <label class="form-label fw-bold">Valor Total</label>
                    <div class="input-group">
                        <span class="input-group-text">R$</span>
                        <input type="text" class="form-control bg-light fw-bold text-danger" :value="calculatedTotal" readonly>
                    </div>
                </div>
                
                 <div class="col-12">
                    <label class="form-label fw-bold">Motivo (Descrição da Multa)</label>
                    <input type="text" class="form-control" v-model="form.reason" placeholder="Ex: Devolução atrasada...">
                </div>
            </div>

            <div class="mt-4 text-end">
                <button class="btn btn-light me-2" @click="closeCreateModal">Cancelar</button>
                <button class="btn btn-danger" @click="handleCreate" :disabled="!form.value || !form.reason">
                    <i class="bi bi-save"></i> Registrar Multa
                </button>
            </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #0f172a;
  overflow-x: hidden;
  font-family: "Inter", sans-serif;
}
.hero-bg-anim {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(220, 53, 69, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.1) 0%, transparent 50%);
  z-index: 1;
}
.shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 0; }
.shape-1 { width: 400px; height: 400px; background: #dc3545; top: -100px; left: -100px; }
.shape-2 { width: 500px; height: 500px; background: #ffc107; bottom: -100px; right: -100px; }

.glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center; z-index: 3000;
}
.modal-content { max-width: 800px; width: 90%; border: none; }
</style>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

// Stores
// Stores
const { fines, fetchFines, createFine, payFine, loading: finesLoading } = useFineStore();
const { users, fetchUsers, getHistory } = useUserStore();
const { searchBooks } = useBookStore();

const activeTab = ref('PENDING');
const showCreateModal = ref(false);
const searchText = ref("");
const loading = computed(() => finesLoading.value);

const filteredFines = computed(() => {
    let list = fines.value.filter(f => f.status === activeTab.value);
    
    if (searchText.value) {
        const term = searchText.value.toLowerCase();
        list = list.filter(f => 
            (f.user?.name && f.user.name.toLowerCase().includes(term)) ||
            (f.user?.matricula && f.user.matricula.toLowerCase().includes(term)) ||
            (f.loan?.bookCopy?.book?.title && f.loan.bookCopy.book.title.toLowerCase().includes(term))
        );
    }
    
    return list;
});

// Create Modal State
const userSearch = ref("");
const bookSearch = ref(""); // Combined search
const bookResults = ref([]);
const selectedCatalogBook = ref(null);
const selectedUser = ref(null);
const userLoans = ref([]);
const calculator = ref({
    days: 0,
    rate: 2.00 // Padrão 2 reias por dia
});

const form = ref({
    loanId: "",
    copyCode: "", // For non-loan linked fines
    value: 0,
    reason: ""
});

const calculatedTotal = computed(() => {
    return (calculator.value.days * calculator.value.rate).toFixed(2);
});

const selectedLoan = computed(() => {
    if (!form.value.loanId) return null;
    return userLoans.value.find(l => l.id === form.value.loanId);
});

const currentBookInfo = computed(() => {
    if (selectedLoan.value) {
        return {
            title: selectedLoan.value.bookCopy?.book?.title,
            copyCode: selectedLoan.value.bookCopy?.copyCode,
            cover: selectedLoan.value.bookCopy?.book?.cover
        };
    }
    if (selectedCatalogBook.value && form.value.copyCode) {
        return {
            title: selectedCatalogBook.value.title,
            copyCode: form.value.copyCode,
            cover: selectedCatalogBook.value.cover
        };
    }
    return null;
});

// Watch for book selection and auto-fill reason
watch(currentBookInfo, (newInfo) => {
    if (newInfo) {
        form.value.reason = `${newInfo.title} (${newInfo.copyCode})`;
    } else {
        form.value.reason = "";
    }
});

const filteredUserLoans = computed(() => {
    if (!bookSearch.value) return userLoans.value;
    const term = bookSearch.value.toLowerCase();
    return userLoans.value.filter(l => 
        l.bookCopy?.book?.title?.toLowerCase().includes(term) ||
        l.bookCopy?.copyCode?.toLowerCase().includes(term)
    );
});

// Catalog Search Logic
const handleFineBookSearch = async () => {
    if (bookSearch.value.length >= 2) {
        bookResults.value = await searchBooks(bookSearch.value);
    } else {
        bookResults.value = [];
    }
};

const selectCatalogBook = (book) => {
    selectedCatalogBook.value = book;
    bookSearch.value = book.title;
    bookResults.value = [];
    form.value.loanId = ""; // mutually exclusive
};

// User Search Logic
const userResults = computed(() => {
    if (!userSearch.value || userSearch.value.length < 2) return [];
    const term = userSearch.value.toLowerCase();
    return users.value.filter(u => 
        u.name.toLowerCase().includes(term) || 
        (u.matricula && u.matricula.toLowerCase().includes(term))
    ).slice(0, 5);
});

const selectUser = async (user) => {
    selectedUser.value = user;
    bookSearch.value = ""; 
    // Fetch loans for this user to populate select
    const history = await getHistory(user.id);
    userLoans.value = history || [];
    userSearch.value = ""; // clear search
};

const handleCreate = async () => {
    const finalValue = parseFloat(calculatedTotal.value);
    if (!selectedUser.value || finalValue <= 0 || !form.value.reason) {
        Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
        return;
    }

    if (!form.value.loanId && !form.value.copyCode) {
         const confirm = await Swal.fire({
             title: 'Sem vínculo?',
             text: 'Você não selecionou um livro/empréstimo. Deseja criar uma multa avulsa?',
             icon: 'question',
             showCancelButton: true
         });
         if (!confirm.isConfirmed) return;
    }

    const { error } = await createFine({
        userMatricula: selectedUser.value.matricula,
        loanId: form.value.loanId || undefined,
        value: finalValue,
        reason: form.value.reason
    });

    if (!error) {
        Swal.fire({
            title: 'Sucesso',
            text: 'Multa registrada com sucesso!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        closeCreateModal();
        await fetchFines();
    } else {
        Swal.fire('Erro', 'Ocorreu um erro ao registrar a multa.', 'error');
    }
};

const handlePay = async (fine) => {
    const result = await Swal.fire({
        title: 'Baixar Multa?',
        text: `Confirmar pagamento de R$ ${fine.value.toFixed(2)}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        const { error } = await payFine(fine.id);
        if (!error) {
            Swal.fire('Pago!', 'Multa baixada com sucesso.', 'success');
            await fetchFines();
        } else {
            Swal.fire('Erro', 'Não foi possível baixar a multa.', 'error');
        }
    }
};

const openCreateModal = () => {
    resetForm();
    showCreateModal.value = true;
};

const closeCreateModal = () => {
    showCreateModal.value = false;
    resetForm();
};

const resetForm = () => {
    selectedUser.value = null;
    userSearch.value = "";
    bookSearch.value = "";
    bookResults.value = [];
    selectedCatalogBook.value = null;
    userLoans.value = [];
    calculator.value = { days: 0, rate: 2.00 };
    form.value = { loanId: "", copyCode: "", value: 0, reason: "" };
}

onMounted(async () => {
    await fetchFines();
    await fetchUsers(); // Pre-fetch users for search, or we could search via API on type if list is huge. 
    // Assuming for now generic fetchUsers loads all or enough. 
    // Ideally we should use useUserStore().search() if list is massive.
});
</script>
