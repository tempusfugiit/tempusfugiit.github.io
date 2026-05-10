<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchInterpolProfile } from '../services/api'

const route = useRoute()
const router = useRouter()
const profile = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

async function loadProfile(slug) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await fetchInterpolProfile(slug)

    if (!result.found) {
      router.replace({ name: 'interpol-not-found', query: { q: slug } })
      return
    }

    const person = result.data
    profile.value = {
      displayName: person.name,
      codename: person.role,
      summary: `Punti accumulati: ${person.points}`,
      status: 'Profilo recuperato dal backend',
      nationality: 'N/D',
      age: 'N/D',
      lastSeen: 'N/D',
      portrait:
        'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 620">
            <rect width="480" height="620" rx="36" fill="#1d3145" />
            <circle cx="240" cy="190" r="92" fill="#c9824a" opacity="0.92" />
            <path d="M124 514c18-92 73-139 116-139s98 47 116 139" fill="#c9824a" opacity="0.85" />
            <text x="240" y="582" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="white" letter-spacing="6">${person.name.slice(0, 2).toUpperCase()}</text>
          </svg>
        `),
      details: [
        `Ruolo: ${person.role}`,
        `Punteggio: ${person.points}`,
        person.history
      ],
      aliases: [person.name],
      notes: ['Dati caricati dal Cloudflare Worker.']
    }
  } catch (error) {
    if (error.message === 'Not found') {
      router.replace({ name: 'interpol-not-found', query: { q: slug } })
      return
    }

    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push({ name: 'interpol' })
}

watch(
  () => route.params.slug,
  (slug) => {
    profile.value = null
    loadProfile(String(slug ?? ''))
  },
  { immediate: true }
)
</script>

<template>
  <v-main class="dossier-shell">
    <v-container class="py-6 py-md-10">
      <v-btn
        variant="outlined"
        color="primary"
        rounded="pill"
        class="back-button"
        @click="goBack"
      >
        Torna indietro
      </v-btn>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mt-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-sheet
        v-else-if="isLoading"
        class="dossier-hero mt-4 pa-4 pa-md-8"
        rounded="xl"
        elevation="8"
      >
        <p class="wiki-summary">Caricamento dossier...</p>
      </v-sheet>

      <v-sheet v-else-if="profile" class="dossier-hero mt-4 pa-4 pa-md-8" rounded="xl" elevation="8">
        <div class="dossier-grid">
          <div class="dossier-photo-frame">
            <img
              :src="profile.portrait"
              :alt="`Ritratto simulato di ${profile.displayName}`"
              class="dossier-photo"
            >
          </div>

          <div>
            <div class="wiki-kicker">Archivio internazionale</div>
            <h1 class="wiki-title">{{ profile.displayName }}</h1>
            <p class="wiki-subtitle">{{ profile.codename }}</p>
            <p class="wiki-summary">{{ profile.summary }}</p>

            <div class="wiki-infobox">
              <div><strong>Stato:</strong> {{ profile.status }}</div>
              <div><strong>Nazionalita:</strong> {{ profile.nationality }}</div>
              <div><strong>Eta stimata:</strong> {{ profile.age }} anni</div>
              <div><strong>Ultimo avvistamento:</strong> {{ profile.lastSeen }}</div>
            </div>
          </div>
        </div>
      </v-sheet>

      <div v-if="profile && !isLoading" class="wiki-columns mt-6">
        <v-sheet class="wiki-card pa-5 pa-md-6" rounded="xl" elevation="2">
          <h2 class="wiki-section-title">Profilo</h2>
          <p
            v-for="detail in profile.details"
            :key="detail"
            class="wiki-paragraph"
          >
            {{ detail }}
          </p>
        </v-sheet>

        <v-sheet class="wiki-card pa-5 pa-md-6" rounded="xl" elevation="2">
          <h2 class="wiki-section-title">Alias noti</h2>
          <ul class="wiki-list">
            <li v-for="alias in profile.aliases" :key="alias">{{ alias }}</li>
          </ul>

          <h2 class="wiki-section-title mt-6">Note operative</h2>
          <ul class="wiki-list">
            <li v-for="note in profile.notes" :key="note">{{ note }}</li>
          </ul>
        </v-sheet>
      </div>
    </v-container>
  </v-main>
</template>
