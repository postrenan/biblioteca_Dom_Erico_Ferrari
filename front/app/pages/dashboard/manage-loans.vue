<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
    <AppHeader />
    <AppSubHeader title="Controle de Empréstimos">
        <template #actions>
             <!-- No specific actions for loans yet, maybe filters later? -->
        </template>
    </AppSubHeader>

    <!-- Checkout Form -->
    <div class="card glass-card mb-5 border-0">
      <div class="card-body p-3 p-md-4">
        <h5
          class="card-title mb-4 fw-bold text-secondary text-uppercase fs-6 tracking-wide"
        >
          <i class="bi bi-journal-plus me-2 text-primary"></i>Novo Empréstimo
        </h5>
        <form @submit.prevent="handleCheckout">
          <div class="row g-3">
            <div class="col-12 col-md-5">
              <div class="form-floating position-relative">
                <input
                  v-model="bookSearchQuery"
                  type="text"
                  class="form-control bg-transparent"
                  id="bookSearch"
                  placeholder="Buscar Livro (Nome ou Autor)"
                  @input="handleBookSearch"
                  autocomplete="off"
                />
                <label for="bookSearch">Buscar Livro (Nome ou Autor)</label>

                <!-- Autocomplete Dropdown -->
                <div
                  v-if="searchResults.length > 0"
                  class="autocomplete-results shadow-lg border rounded mt-1 shadow-sm"
                >
                  <div
                    v-for="book in searchResults"
                    :key="book.id"
                    class="autocomplete-item p-2 border-bottom cursor-pointer"
                    @click="selectBook(book)"
                  >
                    <div class="fw-bold">{{ book.title }}</div>
                    <small class="text-muted"
                      >{{ book.author }} -
                      {{ book.availableCopies }} disponíveis</small
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-3" v-if="selectedBookForLoan">
              <div class="form-floating">
                <select
                  v-model="checkoutForm.copyCode"
                  class="form-select bg-transparent"
                  id="copySelect"
                  required
                >
                  <option value="" disabled>Escolha um exemplar...</option>
                  <option
                    v-for="copy in selectedBookForLoan.copies.filter(
                      (c) => c.status === 'AVAILABLE'
                    )"
                    :key="copy.id"
                    :value="copy.copyCode"
                  >
                    {{ copy.copyCode }}
                  </option>
                </select>
                <label for="copySelect">Exemplar Disponível</label>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="form-floating position-relative">
                <input
                  v-model="userSearchQuery"
                  type="text"
                  class="form-control bg-transparent"
                  id="userSearch"
                  placeholder="Buscar Usuário (Nome ou Matrícula)"
                  @input="handleUserSearch"
                  autocomplete="off"
                  required
                />
                <label for="userSearch"
                  >Buscar Usuário (Nome ou Matrícula)</label
                >

                <!-- User Autocomplete Dropdown -->
                <div
                  v-if="userSearchResults.length > 0"
                  class="autocomplete-results shadow-lg border rounded mt-1 shadow-sm"
                >
                  <div
                    v-for="u in userSearchResults"
                    :key="u.id"
                    class="autocomplete-item p-2 border-bottom cursor-pointer"
                    @click="selectUser(u)"
                  >
                    <div class="fw-bold">{{ u.name }}</div>
                    <small class="text-muted"
                      >Matrícula: {{ u.matricula }}</small
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="col-8 col-md-3">
              <div class="form-floating">
                <input
                  v-model="checkoutForm.returnDate"
                  type="date"
                  class="form-control bg-transparent"
                  id="retDate"
                  :min="todayDate"
                  required
                />
                <label for="retDate">Data de Devolução</label>
              </div>
            </div>
            <div class="col-4 col-md-1 d-flex align-items-center">
              <button
                type="submit"
                class="btn btn-success w-100 py-3 fw-bold shadow-sm"
                style="height: 58px"
                :disabled="loading"
              >
                <i class="bi bi-check-lg"></i>
              </button>
            </div>
          </div>
          <div
            v-if="message"
            :class="`alert alert-${messageType} mt-3 shadow-sm border-0 d-flex align-items-center`"
          >
            <i class="bi bi-info-circle-fill me-2 fs-5"></i> {{ message }}
          </div>
        </form>
      </div>
    </div>

    <!-- Active Loans List -->
    <div class="card glass-card border-0 mb-5">
      <div class="card-body p-0">
        <div
          class="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
        >
          <h5
            class="mb-0 fw-bold text-secondary text-uppercase fs-6 tracking-wide"
          >
            <i class="bi bi-collection-fill me-2 text-primary"></i>Gestão de
            Prazos
          </h5>
          <div class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 w-100 w-md-auto">
             <div class="input-group input-group-sm shadow-sm" style="min-width: 200px">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  v-model="loanSearchQuery"
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Buscar emprestimo..."
                />
              </div>
            <div class="btn-group btn-group-sm shadow-sm">
              <button
                class="btn"
                :class="!showOverdueOnly ? 'btn-primary' : 'btn-outline-primary'"
                @click="toggleOverdueView(false)"
              >
                Ativos
              </button>
              <button
                class="btn"
                :class="showOverdueOnly ? 'btn-danger' : 'btn-outline-danger'"
                @click="toggleOverdueView(true)"
              >
                Atrasados
              </button>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Livro / Exemplar</th>
                <th>Usuário</th>
                <th>Data Limite</th>
                <th class="text-end pe-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="loan in activeLoans" :key="loan.id">
                <td class="ps-4">
                  <div class="fw-bold">
                    {{ loan.bookCopy?.book?.title || "Livro" }}
                  </div>
                  <small
                    class="text-muted font-monospace bg-light px-2 rounded"
                    >{{ loan.bookCopy?.copyCode }}</small
                  >
                </td>
                <td>
                  <div>{{ loan.user?.name }}</div>
                  <small class="text-muted" style="font-size: 0.75rem">{{
                    loan.user?.matricula || loan.userId
                  }}</small>
                </td>
                <td>
                  <span
                    :class="
                      new Date(loan.dueDate) < new Date()
                        ? 'text-danger fw-bold'
                        : 'text-dark'
                    "
                  >
                    {{ formatDate(loan.dueDate) }}
                  </span>
                  <div
                    v-if="new Date(loan.dueDate) < new Date()"
                    class="badge bg-danger ms-1"
                  >
                    Atrasado
                  </div>
                  <div v-if="loan.renewCount > 0" class="mt-1">
                    <small
                      class="badge bg-info-subtle text-info border border-info"
                    >
                      <i class="bi bi-clock-history"></i> {{ loan.renewCount }}x
                      Renovado
                    </small>
                    <div
                      v-if="loan.renewals?.length > 0"
                      class="small text-muted mt-1"
                      style="font-size: 0.7rem"
                    >
                      Última por:
                      {{
                        loan.renewals[loan.renewals.length - 1].renewedBy
                          ?.name || "Sistema"
                      }}
                    </div>
                  </div>
                </td>
                <td class="text-end pe-4">
                  <button
                    class="btn btn-sm btn-outline-info shadow-sm me-1"
                    @click="handleStaffRenew(loan.id)"
                    :disabled="loading"
                  >
                    <i class="bi bi-clock-history"></i> Renovar
                  </button>
                  <button
                    class="btn btn-sm btn-outline-primary shadow-sm"
                    @click="handleReturn(loan.id)"
                    :disabled="loading"
                  >
                    <i class="bi bi-arrow-return-left me-1"></i> Devolver
                  </button>
                </td>
              </tr>
              <tr v-if="activeLoans.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                  Nenhum empréstimo ativo.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Fines Management Section -->
    <div class="row g-4 mb-5">
      <div class="col-md-12">
        <div class="card glass-card border-0 h-100">
          <div
            class="card-header bg-warning text-dark border-0 py-3 rounded-top"
          >
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-calculator me-2"></i>Calculadora de Multas
            </h5>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleRegisterFine">
              <div class="mb-3">
                <label
                  class="form-label text-muted small text-uppercase fw-bold"
                  >Buscar Usuário</label
                >
                <div class="position-relative">
                  <input
                    v-model="fineUserSearchQuery"
                    type="text"
                    class="form-control bg-transparent"
                    placeholder="Nome ou Matrícula"
                    @input="handleFineUserSearch"
                    autocomplete="off"
                    required
                  />
                  <!-- Fine User Autocomplete Dropdown -->
                  <div
                    v-if="fineUserSearchResults.length > 0"
                    class="autocomplete-results shadow-lg border rounded mt-1"
                  >
                    <div
                      v-for="u in fineUserSearchResults"
                      :key="u.id"
                      class="autocomplete-item p-2 border-bottom"
                      @click="selectFineUser(u)"
                    >
                      <div class="fw-bold">{{ u.name }}</div>
                      <small class="text-muted"
                        >Matrícula: {{ u.matricula }}</small
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label
                    class="form-label text-muted small text-uppercase fw-bold"
                    >Dias Atraso</label
                  >
                  <input
                    v-model="calc.days"
                    type="number"
                    class="form-control bg-transparent"
                    @input="calculateFine"
                  />
                </div>
                <div class="col-6 mb-3">
                  <label
                    class="form-label text-muted small text-uppercase fw-bold"
                    >Valor/Dia (R$)</label
                  >
                  <input
                    v-model="calc.rate"
                    type="number"
                    step="0.50"
                    class="form-control bg-transparent"
                    @input="calculateFine"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label
                  class="form-label text-muted small text-uppercase fw-bold"
                  >Valor Total</label
                >
                <div class="input-group">
                  <span
                    class="input-group-text bg-transparent border-end-0 fw-bold text-success"
                    >R$</span
                  >
                  <input
                    v-model="fineForm.value"
                    type="number"
                    step="0.01"
                    class="form-control bg-transparent border-start-0 fs-5 fw-bold text-success"
                  />
                </div>
              </div>
                <div class="position-relative mb-3">
                  <label class="form-label text-muted small text-uppercase fw-bold">Buscar Livro</label>
                  <div class="input-group">
                    <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-search"></i></span>
                    <input
                      v-model="fineBookSearchQuery"
                      type="text"
                      class="form-control bg-transparent border-start-0"
                      placeholder="Nome ou Código"
                      @input="handleFineBookSearch"
                      autocomplete="off"
                    />
                  </div>
                  <!-- Fine Book Autocomplete Dropdown -->
                  <div
                    v-if="fineBookSearchResults.length > 0"
                    class="autocomplete-results shadow-lg border rounded mt-1"
                  >
                    <div
                      v-for="b in fineBookSearchResults"
                      :key="b.id"
                      class="autocomplete-item p-2 border-bottom"
                      @click="selectFineBook(b)"
                    >
                      <div class="fw-bold">{{ b.title }}</div>
                      <small class="text-muted">{{ b.author }}</small>
                    </div>
                  </div>
                </div>

                <div class="mb-3" v-if="selectedFineBook">
                  <label class="form-label text-muted small text-uppercase fw-bold">Selecionar Exemplar</label>
                  <select class="form-select bg-transparent" v-model="fineForm.copyCode">
                    <option value="" disabled>Escolha o exemplar...</option>
                    <option v-for="copy in selectedFineBook.copies" :key="copy.id" :value="copy.copyCode">
                       {{ copy.copyCode }} ({{ copy.status === 'AVAILABLE' ? 'Disponível' : 'Emprestado' }})
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <label
                    class="form-label text-muted small text-uppercase fw-bold"
                    >Motivo</label
                  >
                  <textarea
                    v-model="fineForm.reason"
                    class="form-control bg-transparent"
                    rows="2"
                    placeholder="Ex: Devolução atrasada..."
                  ></textarea>
                </div>
              <button
                type="submit"
                class="btn btn-warning w-100 fw-bold shadow-sm"
              >
                Registrar Multa
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";

