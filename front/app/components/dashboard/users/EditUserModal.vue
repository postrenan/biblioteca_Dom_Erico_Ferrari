<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div
      class="modal-dialog modal-lg modal-content bg-white p-4 rounded shadow-lg"
    >
      <div
        class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2"
      >
        <h4 class="mb-0 fw-bold text-primary">Editar Usuário</h4>
        <button class="btn btn-close" @click="$emit('close')"></button>
      </div>

      <form @submit.prevent="$emit('submit')">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input
                :value="modelValue.name"
                 @input="updateField('name', $event.target.value)"
                type="text"
                class="form-control"
                id="editName"
                placeholder="Nome"
                required
              />
              <label for="editName">Nome Completo</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                :value="modelValue.email"
                 @input="updateField('email', $event.target.value)"
                type="email"
                class="form-control"
                id="editEmail"
                placeholder="Email"
              />
              <label for="editEmail">Email</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                :value="modelValue.contact1"
                 @input="updateField('contact1', $event.target.value)"
                type="text"
                class="form-control"
                id="editC1"
                placeholder="Contato 1"
              />
              <label for="editC1">Contato 1 (Celular)</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                 :value="modelValue.contact2"
                 @input="updateField('contact2', $event.target.value)"
                type="text"
                class="form-control"
                id="editC2"
                placeholder="Contato 2"
              />
              <label for="editC2">Contato 2 (Outro)</label>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating">
              <textarea
                 :value="modelValue.observation"
                 @input="updateField('observation', $event.target.value)"
                class="form-control"
                id="editObs"
                placeholder="Observações"
                style="height: 100px"
              ></textarea>
              <label for="editObs">Observações</label>
            </div>
          </div>

          <div
            class="col-md-6"
            v-if="['STUDENT', 'TEACHER'].includes(currentUserRole)"
          >
            <div class="form-floating">
              <select
                :value="modelValue.serieId"
                @change="updateField('serieId', $event.target.value)"
                class="form-select"
                id="editSerie"
              >
                <option value="">Selecione...</option>
                <option v-for="s in series" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
              <label for="editSerie">Série/Turma</label>
            </div>
          </div>
        </div>

        <div class="mt-4 text-end">
          <button
            type="button"
            class="btn btn-light me-2"
            @click="$emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary fw-bold px-4"
            :disabled="loading"
          >
            <i class="bi bi-save me-1"></i> Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    series: {
        type: Array,
        default: () => []
    },
    loading: Boolean,
    currentUserRole: String // Role of the user being edited (to check if serie needed)
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const updateField = (field: string, value: any) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value
    });
};
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
