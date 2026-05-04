const STORAGE_KEY = 'tempus-fugit-riddle-unlocked'

export function unlockSearch() {
  sessionStorage.setItem(STORAGE_KEY, 'true')
}

export function hasUnlockedSearch() {
  return sessionStorage.getItem(STORAGE_KEY) === 'true'
}