const { loans, fetchAllLoans, checkoutBook, returnBook, renewLoan, loading } =
  useLoanStore();
const { searchBooks } = useBookStore();
const { searchUsers } = useUserStore();
const { fines, createFine, fetchAllFines, payFine } = useFineStore();
const { logout } = useAuth();

const checkoutForm = ref({
  copyCode: "",
  userMatricula: "",
  returnDate: "",
});

const message = ref("");
const messageType = ref("info");

onMounted(() => {
  fetchAllLoans();
  fetchAllFines();
});

// --- Search Logic ---
const bookSearchQuery = ref("");
const searchResults = ref([]);
const selectedBookForLoan = ref(null);

const todayDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const handleBookSearch = async () => {
  if (bookSearchQuery.value.length >= 3) {
    const results = await searchBooks(bookSearchQuery.value);
    searchResults.value = results;
  } else {
    searchResults.value = [];
  }
};

const selectBook = (book) => {
  selectedBookForLoan.value = book;
  bookSearchQuery.value = book.title;
  searchResults.value = [];
  checkoutForm.value.copyCode = ""; // Reset copy selection
};

// --- User Search Logic (Loan) ---
const userSearchQuery = ref("");
const userSearchResults = ref([]);

const handleUserSearch = async () => {
  if (userSearchQuery.value.length >= 3) {
    userSearchResults.value = await searchUsers(userSearchQuery.value);
  } else {
    userSearchResults.value = [];
  }
};

