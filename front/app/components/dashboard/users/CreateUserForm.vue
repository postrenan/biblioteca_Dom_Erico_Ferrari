<template>
  <div class="card glass-card mb-4 border-0">
    <div class="card-body p-4">
      <h5
        class="card-title mb-4 fw-bold text-secondary text-uppercase fs-6 tracking-wide"
      >
        <i class="bi bi-person-plus-fill me-2 text-primary"></i>Novo Usuário
      </h5>

      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-md-3">
            <div class="form-floating">
              <input
                :value="modelValue.name"
                @input="updateField('name', $event.target.value)"
                type="text"
                class="form-control bg-transparent"
                id="forName"
                placeholder="Nome"
                required
              />
              <label for="forName">Nome Completo</label>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-floating">
              <input
                :value="modelValue.email"
                @input="updateField('email', $event.target.value)"
                type="email"
                class="form-control bg-transparent"
                id="forEmail"
                placeholder="Email"
              />
              <label for="forEmail">Email (opcional)</label>
            </div>
          </div>
          <div class="col-md-2">
            <div class="input-group" style="height: 58px">
              <div class="form-floating flex-grow-1">
                <input
                  :value="modelValue.password"
                  @input="updateField('password', $event.target.value)"
                  type="text"
                  class="form-control bg-transparent"
                  id="forPass"
                  placeholder="Senha"
                  required
                />
                <label for="forPass">Senha</label>
              </div>
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="generatePassword"
                title="Gerar Senha"
              >
                <i class="bi bi-shuffle"></i>
              </button>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-floating">
              <input
                :value="modelValue.matricula"
                 @input="updateField('matricula', $event.target.value)"
                type="text"
                class="form-control bg-transparent"
                id="forMatr"
                placeholder="Matrícula"
                required
                maxlength="9"
              />
              <label for="forMatr">Matrícula</label>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-floating">
              <select
                :value="modelValue.role"
                @change="updateField('role', $event.target.value)"
                class="form-select bg-transparent"
                id="forRole"
              >
                <option value="STUDENT">Aluno</option>
                <option value="TEACHER">Professor</option>
                <option value="LIBRARIAN">Bibliotecário</option>
                <option value="ADMIN">Admin</option>
              </select>
              <label for="forRole">Cargo</label>
            </div>
          </div>
        </div>

        <div class="row g-3 mt-1 align-items-center">
          <div
            class="col-md-3"
            v-if="['STUDENT', 'TEACHER'].includes(modelValue.role)"
          >
            <div class="form-floating">
              <select
                :value="modelValue.serieId"
                @change="updateField('serieId', $event.target.value)"
                class="form-select bg-transparent"
                id="forSerie"
                required
              >
                <option value="" disabled>Selecione...</option>
                <option v-for="s in series" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
              <label for="forSerie">Série/Turma</label>
            </div>
          </div>

          <div class="col-md-3 ms-auto d-grid">
            <button
              type="submit"
              class="btn btn-primary py-3 fw-bold"
              style="height: 58px"
              :disabled="loading"
            >
              <i class="bi bi-check-lg me-1"></i> Criar Usuário
            </button>
          </div>
        </div>

        <div
          v-if="series.length === 0"
          class="alert alert-warning mt-3 mb-0 shadow-sm border-0"
        >
          <i class="bi bi-exclamation-triangle me-2"></i>
          Nenhuma série cadastrada.
          <NuxtLink to="/dashboard/admin/series" class="fw-bold text-dark"
            >Cadastrar agora</NuxtLink
          >
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
    loading: Boolean
});

const emit = defineEmits(['update:modelValue', 'submit']);

const updateField = (field: string, value: any) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value
    });
};

const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateField('password', pass);
};

const handleSubmit = () => {
    emit('submit');
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
