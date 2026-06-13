const STORAGE_KEY = 'tempus-fugit-profile-access'

function normalize(slug) {
  return String(slug ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

function readUnlocked() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

// Sblocca l'accesso al dossier per uno slug: chiamato dalla pagina di ricerca
// quando la ricerca va a buon fine.
export function grantProfileAccess(slug) {
  const unlocked = readUnlocked()
  unlocked.add(normalize(slug))
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]))
}

// Verifica se il dossier per quello slug è stato sbloccato tramite ricerca.
export function canAccessProfile(slug) {
  return readUnlocked().has(normalize(slug))
}
