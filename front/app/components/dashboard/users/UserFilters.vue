<template>
  <div class="px-4 py-3 bg-light border-bottom">
    <div class="row g-2">
      <div class="col-md-5">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input
            :value="searchText"
            @input="$emit('update:searchText', $event.target.value)"
            type="text"
            class="form-control border-start-0 ps-0"
            placeholder="Buscar por nome, email ou matrícula..."
          />
        </div>
      </div>
      <div class="col-md-3">
        <select
          :value="selectedRole"
          @change="$emit('update:selectedRole', $event.target.value)"
          class="form-select"
        >
          <option value="">Todos os Cargos</option>
          <option value="STUDENT">Aluno</option>
          <option value="TEACHER">Professor</option>
          <option value="LIBRARIAN">Bibliotecário</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div class="col-md-3">
        <select
          :value="selectedStatus"
          @change="$emit('update:selectedStatus', $event.target.value)"
          class="form-select"
        >
          <option value="">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="suspended">Suspensos</option>
        </select>
      </div>
      <div class="col-md-1 d-flex align-items-center justify-content-end">
        <div class="badge bg-primary rounded-pill">
          {{ totalMatches }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  searchText: String,
  selectedRole: String,
  selectedStatus: String,
  totalMatches: Number
});

defineEmits(['update:searchText', 'update:selectedRole', 'update:selectedStatus']);
</script>
