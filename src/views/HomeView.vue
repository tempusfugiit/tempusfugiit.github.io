<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { unlockSearch } from '../stores/riddle'
import { fetchRiddle, verifyRiddleAnswer } from '../services/api'

const router = useRouter()
const answer = ref('')
const errorMessage = ref('')
const loadError = ref('')
const isSubmitting = ref(false)
const isLoading = ref(true)
const riddle = ref(null)
const matrixColumns = [
  '01001101 10110010 00110101 11001010 01101001',
  '7F 2A 91 C3 4D 88 1E 73 5B',
  'while(true){seek();decode();trace();}',
  'ombra://node/17 access=denied retry=true',
  '101001 001110 111000 010101 011011',
  'alpha beta gamma delta epsilon zeta',
  'cache_miss::archive_lookup::shadow_key',
  'A9F2 44BC 19D0 8E11 C7A0 3F2B',
  'if(light===0){shadow=null}else{return clue}',
  'north_port archive dock_07 manifest hidden'
]

async function loadRiddle() {
  isLoading.value = true
  loadError.value = ''

  try {
    riddle.value = await fetchRiddle()
  } catch (error) {
    loadError.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function submitAnswer() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await verifyRiddleAnswer(answer.value)

    if (result.correct) {
      unlockSearch()
      router.push({ name: 'interpol' })
      return
    }

    errorMessage.value =
      result.errorMessage ?? 'Risposta errata. Rileggi l indovinello e riprova.'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadRiddle)
</script>

<template>
  <v-main class="home-shell">
    <div class="home-backdrop"></div>
    <div class="matrix-rain" aria-hidden="true">
      <span
        v-for="(column, index) in matrixColumns"
        :key="`${column}-${index}`"
        class="matrix-column"
        :style="{
          '--column-index': index,
          '--column-duration': `${12 + (index % 5) * 2}s`,
          '--column-delay': `${index * -1.4}s`
        }"
      >
        {{ column }}
      </span>
    </div>

    <v-container class="fill-height d-flex align-center justify-center">
      <v-sheet class="riddle-card pa-6 pa-md-10" rounded="xl" elevation="10">
        <div class="terminal-bar">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="eyebrow">Accesso iniziale</div>
        <h1 class="page-title">Risolvi l’indovinello</h1>
        <p v-if="isLoading" class="riddle-text">Caricamento indovinello...</p>
        <p v-else class="riddle-text">{{ riddle?.prompt }}</p>

        <v-alert
          v-if="loadError"
          type="error"
          variant="tonal"
          class="mt-4"
        >
          {{ loadError }}
        </v-alert>

        <v-text-field
          v-model="answer"
          :label="riddle?.inputLabel ?? 'Inserisci la risposta'"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="mt-6"
          :disabled="isLoading || Boolean(loadError)"
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
            :disabled="isLoading || Boolean(loadError)"
            @click="submitAnswer"
          >
            {{ riddle?.submitLabel ?? 'Verifica risposta' }}
          </v-btn>
        </div>
      </v-sheet>
    </v-container>
  </v-main>
</template>
