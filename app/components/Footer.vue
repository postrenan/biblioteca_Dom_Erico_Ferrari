<script setup lang="ts">
const currentYear = new Date().getFullYear()
const { settings } = useSiteSettings()

const socialLinks = computed(() => [
  { icon: 'lucide:instagram', url: settings.value.instagram || '#' },
  { icon: 'lucide:facebook', url: settings.value.facebook || '#' },
  { icon: 'lucide:youtube', url: settings.value.youtube || '#' },
  { icon: 'lucide:phone', url: `tel:${settings.value.whatsapp || '+5511999999999'}` }
])

const footerLinks = [
  { name: 'Início', path: '/' },
  { name: 'Viagens', path: '/viagens' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Blog', path: '/blog' }
]
</script>

<template>
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-brand">
        <NuxtLink to="/" class="logo">
          <span class="logo-grand">Grand</span><span class="logo-tour">Tour</span>
        </NuxtLink>
        <p class="footer-tagline">{{ settings.empresa_slogan }}</p>
        <div class="social-links">
  <ClientOnly>
    <a v-if="settings?.instagram" :href="settings.instagram" target="_blank" aria-label="Instagram">
      <Icon name="lucide:instagram" />
    </a>
    <a v-if="settings?.facebook" :href="settings.facebook" target="_blank" aria-label="Facebook">
      <Icon name="lucide:facebook" />
    </a>
    <a v-if="settings?.youtube" :href="settings.youtube" target="_blank" aria-label="YouTube">
      <Icon name="lucide:youtube" />
    </a>
  </ClientOnly>
</div>
      </div>

      <div class="footer-nav">
        <h4>Links Rápidos</h4>
        <nav>
          <NuxtLink v-for="link in footerLinks" :key="link.path" :to="link.path">
            {{ link.name }}
          </NuxtLink>
        </nav>
      </div>

      <div class="footer-contact">
        <h4>Contato</h4>
        <p><Icon name="lucide:mail" size="16" /> {{ settings.email_contato }}</p>
        <p><Icon name="lucide:phone" size="16" /> {{ settings.telefone }}</p>
        <p><Icon name="lucide:map-pin" size="16" /> {{ settings.endereco }}</p>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; {{ currentYear }} {{ settings.empresa_nome }}. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  margin-top: auto;
}

.footer-container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding: 4rem 2rem;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 900;
}

.logo-grand {
  color: white;
}

.logo-tour {
  color: var(--color-secondary);
}

.footer-tagline {
  margin-top: 1rem;
  opacity: 0.9;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--color-secondary);
  color: var(--color-primary);
  transform: translateY(-3px);
}

.footer-nav h4,
.footer-contact h4 {
  color: var(--color-secondary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-nav nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-nav a {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.footer-nav a:hover {
  opacity: 1;
  color: var(--color-secondary);
}

.footer-contact p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-tagline {
    max-width: 100%;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
