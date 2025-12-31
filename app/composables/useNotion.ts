interface NotionItem {
  id: string
  [key: string]: any
}

interface UseNotionOptions {
  immediate?: boolean
}

export function useNotion<T = NotionItem>(databaseId: string, options: UseNotionOptions = {}) {
  const { immediate = true } = options
  
  const data = ref<T[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    if (!databaseId) {
      console.warn('useNotion: Database ID is missing. Check your .env or runtimeConfig.')
      return
    }

    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ success: boolean; data: T[] }>('/api/notion', {
        query: { db: databaseId }
      })
      
      if (response.success) {
        data.value = response.data
      }
    } catch (e: any) {
      console.error('Error fetching from Notion:', e)
      error.value = e.message || 'Failed to fetch data'
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    fetch()
  }

  return {
    data,
    loading,
    error,
    refresh: fetch
  }
}

// Database IDs from runtime config
export const NOTION_DBS = {
  get TRIPS() { return useRuntimeConfig().public.notion.trips || '' },
  get REVIEWS() { return useRuntimeConfig().public.notion.reviews || '' },
  get PARTNERS() { return useRuntimeConfig().public.notion.partners || '' },
  get TEAM() { return useRuntimeConfig().public.notion.team || '' },
  get BLOG() { return useRuntimeConfig().public.notion.blog || '' },
  get SETTINGS() { return useRuntimeConfig().public.notion.settings || '' }
}
