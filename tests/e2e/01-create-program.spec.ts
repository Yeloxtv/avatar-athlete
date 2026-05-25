import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'
import { cleanupTestData } from './helpers/cleanup'

const TEST_EMAIL = process.env.TEST_EMAIL!

// Cleanup before so tests 02 and 03 can use the program created here
test.beforeAll(async () => {
  await cleanupTestData(TEST_EMAIL)
})

test('créer un programme PPL complet depuis le wizard', async ({ page }) => {
  await login(page)

  // Home — bouton créer programme
  await expect(page.getByText('Créer mon programme')).toBeVisible({ timeout: 10_000 })
  await page.getByText('Créer mon programme').click()

  await page.waitForURL('/my-program')

  // ── Étape 1 : nom du programme ──────────────────────────────────────────
  const progInput = page.locator('input[id="prog-name"]')
  await expect(progInput).toBeVisible()
  await progInput.fill('Test PPL E2E')
  await page.getByRole('button', { name: /Suivant/i }).click()

  // ── Étape 2 : jours ─────────────────────────────────────────────────────
  // Day buttons in step 2 are inside the days grid
  await page.getByRole('button', { name: 'Lun', exact: true }).click()
  await page.getByRole('button', { name: 'Mer', exact: true }).click()
  await page.getByRole('button', { name: 'Ven', exact: true }).click()
  await expect(page.getByText('3 jours sélectionnés')).toBeVisible()
  await page.getByRole('button', { name: /Suivant/i }).click()

  // ── Étape 3 : séances ───────────────────────────────────────────────────
  // Lundi is active by default (first selected day)
  await fillSession(page, {
    sessionName: 'Push E2E',
    exercises: [
      { query: 'bench', sets: '3', reps: '8', weight: '60', rest: '90' },
      { query: 'tricep', sets: '3', reps: '12', weight: '20', rest: '60' },
    ],
  })

  // Switch to Mercredi tab (inside step 3 day tabs)
  await page.locator('button[type="button"]').filter({ hasText: /^Mer$/ }).click()
  await fillSession(page, {
    sessionName: 'Pull E2E',
    exercises: [
      { query: 'pull', sets: '4', reps: '8', weight: '0', rest: '90' },
      { query: 'curl', sets: '3', reps: '12', weight: '15', rest: '60' },
    ],
  })

  // Switch to Vendredi tab
  await page.locator('button[type="button"]').filter({ hasText: /^Ven$/ }).click()
  await fillSession(page, {
    sessionName: 'Legs E2E',
    exercises: [
      { query: 'squat', sets: '4', reps: '6', weight: '80', rest: '120' },
      { query: 'leg press', sets: '3', reps: '10', weight: '100', rest: '90' },
    ],
  })

  // ── Sauvegarder ─────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /Sauvegarder le programme/i }).click()

  // Toast confirmation
  await expect(page.getByText(/Programme créé/i)).toBeVisible({ timeout: 15_000 })

  // Retour Home — vérifier que le programme est présent
  await page.waitForURL('/', { timeout: 10_000 })
  await page.locator('button[type="button"]').filter({ hasText: /^Lun$/ }).first().click()
  await expect(page.getByText('Push E2E')).toBeVisible()
  await expect(page.getByText(/Lancer la séance/i)).toBeVisible()
})

// ── Helper : remplir une SessionCard ──────────────────────────────────────

type ExerciseData = {
  query: string
  sets: string
  reps: string
  weight: string
  rest: string
}

async function fillSession(
  page: import('@playwright/test').Page,
  { sessionName, exercises }: { sessionName: string; exercises: ExerciseData[] }
) {
  // Nom de la séance — placeholder exact from MyProgram.tsx
  const sessionInput = page.locator('input[placeholder="Ex : Dos/Biceps, Push, Full Body…"]').first()
  await expect(sessionInput).toBeVisible({ timeout: 5_000 })
  await sessionInput.clear()
  await sessionInput.fill(sessionName)

  for (let i = 0; i < exercises.length; i++) {
    if (i > 0) {
      await page.getByRole('button', { name: /Ajouter un exercice/i }).first().click()
    }

    const ex = exercises[i]

    // Find the exercise card by its "Exercice N" label
    const cardLabel = `Exercice ${i + 1}`
    const card = page.locator('div.rounded-xl.border').filter({ hasText: cardLabel }).first()
    await expect(card).toBeVisible({ timeout: 5_000 })

    // Get the nth exercise name input on the page (index matches exercise index)
    const nameInput = page.locator('input[placeholder="Nom de l\'exercice"]').nth(i)
    // Focus + clear via JS to avoid any DnD interference
    await nameInput.evaluate((el: HTMLInputElement) => { el.focus(); el.value = '' })
    // Wait for exercises to be loaded — retry typing until dropdown appears
    const firstSuggestion = page.locator('div.absolute.z-50 button[type="button"]').first()
    for (let attempt = 0; attempt < 4; attempt++) {
      await nameInput.pressSequentially(ex.query, { delay: 60 })
      const visible = await firstSuggestion.isVisible({ timeout: 2_000 }).catch(() => false)
      if (visible) break
      // Clear and retry — exercises may not be loaded yet
      await nameInput.evaluate((el: HTMLInputElement) => { el.focus(); el.value = '' })
      await page.waitForTimeout(800)
    }
    await expect(firstSuggestion).toBeVisible({ timeout: 5_000 })
    // Dispatch mousedown — component uses onMouseDown with e.preventDefault()
    await page.evaluate(() => {
      const btn = document.querySelector('div.absolute.z-50 button') as HTMLElement | null
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    })
    await expect(firstSuggestion).not.toBeVisible({ timeout: 3_000 }).catch(() => {})

    // Number inputs in order: Séries, Reps, Poids, Repos
    const numInputs = card.locator('input[type="number"]')
    await numInputs.nth(0).fill(ex.sets)
    await numInputs.nth(1).fill(ex.reps)
    await numInputs.nth(2).fill(ex.weight)
    await numInputs.nth(3).fill(ex.rest)
  }
}
