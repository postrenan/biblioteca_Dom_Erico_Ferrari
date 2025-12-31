<script setup lang="ts">
const menuOpen = ref(false)

const navItems = [
  { name: 'Início', path: '/' },
  { name: 'Viagens', path: '/viagens' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Blog', path: '/blog' }
]
</script>

<template>
  <header class="header">
    <div class="container header-container">
      <NuxtLink to="/" class="logo">
        <span class="logo-grand">Grand</span><span class="logo-tour">Tour</span>
      </NuxtLink>

      <nav class="nav-desktop">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path" 
          class="nav-link"
        >
          {{ item.name }}
        </NuxtLink>
        <NuxtLink to="/viagens" class="btn btn-secondary">
          Reserve Agora
        </NuxtLink>
      </nav>

      <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="Menu">
        <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" size="24" />
      </button>
    </div>

    <Transition name="slide">
      <nav v-if="menuOpen" class="nav-mobile">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path" 
          class="nav-link-mobile"
          @click="menuOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
        <NuxtLink to="/viagens" class="btn btn-secondary" @click="menuOpen = false">
          Reserve Agora
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 900;
}

.logo-grand {
  color: var(--color-primary);
}

.logo-tour {
  color: var(--color-secondary);
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  color: var(--color-text);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-secondary);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
}

.nav-mobile {
  display: none;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  background: white;
  border-top: 1px solid #eee;
}

.nav-link-mobile {
  padding: 0.5rem 0;
  font-weight: 500;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .nav-desktop {
    display: none; 
  }

  .menu-toggle {
    display: block;
  }

  .nav-mobile {
    display: flex;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
