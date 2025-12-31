<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const config = useRuntimeConfig()
onMounted(() => {
  if (!config.public.notion.blog) console.error('ERRO: O ID do Blog está vazio/undefined!')
})
</script>