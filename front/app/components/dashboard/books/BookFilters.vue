<template>
  <div class="card glass-card mb-4 border-0">
    <div class="card-body p-3 p-md-4">
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <div class="input-group input-group-lg shadow-sm">
            <span class="input-group-text bg-white border-0 text-primary">
              <i class="bi bi-search"></i>
            </span>
            <input
              :value="searchQuery"
              @input="$emit('update:searchQuery', $event.target.value)"
              type="text"
              class="form-control border-0"
              placeholder="Pesquisar por título, autor ou ISBN..."
            />
          </div>
        </div>
        <div class="col-6 col-md-3">
          <select
            :value="selectedCategoryId"
            @change="$emit('update:selectedCategoryId', $event.target.value)"
            class="form-select form-select-lg border-0 shadow-sm"
          >
            <option value="">Categorias</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <select
            :value="availabilityFilter"
            @change="$emit('update:availabilityFilter', $event.target.value)"
            class="form-select form-select-lg border-0 shadow-sm"
          >
            <option value="all">Status</option>
            <option value="available">Disponíveis</option>
            <option value="unavailable">Esgotados</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  searchQuery: String,
  selectedCategoryId: String,
  availabilityFilter: String,
  categories: {
    type: Array,
    default: () => []
  }
});

defineEmits(['update:searchQuery', 'update:selectedCategoryId', 'update:availabilityFilter']);
</script>
