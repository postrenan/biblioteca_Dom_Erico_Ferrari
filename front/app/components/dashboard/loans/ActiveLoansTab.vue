<template>
  <div class="card glass-card border-0 mb-4">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="card-title fw-bold text-secondary text-uppercase fs-6 tracking-wide mb-0">
          <i class="bi bi-book-half me-2 text-primary"></i>Leituras em Andamento
        </h5>
        <button class="btn btn-sm btn-outline-primary" @click="$emit('refresh')">
            <i class="bi bi-arrow-clockwise"></i> Atualizar
        </button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="loans.length === 0" class="text-center py-5 text-muted border rounded bg-light bg-opacity-50 dashed-border">
          <i class="bi bi-journal-bookmark display-4 opacity-25 d-block mb-3"></i>
          <p class="mb-0">Você não tem nenhum empréstimo ativo no momento.</p>
          <small>Que tal pegar um livro na biblioteca?</small>
      </div>

      <div v-else class="row g-4">
        <div v-for="loan in loans" :key="loan.id" class="col-md-6 col-lg-12 col-xl-6">
          <div class="card border-0 shadow-sm h-100 transition-hover">
            <div class="card-body d-flex gap-3">
              <img
                :src="fixImageUrl(loan.bookCopy.book.coverUrl)"
                class="rounded shadow-sm object-fit-cover"
                style="width: 100px; height: 150px"
              />
              <div class="flex-grow-1 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold mb-1">{{ loan.bookCopy.book.title }}</h6>
                        <small class="text-muted d-block">{{ loan.bookCopy.book.author }}</small>
                    </div>
                    <span class="badge" :class="getDaysLeft(loan.dueDate) < 0 ? 'bg-danger' : 'bg-success'">
                        Devolução: {{ formatDate(loan.dueDate) }}
                    </span>
                </div>

                <div class="mt-3">
                    <label class="small text-muted fw-bold d-flex justify-content-between">
                        <span>Progresso de Leitura</span>
                        <span>{{ loan.pagesRead || 0 }} / {{ loan.bookCopy.book.pages || '?' }} pág.</span>
                    </label>
                    <div class="progress" style="height: 8px;">
                        <div 
                            class="progress-bar bg-info" 
                            role="progressbar" 
                            :style="{ width: calculateProgress(loan) + '%' }"
                        ></div>
                    </div>
                </div>

                <div class="mt-auto pt-3 d-flex gap-2">
                    <button class="btn btn-sm btn-primary flex-grow-1" @click="openProgressModal(loan)">
                        <i class="bi bi-bookmark-plus me-1"></i> Registrar Leitura
                    </button>
                     <button class="btn btn-sm btn-outline-secondary" disabled title="Renovação presencial (Futuro)">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Registrar Leitura -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-dialog modal-content bg-white p-4 rounded shadow-lg" style="max-width: 500px">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold"><i class="bi bi-journal-text me-2"></i>Atualizar Leitura</h5>
                <button class="btn btn-close" @click="showModal = false"></button>
            </div>
            
            <div v-if="selectedLoan">
                <h6 class="text-primary fw-bold mb-3">{{ selectedLoan.bookCopy.book.title }}</h6>
                
                <div class="mb-3">
                    <label class="form-label fw-bold small">Páginas Lidas (Total)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" v-model="form.pagesRead" :max="selectedLoan.bookCopy.book.pages">
                        <span class="input-group-text">de {{ selectedLoan.bookCopy.book.pages }}</span>
                    </div>
                </div>

                <div class="mb-3">
                     <label class="form-label fw-bold small">Sua Avaliação (Opcional)</label>
                     <div class="d-flex gap-2 fs-3 text-warning cursor-pointer">
                         <i 
                            v-for="star in 5" 
                            :key="star" 
                            :class="star <= (form.rating || 0) ? 'bi bi-star-fill' : 'bi bi-star'"
                            @click="form.rating = star"
                        ></i>
                     </div>
                </div>

                 <div class="mb-3">
                    <label class="form-label fw-bold small">Resumo / Anotações</label>
                    <textarea class="form-control" rows="3" v-model="form.review" placeholder="Escreva o que você achou até agora..."></textarea>
                </div>
                
                <div class="text-end">
                    <button class="btn btn-primary w-100" @click="saveProgress">
                        <i class="bi bi-save me-1"></i> Salvar Progresso
                    </button>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2'; 
import { useApi } from '~/composables/useApi';
import type { Loan } from '~/types/api';

const props = defineProps({
    loans: { type: Array, default: () => [] },
    loading: Boolean
});

const emit = defineEmits(['refresh', 'update-loan']);
const { apiFetch, baseURL } = useApi();

const showModal = ref(false);
const selectedLoan = ref<any>(null); // Use any or strict Loan type if available but structure is complex (nested)
const form = ref({
    pagesRead: 0,
    rating: 0,
    review: ''
});

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
};

const calculateProgress = (loan: any) => {
    if (!loan.bookCopy.book.pages) return 0;
    return Math.min(100, Math.round(((loan.pagesRead || 0) / loan.bookCopy.book.pages) * 100));
};

const openProgressModal = (loan: any) => {
    selectedLoan.value = loan;
    form.value = {
        pagesRead: loan.pagesRead || 0,
        rating: loan.rating || 0,
        review: loan.review || ''
    };
    showModal.value = true;
};

const saveProgress = async () => {
    if(!selectedLoan.value) return;
    
    // Call API (assume endpoint exists now)
    try {
        await apiFetch(`/loans/${selectedLoan.value.id}/progress`, {
            method: 'PATCH',
            body: form.value
        });
        
        Swal.fire({
             icon: 'success',
             title: 'Progresso salvo!',
             toast: true,
             position: 'top-end',
             timer: 2000,
             showConfirmButton: false
        });
        
        showModal.value = false;
        emit('refresh');
    } catch(e) {
        Swal.fire('Erro', 'Não foi possível salvar o progresso.', 'error');
    }
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.object-fit-cover { object-fit: cover; }
.cursor-pointer { cursor: pointer; }
.transition-hover:hover { transform: translateY(-3px); transition: all 0.2s; }
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 2000;
}
.dashed-border { border: 2px dashed #dee2e6 !important; }
</style>
