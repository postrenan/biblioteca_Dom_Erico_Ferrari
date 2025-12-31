<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

const { data: pastTrips, loading } = useNotion(NOTION_DBS.TRIPS)
</script>

<template>
  <section class="past-trips">
    <div class="container">
      <h2 class="section-title">Últimas Viagens</h2>
      
      <div v-if="loading" class="text-center py-4">
        <Icon name="lucide:loader-2" class="animate-spin" size="30" />
      </div>

      <div v-else class="past-trips-grid">
        <article v-for="trip in pastTrips" :key="trip.id" class="past-trip-card">
          <div class="past-trip-image">
            <img :src="trip.imagem || trip.image" :alt="trip.nome" />
            <div class="past-trip-overlay">
              <span class="participants" v-if="trip.vagas || trip.participantes">
                <Icon name="lucide:users" size="16" />
                {{ trip.participantes || trip.vagas }} viajantes
              </span>
            </div>
          </div>
          <div class="past-trip-content">
            <span class="past-trip-date">{{ trip.data_início || trip.data }}</span>
            <h3>{{ trip.nome }}</h3>
            <p>
              <Icon name="lucide:map-pin" size="14" />
              {{ trip.destino }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.past-trips {
  background: white;
}

.past-trips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.past-trip-card {
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  transition: transform 0.3s ease;
}

.past-trip-card:hover {
  transform: scale(1.03);
}

.past-trip-image {
  position: relative;
  height: 180px;
}

.past-trip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.past-trip-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 1rem;
}

.participants {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: white;
  font-size: 0.85rem;
}

.past-trip-content {
  padding: 1rem;
}

.past-trip-date {
  display: inline-block;
  background: var(--color-secondary);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.past-trip-content h3 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: var(--color-text);
}

.past-trip-content p {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
}

@media (max-width: 1024px) {
  .past-trips-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .past-trips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
