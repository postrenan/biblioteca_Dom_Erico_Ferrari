<template>
  <div class="card glass-card border-0">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h5 class="card-title fw-bold text-secondary text-uppercase fs-6 tracking-wide mb-0">
          <i class="bi bi-hourglass-split me-2 text-primary"></i>Minha Fila de Espera
        </h5>
        
        <span class="badge" :class="waitingList.length >= 3 ? 'bg-danger' : 'bg-primary'">
           {{ waitingList.length }} / 3
        </span>
      </div>

      <!-- Search to Join -->
      <div v-if="waitingList.length < 3" class="mb-4">
        <label class="form-label fw-bold text-muted small">Entrar na fila de um livro</label>
        <div class="position-relative">
             <div class="input-group">
                 <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                 <input 
                    type="text" 
                    class="form-control border-start-0 ps-0" 
                    placeholder="Busque por título do livro..." 
                    v-model="searchQuery" 
                    @input="handleSearch"
                >
             </div>
             
             <!-- Search Results Dropdown -->
             <div v-if="searchResults.length > 0" class="position-absolute w-100 mt-1 shadow-lg rounded bg-white" style="z-index: 1000; max-height: 250px; overflow-y: auto;">
                 <div v-for="book in searchResults" :key="book.id" class="p-3 border-bottom hover-bg-light d-flex align-items-center justify-content-between">
                     <div class="d-flex align-items-center gap-3">
                         <img :src="fixImageUrl(book.coverUrl)" class="rounded object-fit-cover shadow-sm" style="width: 40px; height: 60px;">
                         <div>
                             <div class="fw-bold text-dark">{{ book.title }}</div>
                             <small class="text-muted">{{ book.author }}</small>
                             <div class="d-flex align-items-center gap-2 mt-1">
                                 <span class="badge bg-light text-dark border">{{ book.totalCopies }} Cópias</span>
                                 <span class="badge" :class="book.availableCopies > 0 ? 'bg-success' : 'bg-danger'">
                                     {{ book.availableCopies > 0 ? 'Disponível' : 'Indisponível' }}
                                 </span>
                             </div>
                         </div>
                     </div>
                     <button 
                        class="btn btn-sm btn-primary fw-bold" 
                        @click="confirmJoin(book)"
                        :disabled="isAlreadyInQueue(book.id)"
                    >
                        {{ isAlreadyInQueue(book.id) ? 'Na Fila' : 'Entrar na Fila' }}
                     </button>
                 </div>
             </div>
        </div>
      </div>
      
      <div v-if="waitingList.length >= 3" class="alert alert-warning small py-2">
          Você atingiu o limite máximo de 3 livros na fila de espera.
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="waitingList.length === 0"
        class="text-center text-muted py-5 border rounded-3 bg-light bg-opacity-50 dashed-border"
      >
        <i class="bi bi-hourglass-bottom display-4 opacity-25 mb-3 d-block"></i>
        <p class="mb-0">Você não está em nenhuma fila de espera.</p>
        <small class="text-muted">Busque um livro acima para entrar na fila.</small>
      </div>

      <!-- List -->
      <div v-else class="d-flex flex-column gap-3">
        <div
          v-for="item in waitingList"
          :key="item.id"
          class="card border-0 shadow-sm transition-hover"
        >
          <div class="card-body p-3 d-flex align-items-center gap-3">
            <div class="position-relative">
                <img
                :src="fixImageUrl(item.book.coverUrl)"
                class="rounded shadow-sm object-fit-cover"
                style="width: 70px; height: 100px;"
                alt="Capa"
                />
                <span class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-primary shadow-sm border border-white" style="font-size: 0.8rem;">
                    #{{ item.position }}
                </span>
            </div>
            
            <div class="flex-grow-1">
              <h6 class="fw-bold mb-1 text-dark">{{ item.book.title }}</h6>
              <p class="text-muted small mb-2">{{ item.book.author }}</p>
              
              <div class="d-flex flex-wrap gap-2">
                <div class="d-flex align-items-center text-warning small bg-warning-subtle px-2 py-1 rounded">
                  <i class="bi bi-clock me-1"></i> 
                  <span class="fw-bold">Aguardando desde:</span> 
                  <span class="ms-1">{{ formatDate(item.createdAt) }}</span>
                </div>
                
                <div v-if="item.book.availableCopies > 0" class="d-flex align-items-center text-success small bg-success-subtle px-2 py-1 rounded animate-pulse">
                    <i class="bi bi-check-circle-fill me-1"></i>
                    <strong>Exemplar Disponível! Verifique na biblioteca.</strong>
                </div>
              </div>
            </div>
            
            <div class="border-start ps-3">
              <button
                class="btn btn-light text-danger btn-sm rounded-circle p-2 shadow-sm hover-danger"
                @click="$emit('leave', item.id)"
                title="Sair da fila"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";
import { useApi } from "~/composables/useApi";
import { useBookStore } from "~/composables/useBookStore";
import { useWaitingListStore } from "~/composables/useWaitingListStore";
import type { Book } from "~/types/api";

const props = defineProps({
  waitingList: {
    type: Array, // Could be typed stricter if WaitingList Item type exists
    default: () => [],
  },
  loading: Boolean,
});

const emit = defineEmits(["leave"]);

const { searchBooks } = useBookStore();
const { joinQueue, fetchMyQueue } = useWaitingListStore();
const { baseURL } = useApi();

const searchQuery = ref("");
const searchResults = ref<Book[]>([]);

const handleSearch = async () => {
    if (searchQuery.value.length >= 3) {
        searchResults.value = await searchBooks(searchQuery.value);
    } else {
        searchResults.value = [];
    }
};

const isAlreadyInQueue = (bookId: string) => {
    return props.waitingList.some((item: any) => item.bookId === bookId);
};

const confirmJoin = async (book: any) => {
    if (props.waitingList.length >= 3) {
        Swal.fire("Limite Atingido", "Você já está na fila de 3 livros.", "warning");
        return;
    }

    const { isConfirmed } = await Swal.fire({
        title: "Entrar na Fila?",
        text: `Deseja entrar na fila de espera para "${book.title}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim, entrar",
        confirmButtonColor: "#0d6efd"
    });

    if (isConfirmed) {
        const { error } = await joinQueue(book.id);
        if (!error.value) {
            Swal.fire("Sucesso", "Você entrou na fila!", "success");
            searchQuery.value = "";
            searchResults.value = [];
            await fetchMyQueue(); 
        } else {
            const err: any = error.value;
            Swal.fire("Erro", err?.data?.message || "Erro ao entrar na fila.", "error");
        }
    }
};

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR", { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.hover-bg-light:hover {
    background-color: #f8f9fa;
}
.object-fit-cover {
    object-fit: cover;
}
.dashed-border {
    border: 2px dashed #dee2e6 !important;
}
.hover-danger:hover {
    background-color: #dc3545 !important;
    color: white !important;
}
.transition-hover:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
}
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
}
</style>
