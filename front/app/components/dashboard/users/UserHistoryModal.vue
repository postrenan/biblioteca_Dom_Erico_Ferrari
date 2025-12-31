<template>
    <div
      class="modal-overlay"
      @click.self="$emit('close')"
    >
      <div
        class="modal-dialog modal-lg modal-content bg-white p-4 rounded shadow-lg"
      >
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0 text-primary">
            Histórico: {{ userName }}
          </h4>
          <button class="btn btn-close" @click="$emit('close')"></button>
        </div>

        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div
          v-else-if="!history || history.length === 0"
          class="text-center py-4 text-muted"
        >
          <i class="bi bi-calendar-x fs-1 d-block mb-2 opacity-50"></i>
          Nenhum registro de empréstimo encontrado.
        </div>

        <div
          v-else
          class="table-responsive"
          style="max-height: 400px; overflow-y: auto"
        >
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th class="ps-3">Livro</th>
                <th>Empréstimo</th>
                <th>Devolução</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in history" :key="h.id">
                <td class="ps-3">
                  <div class="fw-bold">
                    {{ h.bookCopy?.book?.title || "Livro Desconhecido" }}
                  </div>
                  <small class="text-muted font-monospace">{{
                    h.bookCopy?.copyCode
                  }}</small>
                </td>
                <td>{{ new Date(h.loanDate).toLocaleDateString("pt-BR") }}</td>
                <td>
                  <span v-if="h.returnDate">{{
                    new Date(h.returnDate).toLocaleDateString("pt-BR")
                  }}</span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <span
                    v-if="h.status === 'RETURNED'"
                    class="badge bg-secondary"
                    >Devolvido</span
                  >
                  <span
                    v-else-if="h.status === 'OVERDUE'"
                    class="badge bg-danger"
                    >Atrasado</span
                  >
                  <span v-else class="badge bg-success">Ativo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    userName: String,
    history: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});

defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}
.modal-content {
  max-width: 800px;
  width: 90%;
  border: none;
}
</style>
