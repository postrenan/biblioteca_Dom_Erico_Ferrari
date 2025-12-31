<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
      <AppHeader title="Leituras Obrigatórias" />

      <div class="card glass-card border-0 mb-4">
        <div class="card-body p-4">
            <h5 class="card-title mb-4 fw-bold text-secondary text-uppercase fs-6 tracking-wide">
              <i class="bi bi-bookmark-star-fill me-2 text-primary"></i>Adicionar Leitura Obrigatória
            </h5>

            <div class="row g-3 align-items-end">
                <div class="col-md-5">
                    <label class="form-label small fw-bold">Turma/Série</label>
                    <select class="form-select" v-model="selectedSerieId" @change="fetchReadings">
                        <option value="" disabled>Selecione uma turma...</option>
                        <option v-for="serie in series" :key="serie.id" :value="serie.id">
                            {{ serie.name }}
                        </option>
                    </select>
                </div>
                <div class="col-md-5">
                    <label class="form-label small fw-bold">Livro</label>
                    <div class="position-relative">
                        <div class="input-group">
                             <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                             <input type="text" class="form-control" placeholder="Buscar livro..." v-model="bookSearch" @focus="showBookResults = true">
                        </div>
                        <!-- Book Search Dropdown -->
                        <div v-if="showBookResults && filteredBooks.length > 0" class="position-absolute w-100 bg-white shadow-lg rounded mt-1 border" style="z-index: 1000; max-height: 200px; overflow-y: auto;">
                            <div v-for="book in filteredBooks" :key="book.id" class="p-2 border-bottom cursor-pointer hover-bg-light" @click="selectBook(book)">
                                <div class="fw-bold small">{{ book.title }}</div>
                                <div class="text-muted small" style="font-size: 0.75rem">{{ book.author }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="selectedBook" class="mt-1 small text-success">
                        <i class="bi bi-check-circle me-1"></i> Selecionado: <strong>{{ selectedBook.title }}</strong>
                    </div>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-primary w-100" @click="handleAdd" :disabled="!selectedSerieId || !selectedBook">
                        <i class="bi bi-plus-lg me-1"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
      </div>

      <!-- Readings List -->
      <div class="card glass-card border-0" v-if="selectedSerieId">
        <div class="card-body p-0">
             <div class="p-4 border-bottom">
                <h5 class="card-title mb-0 fw-bold text-secondary text-uppercase fs-6 tracking-wide">
                    Leituras Definidas
                </h5>
             </div>

             <div v-if="loading" class="text-center py-5">
                 <div class="spinner-border text-primary"></div>
             </div>

             <div v-else-if="currentReadings.length === 0" class="text-center py-5 text-muted">
                 Nenhuma leitura obrigatória para esta turma.
             </div>

             <div v-else class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Livro</th>
                            <th>Autor</th>
                            <th class="text-end pe-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reading in currentReadings" :key="reading.id">
                            <td class="ps-4 fw-bold">{{ reading.book?.title }}</td>
                            <td>{{ reading.book?.author }}</td>
                            <td class="text-end pe-4">
                                <button class="btn btn-sm btn-outline-danger" @click="handleRemove(reading.id)">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

const { series, fetchSeries } = useSeriesStore();
const { books, fetchBooks } = useBookStore();
const { 
    fetchRequiredReadingsBySerie, 
    createRequiredReading, 
    deleteRequiredReading, 
    loading 
} = useRequiredReadingsStore();

const selectedSerieId = ref("");
const bookSearch = ref("");
const showBookResults = ref(false);
const selectedBook = ref(null);
const currentReadings = ref([]);

onMounted(() => {
    fetchSeries();
    fetchBooks();
});

const filteredBooks = computed(() => {
    if (!bookSearch.value) return [];
    return books.value.filter(b => 
        b.title.toLowerCase().includes(bookSearch.value.toLowerCase()) || 
        b.author.toLowerCase().includes(bookSearch.value.toLowerCase())
    ).slice(0, 5);
});

const selectBook = (book) => {
    selectedBook.value = book;
    bookSearch.value = book.title;
    showBookResults.value = false;
};

const fetchReadings = async () => {
    if (!selectedSerieId.value) return;
    currentReadings.value = await fetchRequiredReadingsBySerie(selectedSerieId.value);
};

const handleAdd = async () => {
    if (!selectedSerieId.value || !selectedBook.value) return;
    
    // Check duplicate locally
    if (currentReadings.value.some(r => r.bookId === selectedBook.value.id)) {
        Swal.fire('Aviso', 'Este livro já está na lista desta turma.', 'warning');
        return;
    }

    const { error } = await createRequiredReading({
        serieId: selectedSerieId.value,
        bookId: selectedBook.value.id
    });

    if (!error) {
        Swal.fire('Sucesso', 'Leitura adicionada!', 'success');
        selectedBook.value = null;
        bookSearch.value = "";
        await fetchReadings();
    } else {
        Swal.fire('Erro', 'Erro ao adicionar leitura.', 'error');
    }
};

const handleRemove = async (id) => {
    const result = await Swal.fire({
        title: 'Remover leitura?',
        text: "Isso removerá o livro da lista de obrigatórios desta turma.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        const { error } = await deleteRequiredReading(id);
        if (!error) {
            Swal.fire('Removido', 'Leitura removida com sucesso.', 'success');
            await fetchReadings();
        } else {
            Swal.fire('Erro', 'Erro ao remover.', 'error');
        }
    }
};

// Close dropdown on outside click (simple implementation)
// Ideally utilize a click-outside directive
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

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.hover-bg-light:hover {
    background-color: #f8f9fa;
}
.cursor-pointer {
    cursor: pointer;
}
</style>
