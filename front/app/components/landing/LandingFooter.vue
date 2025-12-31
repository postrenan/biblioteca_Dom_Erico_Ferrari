<template>
  <footer class="footer bg-dark text-white pt-5 pb-3">
    <div class="container">
      <div class="row g-4 justify-content-between">
        <div class="col-md-4">
          <h5 class="fw-bold mb-3">biblioteca Érico Veríssimo</h5>
          <p class="text-white-50 small">
            Promovendo o acesso ao conhecimento e incentivando a leitura para
            todos os alunos, professores e comunidade.
          </p>
        </div>
        <div class="col-md-3">
          <h5 class="fw-bold mb-3">Links Rápidos</h5>
          <ul class="list-unstyled text-white-50 small">
            <li class="mb-2">
              <a href="#" class="text-reset text-decoration-none">Início</a>
            </li>
            <li class="mb-2">
              <a href="#acervo" class="text-reset text-decoration-none">Acervo</a>
            </li>
            <li class="mb-2">
              <NuxtLink to="/login" class="text-reset text-decoration-none"
                >Login</NuxtLink
              >
            </li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5 class="fw-bold mb-3">Contato</h5>
          <ul class="list-unstyled text-white-50 small">
            <li class="mb-2">
              <i class="bi bi-geo-alt me-2"></i> Rua do Conhecimento, 123
            </li>
            <li class="mb-2">
              <i class="bi bi-envelope me-2"></i> contato@biblioteca.com
            </li>
          </ul>
        </div>
      </div>
      <div class="border-top border-secondary mt-4 pt-3 text-center">
        <small class="text-white-50"
          >&copy; {{ new Date().getFullYear() }} biblioteca Érico Veríssimo.
          Todos os direitos reservados.</small
        >
      </div>
    </div>
  </footer>
</template>
