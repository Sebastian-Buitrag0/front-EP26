import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Candidate {
  id: number
  name: string
  party: string
  photoUrl: string
  coalition?: string
  vicePresident?: string
}

export const useVoteStore = defineStore('vote', () => {
  const hasVoted = ref(false)
  const selectedCandidate = ref<Candidate | null>(null)
  const googleIdToken = ref<string | null>(null)

  function setGoogleToken(token: string) {
    googleIdToken.value = token
  }

  function selectCandidate(candidate: Candidate) {
    selectedCandidate.value = candidate
  }

  function markVoted() {
    hasVoted.value = true
    selectedCandidate.value = null
    googleIdToken.value = null
  }

  return { hasVoted, selectedCandidate, googleIdToken, setGoogleToken, selectCandidate, markVoted }
})
