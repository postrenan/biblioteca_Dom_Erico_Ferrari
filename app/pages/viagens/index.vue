<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

useSeoMeta({
  title: 'Viagens - GrandTour',
  description: 'Explore todos os destinos disponíveis e encontre sua próxima aventura com a GrandTour.'
})

const { data: allTrips, loading } = useNotion(NOTION_DBS.TRIPS)

const categories = ['Todos', 'Aventura', 'Natureza', 'Cultural', 'Safari', 'Praias']
const selectedCategory = ref('Todos')

const filteredTrips = computed(() => {
  const trips = allTrips.value || []
  if (selectedCategory.value === 'Todos') return trips
  return trips.filter((trip: any) => trip.categoria === selectedCategory.value)
})

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return price
  return `R$ ${num.toLocaleString('pt-BR')}`
}
</script>

<template>
  <div class="trips-page">
    <!-- Hero Section -->
    <section class="trips-hero">
      <div class="container trips-hero-content">
        <h1>Nossas Viagens</h1>
        <p>Escolha seu próximo destino e viva experiências inesquecíveis</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="trips-filters">
      <div class="container">
        <div class="filter-buttons">
          <button 
            v-for="category in categories" 
            :key="category"
            :class="['filter-btn', { active: selectedCategory === category }]"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>

    <!-- Trips Grid -->
    <section class="trips-grid-section">
      <div class="container">
        <TransitionGroup name="trips" tag="div" class="trips-grid">
          <article v-for="trip in filteredTrips" :key="trip.id" class="trip-card-full">
            <div class="trip-image">
              <img :src="trip.imagem || trip.image" :alt="trip.nome" />
              <span class="trip-category">{{ trip.categoria }}</span>
              <span class="trip-spots">{{ trip.vagas }} vagas</span>
            </div>
            <div class="trip-content">
              <div class="trip-header">
                <div>
                  <h3>{{ trip.nome }}</h3>
                  <p class="trip-destination">
                    <Icon name="lucide:map-pin" size="14" />
                    {{ trip.destino }}
                  </p>
                </div>
                <div class="trip-price">
                  {{ formatPrice(trip.preço) }}
                </div>
              </div>
              <p class="trip-description">{{ trip.descricao }}</p>
              <div class="trip-meta">
                <span>
                  <Icon name="lucide:calendar" size="14" />
                  {{ trip.data_início }}
                </span>
                <span>
                  <Icon name="lucide:clock" size="14" />
                  {{ trip.duração }}
                </span>
              </div>
              <NuxtLink :to="`/viagens/${trip.id}`" class="btn btn-primary">
                Ver Detalhes
              </NuxtLink>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container cta-content">
        <h2>Não encontrou o que procura?</h2>
        <p>Entre em contato conosco e montamos uma viagem personalizada para você!</p>
        <a href="mailto:contato@grandtour.com.br" class="btn btn-secondary">
          Fale Conosco
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.trips-hero {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  padding: 6rem 0;
  text-align: center;
}

.trips-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  color: white;
  margin-bottom: 0.5rem;
}

.trips-hero p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.trips-filters {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 70px;
  z-index: 50;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 30px;
  background: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.trips-grid-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.trip-card-full {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trip-card-full:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 86, 179, 0.15);
}

.trip-card-full .trip-image {
  position: relative;
  height: 220px;
}

.trip-card-full .trip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trip-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--color-primary);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.trip-spots {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.trip-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.trip-content h3 {
  font-size: 1.3rem;
  margin-bottom: 0.3rem;
  color: var(--color-text);
}

.trip-destination {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.trip-price {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.trip-description {
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.trip-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.trip-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.cta-section {
  background: linear-gradient(135deg, var(--color-secondary), #ffd633);
  padding: 4rem 0;
}

.cta-content {
  text-align: center;
}

.cta-content h2 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.cta-content p {
  color: var(--color-primary);
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.trips-enter-active,
.trips-leave-active {
  transition: all 0.4s ease;
}

.trips-enter-from,
.trips-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 900px) {
  .trips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
