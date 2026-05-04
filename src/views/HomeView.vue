<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { unlockSearch } from '../stores/riddle'

const router = useRouter()
const answer = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const expectedAnswer = 'ombra'

function normalize(value) {
  return value.trim().toLowerCase()
}

function submitAnswer() {
  isSubmitting.value = true

  if (normalize(answer.value) === expectedAnswer) {
    errorMessage.value = ''
    unlockSearch()
    router.push({ name: 'interpol' })
    return
  }

  errorMessage.value = 'Risposta errata. Rileggi l’indovinello e riprova.'
  isSubmitting.value = false
}
</script>

<template>
  <v-main class="home-shell">
    <div class="home-backdrop"></div>

    <v-container class="fill-height d-flex align-center justify-center">
      <v-sheet class="riddle-card pa-6 pa-md-10" rounded="xl" elevation="10">
        <div class="eyebrow">Accesso iniziale</div>
        <h1 class="page-title">Risolvi l’indovinello</h1>
        <p class="riddle-text">
          Ti seguo sempre, ma non puoi toccarmi. Se arriva il buio, io sparisco.
          Chi sono?
        </p>

        <v-text-field
          v-model="answer"
          label="Inserisci la risposta"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="mt-6"
          @keyup.enter="submitAnswer"
        />

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mt-4"
        >
          {{ errorMessage }}
        </v-alert>

        <div class="mt-6 d-flex justify-end">
          <v-btn
            color="primary"
            size="large"
            :loading="isSubmitting"
            @click="submitAnswer"
          >
            Verifica risposta
          </v-btn>
        </div>
      </v-sheet>
    </v-container>
  </v-main>
</template>
