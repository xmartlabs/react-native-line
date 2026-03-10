import { createMMKV, useMMKVString } from 'react-native-mmkv'

import { isWebPlatform } from './platform'

// ⚠️ WARNING: Never use a hardcoded encryption key in production.
const storage = isWebPlatform
  ? createMMKV({ id: 'default' })
  : createMMKV({ encryptionKey: 'your-encryption-key', id: 'default' })

export function getLocalStorageItem(key: string) {
  return storage.getString(key)
}

export function setLocalStorageItem(key: string, value: string) {
  return storage.set(key, value)
}

export function removeLocalStorageItem(key: string) {
  return storage.remove(key)
}

export const useSession = () => useMMKVString('accessToken', storage)
