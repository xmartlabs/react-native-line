import { createMMKV, useMMKVString } from 'react-native-mmkv'

import { isWebPlatform } from '@/constants/platform'

// ⚠️ WARNING: Never use a hardcoded encryption key in production.
const storage = isWebPlatform
  ? createMMKV({ id: 'default' })
  : createMMKV({ encryptionKey: 'your-encryption-key', id: 'default' })

/* *************************** */
/* *     Helper Functions    * */
/* *************************** */

export function getLocalStorageItem(key: string): string | undefined {
  return storage.getString(key)
}

export function setLocalStorageItem(key: string, value: string): void {
  return storage.set(key, value)
}

export function removeLocalStorageItem(key: string): boolean {
  return storage.remove(key)
}

/* *************************** */
/* *          Hooks          * */
/* *************************** */

export const useSession = () => useMMKVString('accessToken', storage)
