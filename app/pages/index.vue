<script setup lang="ts">
useSeoMeta({
  title: 'GrandTour - Agência de Turismo',
  description: 'Descubra o mundo com a GrandTour. Viagens inesquecíveis, experiências únicas e memórias para toda a vida.',
  ogTitle: 'GrandTour - Agência de Turismo',
  ogDescription: 'Descubra o mundo com a GrandTour. Viagens inesquecíveis, experiências únicas e memórias para toda a vida.'
})
</script>

<template>
  <div class="home-page">
    <HomeHeroSection />
    <HomeUpcomingTrips />
    <HomePastTrips />
    <HomePlanBuilder />
    <HomePartnersSection />
    <HomePhotoGallery />
    <HomeReviewsSection />
    <HomeBadgesSection />
  </div>
</template>

<style scoped>
.home-page {
  overflow-x: hidden;
}
</style>