const selectUser = (u) => {
  checkoutForm.value.userMatricula = u.matricula;
  userSearchQuery.value = u.name;
  userSearchResults.value = [];
};

// --- Logic for Fines ---
const fineForm = ref({
  userMatricula: "",
  value: 0,
  reason: "",
  copyCode: ""
});

const calc = ref({
  days: 0,
  rate: 2.0, // Default fine rate
});

const calculateFine = () => {
  fineForm.value.value = (calc.value.days * calc.value.rate).toFixed(2);
};

// --- User Search Logic (Fine) ---
const fineUserSearchQuery = ref("");
const fineUserSearchResults = ref([]);

const handleFineUserSearch = async () => {
  if (fineUserSearchQuery.value.length >= 2) {
    fineUserSearchResults.value = await searchUsers(fineUserSearchQuery.value);
  } else {
    fineUserSearchResults.value = [];
  }
};

const selectFineUser = (u) => {
  fineForm.value.userMatricula = u.matricula;
  fineUserSearchQuery.value = u.name;
  fineUserSearchResults.value = [];
};

// --- Book Search Logic (Fine) ---
const fineBookSearchQuery = ref("");
const fineBookSearchResults = ref([]);
const selectedFineBook = ref(null);

const handleFineBookSearch = async () => {
  if (fineBookSearchQuery.value.length >= 2) {
    fineBookSearchResults.value = await searchBooks(fineBookSearchQuery.value);
  } else {
    fineBookSearchResults.value = [];
  }
};

