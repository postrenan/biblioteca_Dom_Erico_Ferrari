<script setup lang="ts">
const { settings } = useSiteSettings()

const formatNumber = (num: string | number) => {
  const n = typeof num === 'string' ? parseInt(num) : num
  if (isNaN(n)) return num
  if (n >= 1000) return `${Math.floor(n / 1000)}k+`
  return `${n}+`
}
</script>

<template>
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <h1 class="hero-title">
        Descubra o Mundo com a
        <span class="highlight">{{ settings.empresa_nome }}</span>
      </h1>
      <p class="hero-subtitle">
        {{ settings.empresa_slogan || 'Viagens inesquecíveis, experiências únicas e memórias para toda a vida.' }}
      </p>
      <div class="hero-cta">
        <NuxtLink to="/viagens" class="btn btn-secondary">
          Ver Viagens
        </NuxtLink>
        <NuxtLink to="/sobre" class="btn btn-outline">
          Conheça-nos
        </NuxtLink>
      </div>
      
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">{{ formatNumber(settings.viagens_realizadas) }}</span>
          <span class="stat-label">Viagens Realizadas</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ formatNumber(settings.clientes_satisfeitos) }}</span>
          <span class="stat-label">Clientes Satisfeitos</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ formatNumber(settings.destinos) }}</span>
          <span class="stat-label">Destinos</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1a365d 0%, #2d5a87 50%, #0056b3 100%);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,204,0,0.1)"/><circle cx="80" cy="40" r="3" fill="rgba(255,204,0,0.05)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,204,0,0.1)"/></svg>');
  animation: float 20s infinite linear;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-50px) rotate(360deg); }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 70%, rgba(255, 204, 0, 0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: white;
}

.highlight {
  color: var(--color-secondary);
  position: relative;
}

.hero-subtitle {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  opacity: 0.9;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-outline {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: white;
  color: var(--color-primary);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
