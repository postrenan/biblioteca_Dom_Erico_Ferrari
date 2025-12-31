<template>
  <div class="book-card-container">
    <div class="book-card shadow-sm">
      <div class="d-flex h-100">
        <!-- LEFT SIDE: Cover & Basic Info -->
        <div class="book-left">
          <div class="card-img-wrapper">
            <img
              :src="fixImageUrl(book.coverUrl)"
              class="card-img-top"
              :alt="book.title"
            />
            <div class="book-spine-shadow"></div>
          </div>
          <div class="p-3 text-center bg-white">
            <h5
              class="card-title fw-bold text-dark mb-1 text-truncate"
              :title="book.title"
            >
              {{ book.title }}
            </h5>
            <p class="text-muted small mb-0 font-monospace">
              {{ book.author }}
            </p>
          </div>
        </div>

        <!-- RIGHT SIDE: Details (Visible on Hover) -->
        <div class="book-right">
          <div class="p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h6 class="fw-bold text-primary mb-3">Resumo</h6>
              <p class="small text-muted description-text">
                {{ book.description || "Sem descrição disponível." }}
              </p>
            </div>

            <div class="mt-3 border-top pt-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-light text-dark border">
                  <i class="bi bi-upc-scan me-1"></i> ISBN: {{ book.isbn }}
                </span>
                <span class="badge bg-warning text-dark">
                  {{ new Date(book.publicationDate).getFullYear() }}
                </span>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <span class="small fw-bold text-secondary">
                  <i class="bi bi-file-earmark-text me-1"></i> Páginas:
                </span>
                <span class="badge bg-info-subtle text-info border border-info">
                  {{ book.pages || '---' }}
                </span>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge" :class="book.availableCopies > 0 ? 'bg-success' : 'bg-danger'">
                  {{ book.availableCopies }} de {{ book.totalCopies }}
                </span>
                
                <!-- Wishlist Button -->
                <button
                  v-if="user && book.availableCopies > 0"
                  class="btn btn-sm"
                  :class="isInWishlist ? 'btn-danger' : 'btn-outline-danger'"
                  @click.stop="$emit('toggle-wishlist', book)"
                  title="Adicionar à Lista de Desejos"
                >
                  <i class="bi" :class="isInWishlist ? 'bi-heart-fill' : 'bi-heart'"></i>
                </button>

                <!-- Queue Button -->
                <button
                  v-else-if="user && book.availableCopies === 0"
                  class="btn btn-sm btn-outline-warning"
                  @click.stop="handleJoinQueue"
                  :disabled="loadingQueue"
                  title="Entrar na Fila de Espera"
                >
                   <span v-if="loadingQueue" class="spinner-border spinner-border-sm"></span>
                   <span v-else><i class="bi bi-hourglass-split"></i> Entrar na Fila</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "~/composables/useApi";
import Swal from 'sweetalert2';

const props = defineProps({
    book: {
        type: Object,
        required: true
    },
    user: Object,
    isInWishlist: Boolean
});

defineEmits(['toggle-wishlist']);

const { joinQueue } = useWaitingListStore();
const loadingQueue = ref(false);

const handleJoinQueue = async () => {
    loadingQueue.value = true;
    const { error } = await joinQueue(props.book.id);
    loadingQueue.value = false;
    
    if (!error) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Você entrou na fila de espera!',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Você já está na fila ou ocorreu um erro.',
            showConfirmButton: false,
            timer: 3000
        });
    }
};

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  const { baseURL } = useApi();
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};
</script>

<style scoped>
<style scoped>
/* Card Components CSS - Copied from index.vue */
.book-card-container {
  perspective: 1000px;
  width: 280px; /* Fixed width */
}

.book-card {
  width: 100%;
  height: 480px; /* Adjust height */
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.4s ease, width 0.4s ease; /* Animate width */
  background: #fff;
  position: relative;
  z-index: 10;
}

/* Initially, only left side visible, right side hidden or pushed out */
.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3) !important;
  width: 580px; /* EXPAND WIDTH ON HOVER */
  z-index: 1000; /* Pop on top significantly */
}

/* Add a pseudo-element for the gray background backdrop on hover */
.book-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.1); /* Grayish subtle background */
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: -1;
}

.book-card:hover::before {
  opacity: 1;
}

/* Layout */
.book-left {
  width: 280px; /* Fixed width matching card initial width */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
}

.book-right {
  width: 300px; /* The extra space */
  flex-shrink: 0;
  background: #f8f9fa; /* Slight contrast */
  opacity: 0;
  transition: opacity 0.3s ease 0.1s; /* Slight delay */
  overflow: hidden;
}

.book-card:hover .book-right {
  opacity: 1;
}

.card-img-wrapper {
  height: 380px; /* Dominates the card */
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-spine-shadow {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 15px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 8; /* Limit text lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive: Disable hover expand on mobile */
@media (max-width: 991px) {
  .book-card:hover {
    width: 280px; /* No expand */
    transform: translateY(-5px);
    z-index: 10;
  }
  .book-right {
    display: none;
  }
  .book-card-container {
    width: 100%;
  }
  .book-card {
    height: auto;
    width: 100%;
  }
  .book-left {
    width: 100%;
    border-right: none;
  }
  .card-img-wrapper {
    height: 300px;
  }
}
</style>
