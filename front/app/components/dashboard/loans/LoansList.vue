<template>
  <div v-if="loans.length === 0" class="alert alert-info">
    Nenhum empréstimo encontrado nesta categoria.
  </div>
  <div v-else class="row">
    <div v-for="loan in loans" :key="loan.id" class="col-md-6 mb-3">
      <div class="card h-100" :class="{ 'border-danger': isOverdue(loan) }">
        <div class="card-body">
          <h5 class="card-title">
            {{ loan.bookCopy?.book?.title || "Livro" }}
            <small class="text-muted">({{ loan.bookCopy?.copyCode }})</small>
          </h5>
          <h6 class="card-subtitle mb-2 text-muted">
            Retirado em: {{ formatDate(loan.loanDate) }}
          </h6>
          <p class="card-text">
            <span
              v-if="loan.status === 'RETURNED'"
              class="badge bg-success"
              >Devolvido em {{ formatDate(loan.returnDate) }}</span
            >
            <span v-else-if="isOverdue(loan)" class="badge bg-danger"
              >Atrasado! Vencia em {{ formatDate(loan.dueDate) }}</span
            >
            <span v-else class="badge bg-primary"
              >Vence em {{ formatDate(loan.dueDate) }}</span
            >
          </p>
          <div
            v-if="
              (loan.status === 'ACTIVE' || loan.status === 'OVERDUE') &&
              loan.renewCount < 1
            "
            class="mt-3"
          >
            <button
              class="btn btn-sm btn-outline-info w-100"
              @click="$emit('renew', loan.id)"
              :disabled="loading"
            >
              <i class="bi bi-clock-history me-1"></i> Renovar (1x)
            </button>
          </div>
          <div
            v-else-if="loan.renewCount >= 1 && loan.status !== 'RETURNED'"
            class="text-center mt-3"
          >
            <small class="text-muted fst-italic"
              ><i class="bi bi-check-circle-fill"></i> Limite de renovação
              atingido</small
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  loans: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
});

defineEmits(['renew']);

const isOverdue = (loan: any) => {
  if (loan.status === "RETURNED") return false;
  return new Date(loan.dueDate) < new Date();
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
};
</script>