const selectFineBook = (book) => {
  selectedFineBook.value = book;
  fineBookSearchQuery.value = book.title;
  fineBookSearchResults.value = [];
};

// Watch book selection for auto-fill reason
watch([selectedFineBook, () => fineForm.value.copyCode], ([book, copy]) => {
  if (book) {
    fineForm.value.reason = `${book.title} ${copy ? `(${copy})` : ''}`.trim();
  }
});

const recentFinesSearchQuery = ref("");
const filteredRecentFines = computed(() => {
  if (!recentFinesSearchQuery.value) return fines.value;
  const q = recentFinesSearchQuery.value.toLowerCase();
  return fines.value.filter(f => 
    f.user?.name?.toLowerCase().includes(q) ||
    f.user?.matricula?.toLowerCase().includes(q) ||
    f.reason?.toLowerCase().includes(q)
  );
});

const showOverdueOnly = ref(false);
const loanSearchQuery = ref("");
const activeLoans = computed(() => {
  let list = loans.value.filter(
    (l) => l.status === "ACTIVE" || l.status === "OVERDUE"
  );

  if (showOverdueOnly.value) {
    list = list.filter(
      (l) => l.status === "OVERDUE" || new Date(l.dueDate) < new Date()
    );
  }

  if (loanSearchQuery.value) {
    const q = loanSearchQuery.value.toLowerCase();
    list = list.filter(
      (l) =>
        l.bookCopy?.book?.title?.toLowerCase().includes(q) ||
        l.user?.name?.toLowerCase().includes(q) ||
        l.user?.matricula?.toLowerCase().includes(q)
    );
  }

  return list;
});

const toggleOverdueView = async () => {
  showOverdueOnly.value = !showOverdueOnly.value;
  if (showOverdueOnly.value) {
    // Assuming there is a fetchOverdueLoans or we just filter locally
    await fetchAllLoans(); 
  } else {
    await fetchAllLoans();
  }
};

