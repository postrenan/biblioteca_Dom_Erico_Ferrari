<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
    <AppHeader />
    <AppSubHeader title="Gerenciar Séries/Turmas" />

    <div class="card glass-card mb-4 border-0">
      <div class="card-body p-4">
        <h5
          class="card-title fw-bold text-secondary text-uppercase fs-6 tracking-wide mb-3"
        >
          <i class="bi bi-plus-circle-fill me-2 text-primary"></i>Nova Série
        </h5>
        <form @submit.prevent="handleAdd">
          <div class="input-group input-group-lg shadow-sm">
            <input
              v-model="newSeriesName"
              type="text"
              class="form-control border-0"
              placeholder="Nome da Série (ex: 3º Ano A)"
              required
            />
            <button
              class="btn btn-primary px-4 fw-bold"
              type="submit"
              :disabled="loading"
            >
              <i class="bi bi-plus-lg me-2"></i> Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <div v-else class="list-group shadow-sm rounded-3 overflow-hidden">
      <div
        v-for="s in series"
        :key="s.id"
        class="list-group-item d-flex justify-content-between align-items-center p-3 border-start-0 border-end-0"
        style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(5px)"
      >
        <div class="d-flex align-items-center">
          <div class="rounded-circle bg-primary-subtle p-2 me-3 text-primary">
            <i class="bi bi-people-fill"></i>
          </div>
          <span class="fs-5 fw-medium text-dark">{{ s.name }}</span>
        </div>
        <button
          class="btn btn-light text-danger shadow-sm"
          @click="handleDelete(s.id)"
          title="Excluir"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div
        v-if="series.length === 0"
        class="text-center text-muted py-5 bg-white bg-opacity-50"
      >
        <i class="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
        Nenhuma série cadastrada.
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchSeries, createSeries, deleteSeries, series, loading } =
  useSeriesStore();
const newSeriesName = ref("");

onMounted(() => {
  fetchSeries();
});

const handleAdd = async () => {
  if (!newSeriesName.value) return;
  await createSeries(newSeriesName.value);
  newSeriesName.value = "";
};

const handleDelete = async (id: string) => {
  if (confirm("Tem certeza que deseja excluir esta série?")) {
    await deleteSeries(id);
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
</style>
