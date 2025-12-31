<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

const { data: partners, loading } = useNotion(NOTION_DBS.PARTNERS)
</script>

<template>
  <section class="partners">
    <div class="container">
      <h2 class="section-title">Nossos Parceiros</h2>
      <p class="partners-subtitle">Trabalhamos com as melhores empresas do mundo</p>
      
      <div class="partners-grid">
        <div v-for="partner in partners" :key="partner.nome" class="partner-logo">
          <img :src="partner.logo || partner.imagem || partner.icon" :alt="partner.nome" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.partners {
  background: white;
  padding: 4rem 0;
}

.partners-subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-top: -2rem;
  margin-bottom: 3rem;
}

.partners-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.partner-logo {
  height: 50px;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.partner-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
}

.partner-logo img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .partners-grid {
    gap: 2rem;
  }

  .partner-logo {
    height: 35px;
  }
}
</style>
