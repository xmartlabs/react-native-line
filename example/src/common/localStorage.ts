import { createMMKV, useMMKVString } from 'react-native-mmkv'

import { isWebPlatform } from './platform'

// ⚠️ WARNING: Never use a hardcoded encryption key in production.
const localStorage = isWebPlatform
  ? createMMKV({ id: 'default' })
  : createMMKV({ encryptionKey: 'your-encryption-key', id: 'default' })

export function getLocalStorageItem(key: string) {
  return localStorage.getString(key)
}

export function setLocalStorageItem(key: string, value: string) {
  return localStorage.set(key, value)
}

export function removeLocalStorageItem(key: string) {
  return localStorage.remove(key)
}

export const useSession = () => useMMKVString('accessToken', localStorage)
