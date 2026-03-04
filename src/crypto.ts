export function randomBase64Url(byteLength = 32): string {
  const buffer = new Uint8Array(byteLength)
  crypto.getRandomValues(buffer)
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function sha256Base64Url(plain: string): Promise<string> {
  const data = new TextEncoder().encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
