<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchInterpolProfile } from '../services/api'

const route = useRoute()
const router = useRouter()
const profile = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

function splitParagraphs(text) {
  return (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

const operationalParagraphs = computed(() =>
  splitParagraphs(profile.value?.operationalProfile)
)

const protocolParagraphs = computed(() =>
  splitParagraphs(profile.value?.protocol?.descrizione)
)

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
    const anagrafica = person.dati_anagrafici ?? {}
    const nome = anagrafica.nome ?? 'Sconosciuto'

    profile.value = {
      displayName: nome,
      codename: person.ruolo ?? 'N/D',
      organization: person.organizzazione ?? 'N/D',
      status: person.stato ?? 'N/D',
      nationality: person.nazionalita ?? 'N/D',
      birthDate: anagrafica.data_nascita ?? 'N/D',
      languages: anagrafica.lingue ?? [],
      aliases: anagrafica.alias ?? [],
      operationalProfile: person.profilo_operativo ?? '',
      crimes: person.crimini_principali ?? [],
      behaviors: person.comportamenti ?? null,
      protocol: person.protocollo_avvicinamento ?? null,
      portrait:
        person.url_photo ||
        'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 620">
            <rect width="480" height="620" rx="36" fill="#1d3145" />
            <circle cx="240" cy="190" r="92" fill="#c9824a" opacity="0.92" />
            <path d="M124 514c18-92 73-139 116-139s98 47 116 139" fill="#c9824a" opacity="0.85" />
            <text x="240" y="582" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="white" letter-spacing="6">${nome.slice(0, 2).toUpperCase()}</text>
          </svg>
        `)
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

            <div class="wiki-infobox">
              <div><strong>Organizzazione:</strong> {{ profile.organization }}</div>
              <div><strong>Stato:</strong> {{ profile.status }}</div>
              <div><strong>Nazionalita:</strong> {{ profile.nationality }}</div>
              <div><strong>Data di nascita:</strong> {{ profile.birthDate }}</div>
              <div v-if="profile.languages.length">
                <strong>Lingue:</strong> {{ profile.languages.join(', ') }}
              </div>
            </div>
          </div>
        </div>
      </v-sheet>

      <div v-if="profile && !isLoading" class="wiki-columns mt-6">
        <v-sheet class="wiki-card pa-5 pa-md-6" rounded="xl" elevation="2">
          <h2 class="wiki-section-title">Profilo operativo</h2>
          <p
            v-for="(paragraph, index) in operationalParagraphs"
            :key="index"
            class="wiki-paragraph"
          >
            {{ paragraph }}
          </p>

          <template v-if="profile.crimes.length">
            <h2 class="wiki-section-title mt-6">Crimini principali documentati</h2>
            <div
              v-for="(crime, index) in profile.crimes"
              :key="index"
              class="wiki-entry"
            >
              <h3 class="wiki-entry-title">{{ crime.titolo }}</h3>
              <p class="wiki-paragraph">{{ crime.descrizione }}</p>
            </div>
          </template>
        </v-sheet>

        <v-sheet class="wiki-card pa-5 pa-md-6" rounded="xl" elevation="2">
          <h2 v-if="profile.aliases.length" class="wiki-section-title">Alias noti</h2>
          <ul v-if="profile.aliases.length" class="wiki-list">
            <li v-for="alias in profile.aliases" :key="alias">{{ alias }}</li>
          </ul>

          <template v-if="profile.behaviors">
            <h2 class="wiki-section-title mt-6">Comportamenti e abitudini</h2>
            <p v-if="profile.behaviors.subject" class="wiki-subtitle">
              {{ profile.behaviors.subject }}
            </p>
            <div
              v-for="(behavior, index) in profile.behaviors.lista"
              :key="index"
              class="wiki-entry"
            >
              <h3 class="wiki-entry-title">{{ behavior.titolo }}</h3>
              <p class="wiki-paragraph">{{ behavior.descrizione }}</p>
            </div>
          </template>

          <template v-if="profile.protocol">
            <h2 class="wiki-section-title mt-6">Protocollo di avvicinamento</h2>
            <v-alert
              v-if="profile.protocol.avviso"
              type="warning"
              variant="tonal"
              class="mb-3"
            >
              {{ profile.protocol.avviso }}
            </v-alert>
            <p
              v-for="(paragraph, index) in protocolParagraphs"
              :key="index"
              class="wiki-paragraph"
            >
              {{ paragraph }}
            </p>
            <ul v-if="profile.protocol.requisiti?.length" class="wiki-list">
              <li v-for="req in profile.protocol.requisiti" :key="req">{{ req }}</li>
            </ul>
            <p v-if="profile.protocol.nota_finale" class="wiki-paragraph">
              <strong>{{ profile.protocol.nota_finale }}</strong>
            </p>
          </template>
        </v-sheet>
      </div>
    </v-container>
  </v-main>
</template>
