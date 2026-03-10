function bytesToBase64Url(bytes: Uint8Array): string {
  return btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function randomBase64Url(byteLength = 32): string {
  const buffer = new Uint8Array(byteLength)
  crypto.getRandomValues(buffer)
  return bytesToBase64Url(buffer)
}

export async function sha256Base64Url(plain: string): Promise<string> {
  const data = new TextEncoder().encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return bytesToBase64Url(new Uint8Array(hash))
}
