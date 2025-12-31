<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

// Busca do Notion
const { data: upcomingTrips, loading } = useNotion(NOTION_DBS.TRIPS)

// Formata preço
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return price
  return `R$ ${num.toLocaleString('pt-BR')}`
}
</script>

<template>
  <section class="upcoming-trips">
    <div class="container">
      <h2 class="section-title">Próximas Viagens</h2>
      
      <div class="trips-grid">
        <article v-for="trip in upcomingTrips" :key="trip.id" class="trip-card">
          <div class="trip-image">
            <img :src="trip.imagem || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop'" :alt="trip.nome" />
            <span class="trip-badge">{{ trip.vagas }} vagas</span>
          </div>
          <div class="trip-content">
            <div class="trip-meta">
              <span class="trip-destination">
                <Icon name="lucide:map-pin" size="14" />
                {{ trip.destino }}
              </span>
              <span class="trip-duration">
                <Icon name="lucide:calendar" size="14" />
                {{ trip.duração }}
              </span>
            </div>
            <h3 class="trip-title">{{ trip.nome }}</h3>
            <p class="trip-date">{{ trip.data_início }}</p>
            <div class="trip-footer">
              <span class="trip-price">{{ formatPrice(trip.preço) }}</span>
              <NuxtLink :to="`/viagens/${trip.id}`" class="btn btn-primary btn-sm">
                Ver Detalhes
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div class="section-cta">
        <NuxtLink to="/viagens" class="btn btn-secondary">
          Ver Todas as Viagens
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.upcoming-trips {
  background: #f8fafc;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.trip-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trip-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 86, 179, 0.15);
}

.trip-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.trip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.trip-card:hover .trip-image img {
  transform: scale(1.1);
}

.trip-badge {
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
}

.trip-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.trip-destination,
.trip-duration {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.trip-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.trip-date {
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 1rem;
}

.trip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trip-price {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.section-cta {
  text-align: center;
  margin-top: 3rem;
}
</style>
