<template>
  <div class="d-flex align-items-center justify-content-center vh-100 bg-login">
    <!-- Animated background shapes could go here -->

    <div
      class="card glass-card border-0 p-4 p-md-5"
      style="max-width: 420px; width: 90%"
    >
      <div class="card-body">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-primary mb-2">Biblioteca</h2>
          <p class="text-muted">Acesse sua conta para continuar</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control bg-transparent"
              id="matricula"
              v-model="matricula"
              required
              placeholder="Matrícula"
            />
            <label for="matricula">Matrícula</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="password"
              class="form-control bg-transparent"
              id="password"
              v-model="password"
              required
              placeholder="Senha"
            />
            <label for="password">Senha</label>
          </div>

          <div
            v-if="errorMessage"
            class="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <i class="bi bi-exclamation-circle-fill me-2"></i>
            <div>{{ errorMessage }}</div>
          </div>

  <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="rememberMe" v-model="rememberMe">
            <label class="form-check-label text-muted small" for="rememberMe">
              Lembre de mim
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 py-3 mb-3 fw-bold shadow-sm"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isLoading ? "Autenticando..." : "Entrar no Sistema" }}
          </button>
        </form>

        <div class="text-center mt-4">
          <NuxtLink
            to="/"
            class="text-decoration-none text-secondary small opacity-75 hover-opacity-100"
          >
            <i class="bi bi-arrow-left me-1"></i> Voltar ao Portal
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-login {
  background: radial-gradient(
    circle at 10% 20%,
    rgb(239, 246, 255) 0%,
    rgb(219, 228, 255) 90%
  );
}
.form-control {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.form-control:focus {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}
.hover-opacity-100:hover {
  opacity: 1 !important;
}
</style>

<script setup>
import { ref, onMounted } from "vue";

const matricula = ref("");
const password = ref("");
const rememberMe = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);

const { login } = useAuth();
const router = useRouter();

onMounted(() => {
  const saved = localStorage.getItem('auth_remember');
  if (saved) {
    try {
      const { m, p } = JSON.parse(atob(saved));
      matricula.value = m;
      password.value = p;
      rememberMe.value = true;
    } catch (e) {
      localStorage.removeItem('auth_remember');
    }
  }
});

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  if (rememberMe.value) {
    const data = btoa(JSON.stringify({ m: matricula.value, p: password.value }));
    localStorage.setItem('auth_remember', data);
  } else {
    localStorage.removeItem('auth_remember');
  }

  try {
    const user = await login(matricula.value, password.value);
    if (user) {
      // Redirect based on role
      if (user.role === "ADMIN") {
        router.push("/dashboard/admin/users"); // Or a generic dashboard
      } else if (user.role === "LIBRARIAN") {
        router.push("/dashboard/manage-loans");
      } else {
        router.push("/dashboard/my-loans");
      }
    }
  } catch (error) {
    errorMessage.value =
      "Falha no login. Verifique suas credenciais ou a conexão com o servidor.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
