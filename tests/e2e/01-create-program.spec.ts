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
      { query: 'lunge', sets: '3', reps: '10', weight: '40', rest: '90' },
    ],
  })

  // ── Sauvegarder ─────────────────────────────────────────────────────────
  // Blur any focused input so the save button receives a clean click
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.())
  const saveBtn = page.getByRole('button', { name: /Sauvegarder le programme/i })
  await expect(saveBtn).toBeVisible()
  await saveBtn.scrollIntoViewIfNeeded()
  await saveBtn.click()

  // Retour Home after save
  await page.waitForURL('/', { timeout: 20_000 })
  await page.waitForLoadState('networkidle')

  // Verify the program is on Home — day selector shows Lun with a session
  const lunBtn = page.getByRole('button', { name: /^Lun$/ }).first()
  await expect(lunBtn).toBeVisible({ timeout: 10_000 })
  await lunBtn.click()
  await expect(page.getByText('Push E2E')).toBeVisible({ timeout: 8_000 })
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

    // Locate the exercise name input for this card
    const nameInput = page.locator('input[placeholder="Nom de l\'exercice"]').nth(i)
    const firstSuggestion = page.locator('div.absolute.z-50 button[type="button"]').first()

    // Retry loop: exercises may still be loading from Supabase on first attempt.
    // fill('') clears the React-controlled value; pressSequentially fires per-char input events.
    for (let attempt = 0; attempt < 5; attempt++) {
      await nameInput.fill('')
      await nameInput.pressSequentially(ex.query, { delay: 80 })
      const visible = await firstSuggestion.isVisible({ timeout: 2_500 }).catch(() => false)
      if (visible) break
      await page.waitForTimeout(1_000)
    }

    await expect(firstSuggestion).toBeVisible({ timeout: 6_000 })

    // Component uses onMouseDown with e.preventDefault() — standard .click() won't work
    await firstSuggestion.dispatchEvent('mousedown')
    await expect(firstSuggestion).not.toBeVisible({ timeout: 3_000 }).catch(() => {})

    // Number inputs in order: Séries, Reps, Poids, Repos
    const numInputs = card.locator('input[type="number"]')
    await numInputs.nth(0).fill(ex.sets)
    await numInputs.nth(1).fill(ex.reps)
    await numInputs.nth(2).fill(ex.weight)
    await numInputs.nth(3).fill(ex.rest)
  }
}
