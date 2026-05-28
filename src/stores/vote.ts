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

const VOTED_KEY = 'ep26_voted'

export const useVoteStore = defineStore('vote', () => {
  const hasVoted = ref(localStorage.getItem(VOTED_KEY) === '1')

  function markVoted() {
    hasVoted.value = true
    localStorage.setItem(VOTED_KEY, '1')
  }

  return { hasVoted, markVoted }
})
