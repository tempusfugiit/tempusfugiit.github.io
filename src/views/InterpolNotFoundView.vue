<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchedName = computed(() => route.query.q ?? 'Sconosciuto')

function goBack() {
  router.push({ name: 'interpol' })
}
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

      <v-sheet class="not-found-card mt-4 pa-6 pa-md-10" rounded="xl" elevation="6">
        <div class="wiki-kicker">Archivio internazionale</div>
        <h1 class="wiki-title">Not Found</h1>
        <p class="wiki-summary">
          Nessun dossier corrisponde alla ricerca per "{{ searchedName }}".
        </p>
        <p class="wiki-paragraph">
          Controlla il nome inserito oppure torna alla schermata precedente per
          avviare una nuova interrogazione dell archivio.
        </p>
      </v-sheet>
    </v-container>
  </v-main>
</template>
