<template>
  <section class="hero-section d-flex align-items-center position-relative">
    <div class="hero-bg-anim"></div>
    <div
      class="container position-relative z-2 text-center"
      data-aos="zoom-in"
    >
      <span
        class="badge bg-white-soft text-dark mb-3 px-3 py-2 rounded-pill fw-bold text-uppercase ls-2"
        >Bem-vindo ao Conhecimento</span
      >
      <h1
        class="display-3 display-md-3 fw-black text-white mb-4 fs-1 fs-md-2 fs-lg-4"
      >
        Explore Mundos <br />
        <span class="text-gradient">Sem Sair do Lugar</span>
      </h1>
      <p class="lead text-white-50 mx-auto col-lg-6 mb-5 px-3">
        Descubra milhares de livros, artigos e materiais didáticos disponíveis
        para você. Sua próxima aventura começa aqui.
      </p>

      <div
        class="search-box col-11 col-lg-6 mx-auto bg-white p-2 rounded-pill shadow-lg d-flex"
      >
        <input
          type="text"
          class="form-control border-0 rounded-pill ps-4 shadow-none fs-5"
          placeholder="Qual livro você procura hoje?"
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
        <button
          class="btn btn-primary rounded-pill px-4 fw-bold"
          @click="$emit('search')"
        >
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>

    <!-- Decorative Shapes -->
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
  </section>
</template>

<script setup lang="ts">
defineProps({
    searchQuery: String
});
defineEmits(['update:searchQuery', 'search']);
</script>

<style scoped>
.hero-section {
  min-height: 85vh; /* Taller hero */
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
  padding-top: 80px;
}

.hero-bg-anim {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.text-gradient {
  background: linear-gradient(to right, #4cc9f0, #4361ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-white-soft {
  background: rgba(255, 255, 255, 0.9);
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 1;
}
.shape-1 {
  width: 400px;
  height: 400px;
  background: #4cc9f0;
  top: -100px;
  left: -100px;
}
.shape-2 {
  width: 500px;
  height: 500px;
  background: #f72585;
  bottom: -100px;
  right: -100px;
}
</style>
