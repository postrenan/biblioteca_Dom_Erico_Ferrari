<template>
  <div>
    <div class="mb-3">
      <button class="btn btn-primary" @click="showBookSelectionModal = true">
        <i class="bi bi-plus-circle me-1"></i> Adicionar Livro à Lista
      </button>
    </div>
    <div class="row g-3">
      <div v-for="item in wishlist" :key="item.id" class="col-md-6">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex">
            <img
              v-if="item.book.coverUrl"
              :src="fixImageUrl(item.book.coverUrl)"
              class="me-3 rounded"
              style="width: 50px; height: 75px; object-fit: cover"
            />
            <div class="flex-grow-1">
              <h6 class="fw-bold mb-1">{{ item.book.title }}</h6>
              <p class="small text-muted mb-2">{{ item.book.author }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span
                  class="badge"
                  :class="
                    item.book.availableCopies > 0 ? 'bg-success' : 'bg-danger'
                  "
                >
                  {{
                    item.book.availableCopies > 0 ? "Disponível" : "Esgotado"
                  }}
                </span>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="$emit('remove', item.bookId)"
                >
                  <i class="bi bi-heartbreak"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="wishlist.length === 0"
        class="col-12 text-center text-muted bg-light p-5 rounded"
      >
        <i class="bi bi-heart display-1 opacity-10"></i>
        <p class="mt-3">Sua lista de desejos está vazia.</p>
      </div>
    </div>

    <!-- Book Selection Modal -->
    <div
      v-if="showBookSelectionModal"
      class="modal-overlay"
      @click.self="showBookSelectionModal = false"
    >
      <div class="modal-dialog modal-lg modal-content bg-white">
        <div class="modal-header p-3 border-bottom">
          <h5 class="modal-title">Selecionar Livro para Lista de Desejos</h5>
          <button
            type="button"
            class="btn-close"
            @click="showBookSelectionModal = false"
          ></button>
        </div>
        <div class="modal-body p-3 scrollable-body">
          <div class="row g-3">
            <div v-for="book in availableBooks" :key="book.id" class="col-md-6">
              <div class="card h-100">
                <div class="card-body d-flex">
                  <img
                    v-if="book.coverUrl"
                    :src="fixImageUrl(book.coverUrl)"
                    class="me-3 rounded"
                    style="width: 50px; height: 75px; object-fit: cover"
                  />
                  <div class="flex-grow-1">
                    <h6 class="fw-bold mb-1">{{ book.title }}</h6>
                    <p class="small text-muted mb-2">{{ book.author }}</p>
                    <button
                      class="btn btn-sm btn-primary"
                      @click="handleAddToWishlist(book.id)"
                      :disabled="wishlist.some((w) => w.bookId === book.id)"
                    >
                      <i class="bi bi-heart me-1"></i>
                      {{
                        wishlist.some((w) => w.bookId === book.id)
                          ? "Já na lista"
                          : "Adicionar"
                      }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="availableBooks.length === 0"
              class="col-12 text-center text-muted py-5"
            >
              <i class="bi bi-inbox display-4 opacity-10"></i>
              <p class="mt-2">Nenhum livro disponível no momento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useApi } from "~/composables/useApi";

const props = defineProps({
  wishlist: {
    type: Array,
    default: () => [],
  },
  availableBooks: {
      type: Array,
      default: () => []
  }
});

const emit = defineEmits(['add', 'remove']);

const showBookSelectionModal = ref(false);

const handleAddToWishlist = (bookId: string) => {
    emit('add', bookId);
    showBookSelectionModal.value = false;
};

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  const { baseURL } = useApi();
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}
.modal-content {
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}
.scrollable-body {
    overflow-y: auto;
}
</style>
