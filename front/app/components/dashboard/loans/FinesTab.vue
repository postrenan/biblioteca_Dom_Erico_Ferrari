<template>
  <div class="row">
    <div v-for="fine in fines" :key="fine.id" class="col-md-6 mb-3">
      <div class="card border-warning h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5 class="card-title text-danger">
              Multa: R$ {{ fine.value.toFixed(2) }}
            </h5>
            <span
              :class="
                fine.status === 'PAID' ? 'badge bg-success' : 'badge bg-danger'
              "
              >{{ fine.status === "PAID" ? "PAGO" : "PENDENTE" }}</span
            >
          </div>
          <p class="card-text">{{ fine.reason }}</p>
          <small class="text-muted"
            >Data: {{ formatDate(fine.createdAt) }}</small
          >
        </div>
      </div>
    </div>
    <div v-if="fines.length === 0" class="col-12 text-center text-muted">
      Nenhuma multa encontrada.
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
    fines: Array
});

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
};
</script>
