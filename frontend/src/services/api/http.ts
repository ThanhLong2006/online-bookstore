type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiError = {
  status: number
  message: string
  details?: unknown
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

function joinUrl(base: string, path: string) {
  if (!base) return path
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

async function parseJsonSafe(res: Response) {
  const text = await res.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiRequest<T>(
  path: string,
  opts?: {
    method?: HttpMethod
    query?: Record<string, string | number | boolean | undefined | null>
    body?: unknown
    token?: string
    signal?: AbortSignal
  },
): Promise<T> {
  const method = opts?.method ?? 'GET'
  const url = new URL(joinUrl(API_BASE_URL, path), window.location.origin)

  if (opts?.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined || v === null || v === '') continue
      url.searchParams.set(k, String(v))
    }
  }

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (opts?.token) headers.Authorization = `Bearer ${opts.token}`
  if (opts?.body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: opts?.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: opts?.signal,
  })

  if (!res.ok) {
    const payload = await parseJsonSafe(res)
    const message =
      (payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as any).message)
        : res.statusText) || 'Request failed'
    const err: ApiError = { status: res.status, message, details: payload }
    throw err
  }

  const data = (await parseJsonSafe(res)) as T
  return data
}

