<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
      <AppHeader />

      <div class="row align-items-center mb-5">
        <div class="col">
          <h2 class="fw-bold text-white mb-1">Portal do Leitor</h2>
          <p class="text-white-50 mb-0">Gerencie seus empréstimos e leituras</p>
        </div>
        <div class="col-auto d-flex gap-2">
           <button class="btn btn-glass text-white" @click="showProfileApi">
               <i class="bi bi-person-circle me-1"></i> Perfil & Senha
           </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-pills custom-pills mb-4 justify-content-center justify-content-md-start gap-2" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'" type="button">
            <i class="bi bi-book me-1"></i> Em Andamento
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'" type="button">
            <i class="bi bi-clock-history me-1"></i> Histórico
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeTab === 'waiting' }" @click="activeTab = 'waiting'" type="button">
            <i class="bi bi-hourglass-split me-1"></i> Fila de Espera
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeTab === 'suggestions' }" @click="activeTab = 'suggestions'" type="button">
            <i class="bi bi-lightbulb me-1"></i> Sugestões
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeTab === 'wishlist' }" @click="activeTab = 'wishlist'" type="button">
            <i class="bi bi-heart me-1"></i> Lista de Desejos
          </button>
        </li>
      </ul>

      <!-- Tab Content Area -->
      <div class="tab-content">
        <!-- Active Loans -->
        <div v-if="activeTab === 'active'">
            <ActiveLoansTab 
                :loans="activeLoans" 
                :loading="loading" 
                @refresh="refreshData"
            />
        </div>

        <!-- History -->
        <div v-if="activeTab === 'history'">
            <HistoryTab 
                :history="historyLoans" 
                :user-goal="currentUser?.readingGoal || 0"
                @update-goal="handleUpdateGoal"
            />
        </div>

        <!-- Waiting List -->
        <div v-if="activeTab === 'waiting'">
            <WaitingListTab 
                :waiting-list="myQueue" 
                :loading="queueLoading"
                @leave="handleLeaveQueue" 
            />
        </div>

        <!-- Suggestions -->
        <div v-if="activeTab === 'suggestions'">
             <SuggestionsTab 
                :form="suggestionForm" 
                :my-suggestions="mySuggestions"
                @update:form="Object.assign(suggestionForm, $event)"
                @submit="handleSubmitSuggestion"
             />
        </div>
        
        <!-- Wishlist -->
        <div v-if="activeTab === 'wishlist'">
             <div class="card glass-card border-0 p-4">
                 <h5 class="fw-bold mb-4">Minha Lista de Desejos</h5>
                 <div v-if="loadingWishlist" class="text-center"><div class="spinner-border text-primary"></div></div>
                 <div v-else-if="wishlist.length === 0" class="text-center text-muted py-5">
                     <i class="bi bi-heart-break display-4 opacity-25"></i>
                     <p>Sua lista de desejos está vazia.</p>
                 </div>
                 <div v-else class="row g-3">
                     <div v-for="item in wishlist" :key="item.id" class="col-md-6">
                         <div class="card border-0 shadow-sm h-100 p-2 d-flex flex-row gap-3 bg-white">
                             <img :src="item.book.coverUrl || '/img-placeholder.jpg'" style="width: 60px; height: 90px; object-fit: cover;" class="rounded">
                             <div class="flex-grow-1">
                                 <h6 class="fw-bold mb-1">{{ item.book.title }}</h6>
                                 <small class="text-muted d-block">{{ item.book.author }}</small>
                                 <button class="btn btn-sm btn-outline-danger mt-2" @click="removeFromWishlist(item.bookId)">
                                     <i class="bi bi-trash"></i> Remover
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      </div>

      <!-- Profile Modal -->
      <div v-if="showProfileModal" class="modal-overlay" @click.self="closeProfile">
        <div class="modal-dialog modal-content bg-white p-4 rounded shadow-lg" style="max-width: 400px;">
           <div class="d-flex justify-content-between align-items-center mb-4">
             <h5 class="fw-bold mb-0">Alterar Senha</h5>
             <button class="btn btn-close" @click="closeProfile"></button>
           </div>
           
           <div class="mb-3">
             <label class="form-label">Nova Senha</label>
             <div class="input-group">
                 <input type="text" class="form-control" v-model="profileForm.password">
                 <button class="btn btn-outline-secondary" @click="generateProfilePassword"><i class="bi bi-shuffle"></i></button>
             </div>
           </div>
           <div class="mb-3">
             <label class="form-label">Confirmar Senha</label>
             <input type="password" class="form-control" v-model="profileForm.confirmPassword">
           </div>
           
           <button class="btn btn-primary w-100" @click="handleUpdatePassword">Salvar Alterações</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue';
