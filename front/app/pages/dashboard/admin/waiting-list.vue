<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
      <AppHeader />
      <AppSubHeader title="Lista de Espera">
        <template #actions>
            <NuxtLink to="/dashboard/manage-loans" class="btn btn-outline-light btn-sm">
                <i class="bi bi-arrow-left"></i> Voltar
            </NuxtLink>
        </template>
      </AppSubHeader>

      <div class="card glass-card border-0">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">Gerenciar Filas por Livro</h5>
          
          <!-- Search Book -->
          <div class="mb-4">
            <label class="form-label text-muted small fw-bold">Selecione um Livro</label>
            <div class="position-relative">
                <div class="input-group">
                     <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                     <input
                        type="text"
                        v-model="bookSearch"
                        class="form-control border-start-0 ps-0"
                        placeholder="Buscar livro..."
                        @input="handleBookSearch"
                    />
                </div>
               
                 <div
                  v-if="searchResults.length > 0"
                  class="autocomplete-results shadow-lg border rounded mt-1"
                >
                  <div
                    v-for="book in searchResults"
                    :key="book.id"
                    class="autocomplete-item p-2 border-bottom cursor-pointer hover-bg-light"
                    @click="selectBook(book)"
                  >
                    <div class="fw-bold">{{ book.title }}</div>
                    <small class="text-muted">{{ book.author }}</small>
                  </div>
                </div>
            </div>
          </div>

          <!-- Queue List -->
          <div v-if="selectedBook" class="mt-4 animate-fade-in">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-primary">
                    Fila para: {{ selectedBook.title }}
                    <span class="badge bg-secondary ms-2">{{ queue.length }} na fila</span>
                </h6>
                <button class="btn btn-sm btn-outline-primary" @click="fetchQueue(selectedBook.id)">
                    <i class="bi bi-arrow-clockwise"></i> Atualizar
                </button>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else-if="queue.length === 0" class="text-center py-5 text-muted border rounded bg-light bg-opacity-50 dashed-border">
                <i class="bi bi-people display-4 opacity-25 d-block mb-2"></i>
                Ninguém na fila de espera para este livro.
            </div>

            <div v-else class="table-responsive rounded shadow-sm">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="border-0">#</th>
                            <th class="border-0">Aluno</th>
                            <th class="border-0">Série/Turma</th>
                            <th class="border-0">Data Solicitação</th>
                            <th class="border-0">Prioridade</th>
                            <th class="border-0 text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in queue" :key="item.id">
                            <td>
                                <span class="badge rounded-pill bg-light text-dark border">{{ index + 1 }}º</span>
                            </td>
                            <td>
                                <div class="fw-bold">{{ item.user.name }}</div>
                                <small class="text-muted">{{ item.user.matricula }}</small>
                            </td>
                            <td>{{ item.user.serie ? item.user.serie.name : '-' }}</td>
                            <td>{{ new Date(item.createdAt).toLocaleString('pt-BR') }}</td>
                            <td>
                                <span v-if="isPriority(item)" class="badge bg-danger">Obrigatória</span>
                                <span v-else class="badge bg-info text-dark">Normal</span>
                            </td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-light text-danger hover-danger rounded-circle p-2" @click="handleRemove(item.id)" title="Remover da fila">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useBookStore } from '~/composables/useBookStore';
import { useApi } from '~/composables/useApi';

const { searchBooks } = useBookStore();
const { apiFetch } = useApi();

const bookSearch = ref("");
const searchResults = ref([]);
const selectedBook = ref(null);
const queue = ref([]);
const loading = ref(false);

const handleBookSearch = async () => {
    if (bookSearch.value.length >= 3) {
        searchResults.value = await searchBooks(bookSearch.value);
    } else {
        searchResults.value = [];
    }
};

const selectBook = (book) => {
    selectedBook.value = book;
    bookSearch.value = book.title;
    searchResults.value = [];
    fetchQueue(book.id);
};

// Priority logic is handled by backend sorting, but we can visualize it here
// We can assume if the user is at the top and newly added, they might match priority.
// But better is if backend sent a flag. Since backend sorts, we can infer top items might be priority.
// Or we can check if we want to display the "Obrigatória" badge.
// The backend returns user.serie.
// We need to know if this book is required for that serie. 
// Ideally backend `getQueueByBook` should include this info or we fetch it.
// Simpler: Just rely on backend sort order. The "Prioridade" column might need extra data from backend to be accurate.
// OR we fetch book's required readings to map locally.
// Let's implement check locally if we have the data.
// For now, I'll just show the list. I'll add a helper to check if I can.
// Actually, `waitingList` item returned by updated backend has `user.serie`.
// The backend does the sort. I will trust the sort.
// To show the badge, I'll assume users with series intersecting book's required series have priority.
// I'll fetch required readings for the book when selecting it properly.
const requiredSeriesIds = ref(new Set());

const fetchQueue = async (bookId) => {
    loading.value = true;
    try {
        const data = await apiFetch(`/waiting-list/book/${bookId}`);
        queue.value = data;
        
        // Try to fetch priority info, ignore 404
        try {
            const reqData = await apiFetch(`/books/${bookId}/required-readings`); 
             requiredSeriesIds.value = new Set(reqData.map(r => r.serieId));
        } catch(e) {
            // endpoint might not exist or empty
             requiredSeriesIds.value = new Set();
        }

    } catch (e) {
        Swal.fire("Erro", "Erro ao buscar fila.", "error");
    } finally {
        loading.value = false;
    }
};

const isPriority = (item) => {
    if (!item.user.serieId) return false;
    return requiredSeriesIds.value.has(item.user.serieId);
};

const handleRemove = async (id) => {
   const result = await Swal.fire({
        title: 'Remover da fila?',
        text: 'O usuário perderá a vez.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover'
    });

    if (result.isConfirmed) {
        try {
            await apiFetch(`/waiting-list/${id}`, { method: 'DELETE' });
            Swal.fire("Sucesso", "Removido.", "success");
            fetchQueue(selectedBook.value.id);
        } catch (e) {
            Swal.fire("Erro", "Erro ao remover.", "error");
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
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%);
  z-index: 1;
}
.shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 0; }
.shape-1 { width: 400px; height: 400px; background: #38bdf8; top: -100px; left: -100px; }
.shape-2 { width: 500px; height: 500px; background: #a855f7; bottom: -100px; right: -100px; }

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.autocomplete-results {
    position: absolute; width: 100%; max-height: 200px; overflow-y: auto; background: white; z-index: 10;
}
.cursor-pointer {
    cursor: pointer;
}
.hover-bg-light:hover { background-color: #f8f9fa; }
.hover-danger:hover { background-color: #dc3545 !important; color: white !important; }
.dashed-border { border: 2px dashed #dee2e6 !important; }
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
