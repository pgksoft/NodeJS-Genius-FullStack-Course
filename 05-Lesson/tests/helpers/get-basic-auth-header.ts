import { Buffer } from 'buffer'

export const getBasicAuthHeader = (email: string, password: string) => {
  const credentials = Buffer.from(`${email}:${password}`).toString('base64')
  return `Basic ${credentials}`
}
