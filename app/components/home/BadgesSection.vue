<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'



const { data: badges, loading } = useNotion(NOTION_DBS.DB_3)
</script>

<template>
  <section class="badges">
    <div class="container">
      <h2 class="section-title">Nossos Selos e Certificações</h2>
      
      <div class="badges-grid">
        <div v-for="badge in badges" :key="badge.titulo" class="badge-card">
          <div class="badge-icon">
            <Icon :name="badge.icon" size="40" />
          </div>
          <h3>{{ badge.titulo }}</h3>
          <p>{{ badge.descricao }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.badges {
  background: white;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.badge-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(145deg, #f8fafc, #ffffff);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.badge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 86, 179, 0.1);
  border-color: var(--color-secondary);
}

.badge-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.badge-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.badge-card p {
  font-size: 0.9rem;
  color: var(--color-text-light);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .badges-grid {
    grid-template-columns: 1fr;
  }
}
</style>
