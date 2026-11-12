import { createContext, useContext } from 'react'

// TEMPORAL (capturas): Alt+Shift+L fuerza el estado Loading en botones y campos
export const CaptureLoadingContext = createContext(false)

export function useCaptureLoading(loading = false) {
  return useContext(CaptureLoadingContext) || loading
}
