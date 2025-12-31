<template>
  <div class="app-container">
    <LandingNavbar :user="user" />

    <main>
      <LandingHero
        v-model:searchQuery="searchQuery"
        @search="scrollToBooks"
      />

      <!-- FEATURED / BOOKS SECTION -->
      <section id="acervo" class="books-section py-5 position-relative">
        <div class="container">
          <div class="section-header text-center mb-5" data-aos="fade-up">
            <h2 class="fw-bold display-6">
              Nosso <span class="text-primary">Acervo</span>
            </h2>
            <div class="divider mx-auto"></div>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Carregando a biblioteca...</p>
          </div>

          <div v-else-if="Object.keys(groupedBooks).length > 0">
            <div
              v-for="(books, genre) in groupedBooks"
              :key="genre"
              class="genre-section mb-5"
            >
              <div
                class="d-flex justify-content-between align-items-center mb-4 px-2"
                data-aos="fade-right"
              >
                <h3
                  class="h4 fw-bold mb-0 text-dark border-start border-4 border-primary ps-3"
                >
                  {{ genre }}
                </h3>
                <span class="badge bg-light text-muted rounded-pill"
                  >{{ books.length }} títulos</span
                >
              </div>

              <div class="books-grid" data-aos="fade-up" data-aos-delay="100">
                <LandingBookCard
                  v-for="book in books"
                  :key="book.id"
                  :book="book"
                  :user="user"
                  :isInWishlist="isInWishlist(book.id)"
                  @toggle-wishlist="toggleWishlist"
                />
              </div>
            </div>
          </div>

          <div v-else class="empty-state text-center py-5" data-aos="fade-in">
            <i class="bi bi-search display-1 text-light mb-4"></i>
            <h3 class="text-muted">
              Nenhum livro encontrado para "{{ searchQuery }}"
            </h3>
            <p class="text-muted">Tente buscar por outro título ou autor.</p>
          </div>
        </div>
      </section>
    </main>

    <LandingFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

// Components
import LandingNavbar from "~/components/landing/LandingNavbar.vue";
import LandingHero from "~/components/landing/LandingHero.vue";
import LandingFooter from "~/components/landing/LandingFooter.vue";
import LandingBookCard from "~/components/landing/LandingBookCard.vue";

// Stores
import { useBookStore } from "~/composables/useBookStore";
import { useAuth } from "~/composables/useAuth";
import { useWishlistStore } from "~/composables/useWishlistStore";

// Using stores
const { books, fetchBooks, loading } = useBookStore();
const { user } = useAuth();
const { wishlist, addToWishlist, removeFromWishlist, fetchMyWishlist } = useWishlistStore();

// --- LÓGICA DO COMPONENTE ---

const searchQuery = ref("");

onMounted(async () => {
  if (typeof window !== "undefined") {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }

  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
  });

  await fetchBooks();
  if (user.value) await fetchMyWishlist();
});

const isInWishlist = (bookId) => {
    return wishlist.value.some(item => item.bookId === bookId);
};

const toggleWishlist = async (book) => {
    if (isInWishlist(book.id)) {
        await removeFromWishlist(book.id);
    } else {
        await addToWishlist(book.id);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: 'success',
          title: 'Adicionado à Lista de Desejos!'
        });
    }
};

const groupedBooks = computed(() => {
  const filtered = books.value.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  return filtered.reduce((acc, book) => {
    const genre = book.genre || "Outros";
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(book);
    return acc;
  }, {});
});

const scrollToBooks = () => {
  const el = document.getElementById("acervo");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap");

.app-container {
  font-family: "Inter", sans-serif;
  background-color: #f4f7f6;
  overflow-x: hidden;
}

.divider {
  height: 4px;
  width: 60px;
  background: #0d6efd;
  border-radius: 2px;
  margin-top: 10px;
}

.books-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}
</style>
