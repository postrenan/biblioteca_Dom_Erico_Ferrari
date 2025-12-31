// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@vueuse/nuxt", "@nuxtjs/google-fonts"],
  css: ["~/assets/css/main.css"],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Outfit: [400, 600, 700, 900],
    },
  },
  runtimeConfig: {
    // 🔒 Privado (Lido apenas no servidor)
    notionToken: process.env.NOTION_TOKEN, 
    mailtrap: {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }, 

    // 🔓 Público (Disponível no navegador)
    public: {
      notion: {
        trips: process.env.NOTION_TRIPS_DB,
        reviews: process.env.NOTION_REVIEWS_DB,
        partners: process.env.NOTION_PARTNERS_DB,
        team: process.env.NOTION_TEAM_DB,
        blog: process.env.NOTION_BLOG_DB,
        settings: process.env.NOTION_SETTINGS_DB
      }
    }
  }
});