<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'


const { data: reviews, loading } = useNotion(NOTION_DBS.REVIEWS)

const currentReview = ref(0)

const nextReview = () => {
  currentReview.value = (currentReview.value + 1) % reviews.value.length
}

const prevReview = () => {
  currentReview.value = (currentReview.value - 1 + reviews.value.length) % reviews.value.length
}
</script>

<template>
  <section class="reviews">
    <div class="container">
      <h2 class="section-title">O Que Dizem Nossos Viajantes</h2>
      
      <div class="reviews-wrapper">
        <button class="nav-btn prev" @click="prevReview">
          <Icon name="lucide:chevron-left" size="24" />
        </button>

        <div class="reviews-container">
          <TransitionGroup name="slide-review">
            <div 
              v-for="(review, index) in reviews" 
              :key="review.id"
              v-show="index === currentReview"
              class="review-card"
            >
              <div class="review-header">
                <img :src="review.avatar || review.foto || 'https://i.pravatar.cc/100'" :alt="review.nome" class="review-avatar" />
                <div class="review-info">
                  <h4>{{ review.nome }}</h4>
                  <p class="review-trip">{{ review.viagem }}</p>
                </div>
                <div class="review-rating">
                  <Icon 
                    v-for="star in 5" 
                    :key="star" 
                    name="lucide:star"
                    size="18"
                    :class="{ filled: star <= (review.nota || 5) }"
                  />
                </div>
              </div>
              <blockquote class="review-text">
                "{{ review.depoimento }}"
              </blockquote>
            </div>
          </TransitionGroup>
        </div>

        <button class="nav-btn next" @click="nextReview">
          <Icon name="lucide:chevron-right" size="24" />
        </button>
      </div>

      <div class="review-dots">
        <button 
          v-for="(_, index) in reviews" 
          :key="index"
          :class="['dot', { active: index === currentReview }]"
          @click="currentReview = index"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.reviews {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
}

.reviews .section-title {
  color: white;
}

.reviews .section-title::after {
  background: var(--color-secondary);
}

.reviews-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.reviews-container {
  flex: 1;
  min-height: 200px;
  position: relative;
}

.review-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.review-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid var(--color-secondary);
}

.review-info h4 {
  color: white;
  margin-bottom: 0.2rem;
}

.review-trip {
  font-size: 0.9rem;
  opacity: 0.8;
}

.review-rating {
  margin-left: auto;
  display: flex;
  gap: 0.2rem;
}

.review-rating .filled {
  color: var(--color-secondary);
  fill: var(--color-secondary);
}

.review-text {
  font-size: 1.15rem;
  font-style: italic;
  line-height: 1.8;
  opacity: 0.95;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.nav-btn:hover {
  background: var(--color-secondary);
  color: var(--color-primary);
}

.review-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--color-secondary);
  transform: scale(1.2);
}

.slide-review-enter-active,
.slide-review-leave-active {
  transition: all 0.5s ease;
}

.slide-review-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-review-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 768px) {
  .nav-btn {
    display: none;
  }

  .reviews-wrapper {
    flex-direction: column;
  }
}
</style>
