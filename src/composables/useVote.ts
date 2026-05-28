import axios from 'axios'
import { useDeviceId } from './useDeviceId'

const API_URL = import.meta.env.VITE_API_URL ?? ''
const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''

declare const grecaptcha: {
  execute(siteKey: string, options: { action: string }): Promise<string>
}

export interface VoteResponse {
  message: string
  isHonorary: boolean
}

export async function submitVote(
  idToken: string,
  candidatoId: number,
  birthDate: string
): Promise<VoteResponse> {
  const deviceId = useDeviceId()
  const recaptchaToken = await grecaptcha.execute(RECAPTCHA_KEY, { action: 'vote' })

  const { data } = await axios.post<VoteResponse>(`${API_URL}/api/votes`, {
    idToken,
    candidatoId,
    deviceId,
    recaptchaToken,
    birthDate
  })
  return data
}
