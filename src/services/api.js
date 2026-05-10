const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://tempus-fugit-caccia.s-letizi.workers.dev'

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  })

  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Richiesta API fallita.')
  }

  return payload
}

export function fetchRiddle() {
  return Promise.resolve({
    prompt:
      'Ti seguo sempre, ma non puoi toccarmi. Se arriva il buio, io sparisco. Chi sono?',
    inputLabel: 'Inserisci la risposta',
    submitLabel: 'Verifica risposta'
  })
}

export function verifyRiddleAnswer(answer) {
  return apiFetch('/validate-answer', {
    method: 'POST',
    body: JSON.stringify({ answer })
  })
}

export function searchInterpolProfile(query) {
  return apiFetch('/get-person-info', {
    method: 'POST',
    body: JSON.stringify({ name: query })
  })
}

export function fetchInterpolProfile(slug) {
  return apiFetch('/get-person-info', {
    method: 'POST',
    body: JSON.stringify({ name: slug })
  })
}
