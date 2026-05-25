import { Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!

const STORAGE_KEY = `sb-nwxkcmnzkguxmboigafr-auth-token`

export async function login(page: Page) {
  const email = process.env.TEST_EMAIL!

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Generate a magic link — bypasses captcha
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (linkError || !linkData?.properties?.hashed_token) {
    throw new Error(`generateLink failed: ${linkError?.message ?? 'no token'}`)
  }

  const hashedToken = linkData.properties.hashed_token

  // Exchange the hashed token for a real session via the REST API
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/verify?token=${hashedToken}&type=magiclink`,
    {
      method: 'GET',
      redirect: 'manual',
      headers: { apikey: SUPABASE_ANON_KEY },
    }
  )

  // Supabase redirects to the app URL with the session in the fragment (#access_token=...&refresh_token=...)
  const location = res.headers.get('location') ?? ''
  const fragment = location.includes('#') ? location.split('#')[1] : ''
  const params = new URLSearchParams(fragment)

  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  const expiresIn = parseInt(params.get('expires_in') ?? '3600', 10)

  if (!accessToken || !refreshToken) {
    throw new Error(`Could not extract tokens from redirect: ${location}`)
  }

  // Get user info
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const user = await userRes.json()

  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn

  // Navigate to app and inject session into localStorage
  await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' })
  await page.evaluate(
    ({ key, value }) => { localStorage.setItem(key, value) },
    {
      key: STORAGE_KEY,
      value: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        expires_in: expiresIn,
        token_type: 'bearer',
        user,
      }),
    }
  )

  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForURL('/', { timeout: 15_000 })
}
