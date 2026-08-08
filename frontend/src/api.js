const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '')

export const apiUrl = (path) => `${configuredApiUrl || ''}${path}`
