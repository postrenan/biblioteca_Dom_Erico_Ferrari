<template>
  <div>
    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm glass-card text-center py-3">
                <h6 class="text-muted text-uppercase small fw-bold">Livros Lidos (Total)</h6>
                <h3 class="fw-bold text-primary mb-0">{{ totalBooksRead }}</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm glass-card text-center py-3">
                <h6 class="text-muted text-uppercase small fw-bold">Páginas Lidas</h6>
                <h3 class="fw-bold text-success mb-0">{{ totalPagesRead }}</h3>
            </div>
        </div>
        <div class="col-md-4">
             <div class="card border-0 shadow-sm glass-card text-center py-3 position-relative">
                 <button class="btn btn-sm btn-link position-absolute top-0 end-0 text-muted" @click="showGoalModal = true"><i class="bi bi-pencil"></i></button>
                <h6 class="text-muted text-uppercase small fw-bold">Meta Anual ({{ currentYear }})</h6>
                <div class="d-flex align-items-center justify-content-center gap-2">
                    <h3 class="fw-bold text-warning mb-0">{{ booksReadThisYear }}</h3>
                    <span class="text-muted fs-5">/ {{ readingGoal }}</span>
                </div>
                <div class="progress mt-2 mx-4" style="height: 4px;">
                    <div class="progress-bar bg-warning" :style="{ width: goalProgress + '%' }"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- History List -->
    <div class="card glass-card border-0">
        <div class="card-body p-4">
             <h5 class="card-title fw-bold text-secondary text-uppercase fs-6 tracking-wide mb-4">
                <i class="bi bi-clock-history me-2 text-primary"></i>Histórico de Leitura
            </h5>

            <div v-if="Object.keys(groupedHistory).length === 0" class="text-center py-5 text-muted">
                <p>Nenhum livro finalizado ainda.</p>
            </div>

            <div v-for="(group, year) in groupedHistory" :key="year" class="mb-5">
                <h6 class="border-bottom pb-2 mb-3 fw-bold text-muted">{{ year }}</h6>
                
                <div class="list-group list-group-flush">
                    <div v-for="loan in group" :key="loan.id" class="list-group-item bg-transparent border-0 px-0 mb-3">
                        <div class="d-flex gap-3 align-items-center">
                            <img :src="fixImageUrl(loan.bookCopy.book.coverUrl)" class="rounded shadow-sm" style="width: 50px; height: 75px; object-fit: cover;">
                            <div class="flex-grow-1">
                                <h6 class="fw-bold mb-0 text-dark">{{ loan.bookCopy.book.title }}</h6>
                                <small class="text-muted">{{ loan.bookCopy.book.author }}</small>
                                <div class="d-flex align-items-center gap-3 mt-1 small">
                                    <span class="text-success"><i class="bi bi-check-all"></i> Concluído em {{ formatDate(loan.returnDate) }}</span>
                                    <div v-if="loan.rating" class="text-warning">
                                         <i v-for="n in 5" :key="n" :class="n <= loan.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                                    </div>
                                    <span class="text-muted">{{ loan.pagesRead }} págs.</span>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-outline-secondary" @click="printReview(loan)" v-if="loan.review">
                                <i class="bi bi-printer"></i> Resumo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Goal Modal -->
    <div v-if="showGoalModal" class="modal-overlay" @click.self="showGoalModal = false">
        <div class="modal-dialog modal-content bg-white p-4 rounded shadow-lg" style="max-width: 400px">
             <h5 class="fw-bold mb-3">Definir Meta de Leitura</h5>
             <p class="text-muted small">Quantos livros você quer ler em {{ currentYear }}?</p>
             <input type="number" class="form-control mb-3 fs-3 text-center fw-bold text-primary" v-model="readingGoalInput">
             <button class="btn btn-primary w-100" @click="saveGoal">Salvar Meta</button>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApi } from '~/composables/useApi';

const props = defineProps({
    history: { type: Array, default: () => [] },
    userGoal: { type: Number, default: 0 }
});

const emit = defineEmits(['update-goal']);
const { baseURL, apiFetch } = useApi();

const currentYear = new Date().getFullYear();
const showGoalModal = ref(false);
const readingGoalInput = ref(props.userGoal || 12);

const readingGoal = computed(() => props.userGoal || 12); // Default 12

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

// Stats
const totalBooksRead = computed(() => props.history.length);
const totalPagesRead = computed(() => props.history.reduce((acc: number, curr: any) => acc + (curr.pagesRead || 0), 0));
const booksReadThisYear = computed(() => {
    return props.history.filter((l: any) => new Date(l.returnDate).getFullYear() === currentYear).length;
});
const goalProgress = computed(() => Math.min(100, (booksReadThisYear.value / readingGoal.value) * 100));

// Grouped by Year
const groupedHistory = computed(() => {
    const groups: Record<number, any[]> = {};
    props.history.forEach((loan: any) => {
        const year = new Date(loan.returnDate).getFullYear();
        if (!groups[year]) groups[year] = [];
        groups[year].push(loan);
    });
    // Sort years desc
    return Object.keys(groups).sort((a: any, b: any) => b - a).reduce((obj: any, key: string) => {
        obj[key] = groups[parseInt(key)];
        return obj;
    }, {});
});

const saveGoal = async () => {
    // Call API (UsersService -> updateGoal)
    // We assume backend has this endpoint, else we mock/add it
    emit('update-goal', typeof readingGoalInput.value === 'string' ? parseInt(readingGoalInput.value) : readingGoalInput.value);
    showGoalModal.value = false;
};

const printReview = (loan: any) => {
    const win = window.open('', '', 'width=800,height=600');
    if (win) {
        win.document.write(`
            <html>
                <head>
                    <title>Resumo de Leitura - ${loan.bookCopy.book.title}</title>
                    <style>body { font-family: sans-serif; padding: 40px; }</style>
                </head>
                <body>
                    <h1>${loan.bookCopy.book.title}</h1>
                    <h3>${loan.bookCopy.book.author}</h3>
                    <hr>
                    <p><strong>Minha Avaliação:</strong> ${loan.rating}/5 estrelas</p>
                    <p><strong>Data de Conclusão:</strong> ${formatDate(loan.returnDate)}</p>
                    <br>
                    <h4>Meu Resumo:</h4>
                    <p style="white-space: pre-wrap;">${loan.review}</p>
                    <script>window.print()<\/script>
                </body>
            </html>
        `);
    }
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 2000;
}
</style>
