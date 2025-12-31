<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top blur-nav">
    <div class="container">
      <a class="navbar-brand fw-bold d-flex align-items-center" href="#">
        <i class="bi bi-book-half me-2 fs-3 brand-icon"></i>
        <span class="brand-text d-none d-sm-inline">
          Biblioteca
          <span class="text-highlight">Érico Veríssimo</span>
        </span>
        <span class="brand-text d-inline d-sm-none">
          Bib. <span class="text-highlight">EV</span>
        </span>
      </a>

      <button
        class="navbar-toggler border-0 shadow-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMain"
        aria-controls="navbarMain"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarMain">
        <ul
          class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2 mt-3 mt-lg-0"
        >
          <li class="nav-item w-100 w-lg-auto">
            <NuxtLink
              v-if="!user"
              class="btn btn-glass-primary px-4 rounded-pill w-100"
              to="/login"
            >
              <i class="bi bi-person-fill me-2"></i> Login
            </NuxtLink>
            <NuxtLink
              v-else
              class="btn btn-glass-warning px-4 rounded-pill w-100"
              :to="dashboardLink"
            >
              <i class="bi bi-speedometer2 me-2"></i> Painel
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  user: Object
});

const dashboardLink = computed(() => {
  if (!props.user) return "/login";
  if (props.user.role === "ADMIN") return "/dashboard/admin/users";
  if (props.user.role === "LIBRARIAN") return "/dashboard/manage-loans";
  return "/dashboard/my-loans";
});
</script>

<style scoped>
.blur-nav {
  background: rgba(18, 20, 32, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  padding: 1rem 0;
  z-index: 2000 !important;
}

.brand-icon {
  color: #f2f342;
}
.text-highlight {
  color: #f2f342;
}

.btn-glass-primary {
  background: rgba(67, 97, 238, 0.2);
  border: 1px solid rgba(67, 97, 238, 0.4);
  color: #fff;
  transition: all 0.3s;
}
.btn-glass-primary:hover {
  background: #4361ee;
  border-color: #4361ee;
  transform: translateY(-2px);
}

.btn-glass-warning {
  background: rgba(255, 209, 102, 0.2);
  border: 1px solid rgba(255, 209, 102, 0.4);
  color: #ffd166;
  font-weight: 600;
  transition: all 0.3s;
}
.btn-glass-warning:hover {
  background: #ffd166;
  color: #000;
  transform: translateY(-2px);
}
</style>
