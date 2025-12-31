<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

const { data: trips } = useNotion(NOTION_DBS.DB_1)



const photos = computed(() => {
  if (trips.value && trips.value.length > 0) {
    return trips.value
      .filter((t: any) => t.imagem)
      .map((t: any, index: number) => ({
        id: t.id || index,
        src: t.imagem,
        alt: t.nome || 'Foto de viagem'
      }))
      .slice(0, 6)
  }
  return []
})

const selectedPhoto = ref<string | null>(null)
</script>

<template>
  <section class="gallery">
    <div class="container">
      <h2 class="section-title">Galeria de Fotos</h2>
      
      <div class="gallery-grid">
        <div 
          v-for="photo in photos" 
          :key="photo.id" 
          class="gallery-item"
          @click="selectedPhoto = photo.id"
        >
          <img :src="photo.src" :alt="photo.alt" />
          <div class="gallery-overlay">
            <Icon name="lucide:zoom-in" size="32" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedPhoto" class="lightbox" @click="selectedPhoto = null">
          <button class="lightbox-close" @click="selectedPhoto = null">
            <Icon name="lucide:x" size="32" />
          </button>
          <img 
            :src="photos.find(p => p.id === selectedPhoto)?.src.replace('w=600&h=400', 'w=1200&h=800')" 
            :alt="photos.find(p => p.id === selectedPhoto)?.alt"
          />
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery {
  background: #f8fafc;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3/2;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 86, 179, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.lightbox-close:hover {
  transform: rotate(90deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
