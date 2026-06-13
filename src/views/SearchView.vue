<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchInterpolProfile } from '../services/api'
import { grantProfileAccess } from '../stores/access'

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
      const slug = query.value.trim().toLowerCase()
      grantProfileAccess(slug)
      router.push({
        name: 'interpol-profile',
        params: { slug }
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
</script>

<template>
  <v-main class="search-shell">
    <div class="search-backdrop" aria-hidden="true"></div>

    <v-container class="search-container py-6 py-md-10">
      <div class="dossier-topbar dossier-topbar--end">
        <div class="dossier-classification">
          <span class="dossier-classification__dot" aria-hidden="true"></span>
          Accesso autorizzato — Interpol
        </div>
      </div>

      <div class="search-brand">
        <div class="brand-mark">INTERPOL</div>
        <div class="brand-subtitle">Global Intelligence Search</div>
      </div>

      <v-sheet class="search-panel dossier-panel mt-4 pa-4 pa-md-8" rounded="0" elevation="0">
        <div class="terminal-bar">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="search-header">
          <div class="search-kicker">Archivio internazionale ricercati</div>
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
            variant="outlined"
            density="comfortable"
            rounded="0"
            hide-details
            class="search-field"
            :disabled="isSearching"
            @keyup.enter="runSearch"
          />

          <v-btn
            color="primary"
            size="x-large"
            rounded="0"
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
