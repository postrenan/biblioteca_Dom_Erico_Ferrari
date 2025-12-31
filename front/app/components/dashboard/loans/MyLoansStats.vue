<template>
  <div class="row mb-4">
    <div class="col-md-4">
      <div class="card bg-primary text-white shadow-sm border-0">
        <div
          class="card-body py-3 d-flex align-items-center justify-content-between"
        >
          <div>
            <h6 class="mb-0 small text-white-50">Livros Lidos (Ano)</h6>
            <h3 class="mb-0 fw-bold">{{ booksReadCount }}</h3>
          </div>
          <i class="bi bi-book fs-1 opacity-25"></i>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card bg-info text-white shadow-sm border-0">
        <div
          class="card-body py-3 d-flex align-items-center justify-content-between"
        >
          <div>
            <h6 class="mb-0 small text-white-50">Páginas Lidas (Ano)</h6>
            <h3 class="mb-0 fw-bold">{{ pagesReadCount }}</h3>
          </div>
          <i class="bi bi-file-earmark-text fs-1 opacity-25"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
    booksReadCount: Number,
    pagesReadCount: Number
});
</script>
