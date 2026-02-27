import { createMMKV, useMMKVString } from 'react-native-mmkv'

const localStorage = createMMKV({
  encryptionKey: 'your-encryption-key',
  id: 'default',
})

export function getLocalStorageItem(key: string) {
  return localStorage.getString(key)
}

export function setLocalStorageItem(key: string, value: string) {
  return localStorage.set(key, value)
}

export function removeLocalStorageItem(key: string) {
  return localStorage.remove(key)
}

export const useListenLocalStorage = (key: string) =>
  useMMKVString(key, localStorage)
