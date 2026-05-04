<script setup>
import { ref } from 'vue'

const query = ref('')
const hasSearched = ref(false)

function runSearch() {
  hasSearched.value = true
}
</script>

<template>
  <v-main class="search-shell">
    <v-container class="py-8">
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
            @keyup.enter="runSearch"
          />

          <v-btn
            color="primary"
            size="x-large"
            rounded="pill"
            class="search-action"
            @click="runSearch"
          >
            Avvia ricerca
          </v-btn>
        </div>

        <v-sheet
          v-if="hasSearched"
          class="results-box mt-6 pa-5"
          rounded="lg"
          color="secondary"
        >
          <div class="results-label">Risultato simulato</div>
          <h2 class="results-title">
            Archivio in consultazione: "{{ query || 'nessun termine inserito' }}"
          </h2>
          <p class="results-copy">
            Questa schermata replica il comportamento visivo di un motore di
            ricerca. Il passo successivo può essere il collegamento a risultati
            reali o ad altri step della caccia al tesoro.
          </p>
        </v-sheet>
      </v-sheet>
    </v-container>
  </v-main>
</template>
