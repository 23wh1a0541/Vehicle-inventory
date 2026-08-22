const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export async function api(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (response.status === 204) return null
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail ?? 'Something went wrong. Please try again.')
  return data
}
