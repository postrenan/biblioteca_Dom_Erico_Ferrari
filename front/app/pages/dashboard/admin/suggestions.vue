<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
      <AppHeader title="Moderação de Sugestões" />

      <div class="card glass-card border-0">
        <div class="card-body p-0">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0 fw-bold text-secondary text-uppercase fs-6 tracking-wide">
              <i class="bi bi-lightbulb me-2 text-primary"></i>Sugestões de Livros
            </h5>
            <button class="btn btn-sm btn-outline-primary" @click="fetchAllSuggestions">
              <i class="bi bi-arrow-clockwise me-1"></i> Atualizar
            </button>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="suggestions.length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted opacity-25"></i>
            <p class="mt-3 text-muted">Nenhuma sugestão encontrada.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">Título</th>
                  <th>Autor</th>
                  <th>Solicitado por</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="suggestion in suggestions" :key="suggestion.id" :class="{'bg-light opacity-50': suggestion.status !== 'PENDING'}">
                  <td class="ps-4 fw-bold">{{ suggestion.title }}</td>
                  <td>{{ suggestion.author || '-' }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-primary-subtle text-primary fw-bold small">
                            {{ suggestion.user?.name?.charAt(0) }}
                        </div>
                        <div>
                            <div class="small fw-bold">{{ suggestion.user?.name }}</div>
                            <div class="small text-muted" style="font-size: 0.75rem">{{ suggestion.user?.matricula }}</div>
                        </div>
                    </div>
                  </td>
                  <td>{{ new Date(suggestion.createdAt).toLocaleDateString('pt-BR') }}</td>
                  <td>
                    <span class="badge" :class="getStatusClass(suggestion.status)">
                      {{ getStatusLabel(suggestion.status) }}
                    </span>
                  </td>
                  <td class="text-end pe-4">
                    <div class="btn-group shadow-sm" v-if="suggestion.status === 'PENDING'">
                      <button class="btn btn-sm btn-success text-white" title="Aprovar" @click="handleStatus(suggestion.id, 'APPROVED')">
                        <i class="bi bi-check-lg"></i>
                      </button>
                      <button class="btn btn-sm btn-danger text-white" title="Rejeitar" @click="handleStatus(suggestion.id, 'REJECTED')">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                    <span v-else class="text-muted small fst-italic">
                        {{ suggestion.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado' }}
                    </span>
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
import { onMounted } from 'vue';
import Swal from 'sweetalert2';

const { suggestions, fetchAllSuggestions, updateSuggestionStatus, loading } = useSuggestionStore();

onMounted(() => {
    fetchAllSuggestions();
});

const getStatusClass = (status) => {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark';
        case 'APPROVED': return 'bg-success';
        case 'REJECTED': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'PENDING': return 'Pendente';
        case 'APPROVED': return 'Aprovada';
        case 'REJECTED': return 'Rejeitada';
        default: return status;
    }
};

const handleStatus = async (id, status) => {
    const { error } = await updateSuggestionStatus(id, status);
    if (!error) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        toast.fire({
            icon: 'success',
            title: status === 'APPROVED' ? 'Sugestão aprovada!' : 'Sugestão rejeitada.'
        });
    } else {
        Swal.fire('Erro', 'Não foi possível atualizar o status.', 'error');
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

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
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
</style>
