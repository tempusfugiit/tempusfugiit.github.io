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
            <rect width="480" height="620" fill="#06140d" />
            <circle cx="240" cy="190" r="92" fill="#0f3b27" stroke="#6fffa3" stroke-opacity="0.4" stroke-width="2" />
            <path d="M124 514c18-92 73-139 116-139s98 47 116 139" fill="#0f3b27" stroke="#6fffa3" stroke-opacity="0.4" stroke-width="2" />
            <text x="240" y="582" text-anchor="middle" font-family="Consolas, monospace" font-size="42" fill="#7fffb0" letter-spacing="6">${nome.slice(0, 2).toUpperCase()}</text>
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
    <div class="dossier-backdrop" aria-hidden="true"></div>

    <v-container class="dossier-container py-6 py-md-10">
      <div class="dossier-topbar">
        <v-btn
          variant="text"
          rounded="0"
          class="back-button"
          @click="goBack"
        >
          ‹ Torna indietro
        </v-btn>
        <div class="dossier-classification">
          <span class="dossier-classification__dot" aria-hidden="true"></span>
          Documento riservato — Interpol
        </div>
      </div>

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
        class="dossier-panel mt-4 pa-4 pa-md-8"
        rounded="0"
        elevation="0"
      >
        <p class="dossier-loading">Decrittazione dossier in corso...</p>
      </v-sheet>

      <template v-else-if="profile">
        <v-sheet class="dossier-hero dossier-panel mt-4 pa-4 pa-md-8" rounded="0" elevation="0">
          <div class="dossier-grid">
            <div class="dossier-photo-frame">
              <span class="dossier-photo-tag">SOGGETTO</span>
              <img
                :src="profile.portrait"
                :alt="`Ritratto simulato di ${profile.displayName}`"
                class="dossier-photo"
              >
            </div>

            <div class="dossier-identity">
              <div class="dossier-kicker">Archivio internazionale ricercati</div>
              <h1 class="dossier-title">{{ profile.displayName }}</h1>
              <p class="dossier-codename">{{ profile.codename }}</p>

              <div class="dossier-status-badge">{{ profile.status }}</div>

              <dl class="dossier-infobox">
                <div class="dossier-infobox__row">
                  <dt>Organizzazione</dt>
                  <dd>{{ profile.organization }}</dd>
                </div>
                <div class="dossier-infobox__row">
                  <dt>Nazionalità</dt>
                  <dd>{{ profile.nationality }}</dd>
                </div>
                <div class="dossier-infobox__row">
                  <dt>Data di nascita</dt>
                  <dd>{{ profile.birthDate }}</dd>
                </div>
                <div v-if="profile.languages.length" class="dossier-infobox__row">
                  <dt>Lingue</dt>
                  <dd>{{ profile.languages.join(', ') }}</dd>
                </div>
                <div v-if="profile.aliases.length" class="dossier-infobox__row">
                  <dt>Alias noti</dt>
                  <dd>{{ profile.aliases.join(' · ') }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </v-sheet>

        <section class="dossier-section">
          <header class="dossier-section__head">
            <span class="dossier-section__index">01</span>
            <h2 class="dossier-section__title">Profilo operativo</h2>
          </header>
          <div class="dossier-section__body">
            <p
              v-for="(paragraph, index) in operationalParagraphs"
              :key="index"
              class="dossier-paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
        </section>

        <section v-if="profile.crimes.length" class="dossier-section">
          <header class="dossier-section__head">
            <span class="dossier-section__index">02</span>
            <h2 class="dossier-section__title">Crimini principali documentati</h2>
          </header>
          <div class="dossier-section__body">
            <article
              v-for="(crime, index) in profile.crimes"
              :key="index"
              class="dossier-entry"
            >
              <h3 class="dossier-entry__title">{{ crime.titolo }}</h3>
              <p class="dossier-paragraph">{{ crime.descrizione }}</p>
            </article>
          </div>
        </section>

        <section v-if="profile.behaviors" class="dossier-section">
          <header class="dossier-section__head">
            <span class="dossier-section__index">03</span>
            <h2 class="dossier-section__title">Comportamenti e abitudini</h2>
          </header>
          <div class="dossier-section__body">
            <p v-if="profile.behaviors.subject" class="dossier-section__subject">
              {{ profile.behaviors.subject }}
            </p>
            <article
              v-for="(behavior, index) in profile.behaviors.lista"
              :key="index"
              class="dossier-entry"
            >
              <h3 class="dossier-entry__title">{{ behavior.titolo }}</h3>
              <p class="dossier-paragraph">{{ behavior.descrizione }}</p>
            </article>
          </div>
        </section>

        <section v-if="profile.protocol" class="dossier-section dossier-section--alert">
          <header class="dossier-section__head">
            <span class="dossier-section__index">04</span>
            <h2 class="dossier-section__title">Protocollo di avvicinamento</h2>
          </header>
          <div class="dossier-section__body">
            <v-alert
              v-if="profile.protocol.avviso"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              {{ profile.protocol.avviso }}
            </v-alert>
            <p
              v-for="(paragraph, index) in protocolParagraphs"
              :key="index"
              class="dossier-paragraph"
            >
              {{ paragraph }}
            </p>
            <ul v-if="profile.protocol.requisiti?.length" class="dossier-list">
              <li v-for="req in profile.protocol.requisiti" :key="req">{{ req }}</li>
            </ul>
            <p v-if="profile.protocol.nota_finale" class="dossier-final-note">
              {{ profile.protocol.nota_finale }}
            </p>
          </div>
        </section>
      </template>
    </v-container>
  </v-main>
</template>
