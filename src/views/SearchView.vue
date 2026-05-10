<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchInterpolProfile } from '../services/api'

const router = useRouter()
const query = ref('')
const isSearching = ref(false)
const errorMessage = ref('')

async function runSearch() {
  isSearching.value = true
  errorMessage.value = ''

  try {
    const result = await searchInterpolProfile(query.value)

    if (result.found) {
      router.push({
        name: 'interpol-profile',
        params: { slug: query.value.trim().toLowerCase() }
      })
      return
    }

    router.push({
      name: 'interpol-not-found',
      query: { q: query.value.trim() || 'ricerca vuota' }
    })
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSearching.value = false
  }
}

function goBack() {
  router.push({ name: 'home' })
}
</script>

<template>
  <v-main class="search-shell">
    <v-container class="py-8">
      <v-btn
        variant="outlined"
        color="primary"
        rounded="pill"
        class="back-button"
        @click="goBack"
      >
        Torna indietro
      </v-btn>

      <div class="search-brand">
        <div class="brand-mark">INTERPOL</div>
        <div class="brand-subtitle">Global Intelligence Search</div>
      </div>

      <v-sheet class="search-panel pa-4 pa-md-6" rounded="xl" elevation="4">
        <div class="search-header mb-4">
          <h1 class="search-title">Ricerca archivio</h1>
          <p class="search-description">
            Interroga il database simulato usando nome, alias o parola chiave.
          </p>
        </div>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>

        <div class="search-bar-wrap">
          <v-text-field
            v-model="query"
            placeholder="Inserisci un termine di ricerca"
            variant="solo-filled"
            flat
            rounded="pill"
            hide-details
            bg-color="white"
            class="search-field"
            :disabled="isSearching"
            @keyup.enter="runSearch"
          />

          <v-btn
            color="primary"
            size="x-large"
            rounded="pill"
            class="search-action"
            :loading="isSearching"
            @click="runSearch"
          >
            Avvia ricerca
          </v-btn>
        </div>
      </v-sheet>
    </v-container>
  </v-main>
</template>
