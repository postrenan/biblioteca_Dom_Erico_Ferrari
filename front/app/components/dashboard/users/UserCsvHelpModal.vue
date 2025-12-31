<template>
  <div
    class="modal-overlay csv-help-z"
    @click.self="$emit('close')"
  >
    <div
      class="modal-dialog modal-content bg-white p-4 rounded shadow-lg"
      style="max-width: 600px"
    >
      <div
        class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
      >
        <h5 class="mb-0 fw-bold text-primary">Dicas de Importação CSV</h5>
        <button class="btn btn-close" @click="$emit('close')"></button>
      </div>
      <p class="small text-muted">
        Para importar usuários, envie um arquivo .csv com estas colunas:
      </p>
      <div class="table-responsive">
        <table class="table table-sm table-bordered mb-0 small text-center">
          <thead class="table-light">
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Cargo</th>
              <th>Matrícula</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Exemplo Nome</td>
              <td>ex@email.com</td>
              <td>STUDENT</td>
              <td>123456</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="alert alert-info py-2 px-3 mt-3 mb-0 small border-0 shadow-sm"
      >
        <i class="bi bi-info-circle me-1"></i> Utilize cargos válidos:
        STUDENT, TEACHER, LIBRARIAN, ADMIN.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close']);
</script>

<style scoped>
.csv-help-z {
  z-index: 4000 !important;
}
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