import Swal from 'sweetalert2';
import ActiveLoansTab from '~/components/dashboard/loans/ActiveLoansTab.vue';
import HistoryTab from '~/components/dashboard/loans/HistoryTab.vue';
import WaitingListTab from '~/components/dashboard/loans/WaitingListTab.vue';
import SuggestionsTab from '~/components/dashboard/loans/SuggestionsTab.vue';
import AppHeader from '~/components/AppHeader.vue'; // Assuming AppHeader is a new component

// Stores
import { useLoanStore } from "~/composables/useLoanStore";
import { useSuggestionStore } from "~/composables/useSuggestionStore";
import { useWishlistStore } from "~/composables/useWishlistStore";
import { useUserStore } from "~/composables/useUserStore";
import { useWaitingListStore } from "~/composables/useWaitingListStore";
import { useAuth } from "~/composables/useAuth";

const { fetchMyLoans, loans, loading } = useLoanStore();
const { user: currentUser, fetchProfile } = useAuth();
const { fetchMyQueue, myQueue, loading: queueLoading, leaveQueue } = useWaitingListStore();
const { suggestions: mySuggestions, fetchMySuggestions, createSuggestion } = useSuggestionStore();
const { wishlist, fetchMyWishlist: fetchWishlist, removeFromWishlist, loading: loadingWishlist } = useWishlistStore(); // Renamed fetchMyWishlist to fetchWishlist for consistency
const { updateUser } = useUserStore();

// State
const activeTab = ref('active');

// Computed Splitting
const activeLoans = computed(() => {
    if (!loans.value) return [];
    return loans.value.filter(l => l.status === 'ACTIVE' || l.status === 'OVERDUE');
});

const historyLoans = computed(() => {
    if (!loans.value) return [];
    return loans.value.filter(l => l.status === 'RETURNED');
});

// Forms
const suggestionForm = reactive({ title: '', author: '', reason: '' });
const showProfileModal = ref(false);
const profileForm = ref({ password: '', confirmPassword: '' });

// Methods
const refreshData = async () => {
    await fetchMyLoans();
    await fetchMyQueue();
    await fetchMySuggestions();
    await fetchWishlist();
    await fetchProfile(); // Get updated readingGoal
};

const handleUpdateGoal = async (goal) => {
    // Update locally then API
    // Need update method in useUserStore or direct API
    // We assume updateUser works
    if (!currentUser.value) return;
    const updated = await updateUser(currentUser.value.id, { readingGoal: goal });
    if (updated) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Meta atualizada!', showConfirmButton: false, timer: 1500 });
        await fetchProfile(); // Refresh context
    }
};

const handleSubmitSuggestion = async () => {
    if (!suggestionForm.title) {
        Swal.fire('Atenção', 'Informe o título do livro.', 'warning');
        return;
    }
    const { error } = await createSuggestion({ ...suggestionForm });
    if (!error) {
        Swal.fire('Sucesso', 'Sugestão enviada!', 'success');
        Object.assign(suggestionForm, { title: '', author: '', reason: '' }); // Clear
        activeTab.value = 'suggestions'; // Stay on tab
    } else {
         Swal.fire('Erro', 'Erro ao enviar sugestão.', 'error');
    }
};

const handleLeaveQueue = async (id) => {
    const result = await Swal.fire({ title: 'Sair da fila?', text: 'Você perderá sua posição.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sim, sair' });
    if(result.isConfirmed) {
        await leaveQueue(id);
        fetchMyQueue();
    }
};

// Profile Logic
const showProfileApi = () => { profileForm.value = { password: '', confirmPassword: '' }; showProfileModal.value = true; };
const closeProfile = () => { showProfileModal.value = false; };
const generateProfilePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    profileForm.value.password = pass;
};
const handleUpdatePassword = async () => {
    if (profileForm.value.password !== profileForm.value.confirmPassword) { Swal.fire('Erro', 'Senhas não conferem', 'error'); return; }
    if (!currentUser.value) return;
    const success = await updateUser(currentUser.value.id, { password: profileForm.value.password });
    if(success) { Swal.fire('Sucesso', 'Senha alterada!', 'success'); closeProfile(); }
};

onMounted(() => {
    refreshData();
});
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

.btn-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
.btn-glass:hover { background: rgba(255, 255, 255, 0.2); }

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-pills .nav-link {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
}
.custom-pills .nav-link.active {
    background-color: white;
    color: #0f172a;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center; z-index: 2000;
}
</style>