const handleStaffRenew = async (loanId) => {
  const result = await Swal.fire({
    title: "Confirmar Renovação?",
    text: "Esta renovação será registrada em seu nome (Ilimitado para Staff).",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim, renovar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    const { error } = await renewLoan(loanId);
    if (error.value) {
      Swal.fire(
        "Erro",
        "Erro ao renovar: " + (error.value.data?.message || ""),
        "error"
      );
    } else {
      Swal.fire("Sucesso", "Empréstimo renovado com sucesso!", "success");
      await fetchAllLoans();
    }
  }
};

const handleCheckout = async () => {
  if (!checkoutForm.value.copyCode) {
    Swal.fire("Aviso", "Por favor, selecione um exemplar.", "warning");
    return;
  }

  message.value = "";
  const { error } = await checkoutBook(
    checkoutForm.value.copyCode,
    checkoutForm.value.userMatricula,
    checkoutForm.value.returnDate
  );

  if (error.value) {
    Swal.fire(
      "Erro",
      "Erro ao realizar empréstimo. Verifique os dados.",
      "error"
    );
  } else {
    Swal.fire("Sucesso", "Empréstimo realizado com sucesso!", "success");
    checkoutForm.value = { copyCode: "", userMatricula: "", returnDate: "" };
    bookSearchQuery.value = "";
    userSearchQuery.value = "";
    selectedBookForLoan.value = null;
    fetchAllLoans(); // Refresh list to see new loan
  }
};

const handleReturn = async (loanId) => {
  const result = await Swal.fire({
    title: "Confirmar devolução?",
    text: "Você não poderá reverter isso!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, devolver!",
  });

  if (result.isConfirmed) {
    const { error } = await returnBook(loanId);
    if (error.value) {
      Swal.fire("Erro", "Erro ao registrar devolução", "error");
    } else {
      Swal.fire("Devolvido!", "O livro foi devolvido.", "success");
      await fetchAllLoans();
    }
  }
};

const handleLogout = () => {
  logout();
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
};

const handleRegisterFine = async () => {
  if (!fineForm.value.userMatricula || !fineForm.value.reason || !fineForm.value.value) {
      Swal.fire("Aviso", "Preencha todos os campos obrigatórios.", "warning");
      return;
  }

  const { error } = await createFine({
    userMatricula: fineForm.value.userMatricula,
    value: parseFloat(fineForm.value.value),
    reason: fineForm.value.reason,
  });

  if (error) {
    Swal.fire("Erro", "Erro ao registrar multa: " + (error.value.data?.message || ""), "error");
  } else {
    Swal.fire({
        title: "Sucesso",
        text: "Multa registrada com sucesso!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
    });
    fineForm.value = { userMatricula: "", value: 0, reason: "", copyCode: "" };
    fineUserSearchQuery.value = "";
    fineBookSearchQuery.value = "";
    selectedFineBook.value = null;
    calc.value.days = 0;
    fetchAllFines();
  }
};

const handlePayFine = async (id) => {
  const result = await Swal.fire({
      title: 'Confirmar pagamento?',
      text: 'A multa será marcada como paga.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, pagar',
      cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
      const { error } = await payFine(id);
      if (!error) {
          Swal.fire('Sucesso', 'Pagamento registrado!', 'success');
          fetchAllFines();
      } else {
          Swal.fire('Erro', 'Não foi possível registrar o pagamento.', 'error');
      }
  }
};
</script>

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
  background: radial-gradient(
      circle at 20% 50%,
      rgba(0, 144, 25, 0.2) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(171, 215, 254, 0.15) 0%,
      transparent 50%
    );
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}
.shape-1 {
  width: 400px;
  height: 400px;
  background: #009019;
  top: -100px;
  left: -100px;
}
.shape-2 {
  width: 500px;
  height: 500px;
  background: #abd7fe;
  bottom: -100px;
  right: -100px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.autocomplete-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  max-height: 200px;
  overflow-y: auto;
}
.autocomplete-item {
  cursor: pointer;
  transition: background 0.2s;
}
.autocomplete-item:hover {
  background: #f8f9fa;
}
</style>
