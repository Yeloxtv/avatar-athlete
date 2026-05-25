import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'
import { cleanupTestData } from './helpers/cleanup'

const TEST_EMAIL = process.env.TEST_EMAIL!

// Depends on 01-create-program having run — program "Test PPL E2E" must exist

test.afterAll(async () => {
  await cleanupTestData(TEST_EMAIL)
})

test('éditer un programme existant (renommer + ajouter un jour)', async ({ page }) => {
  await login(page)

  // Home — bouton "Modifier mon programme"
  await expect(page.getByText('Modifier mon programme')).toBeVisible({ timeout: 10_000 })
  await page.getByText('Modifier mon programme').click()

  await page.waitForURL('/my-program')

  // ── Étape 1 : nom pré-rempli ─────────────────────────────────────────────
  const progInput = page.locator('input[id="prog-name"]')
  await expect(progInput).toBeVisible()
  await expect(progInput).toHaveValue('Test PPL E2E')

  // Renommer
  await progInput.clear()
  await progInput.fill('Test PPL E2E v2')
  await page.getByRole('button', { name: /Suivant/i }).click()

  // ── Étape 2 : Lun/Mer/Ven déjà sélectionnés ─────────────────────────────
  await expect(page.getByText('3 jours sélectionnés')).toBeVisible()

  // Ajouter Samedi
  await page.getByRole('button', { name: 'Sam', exact: true }).click()
  await expect(page.getByText('4 jours sélectionnés')).toBeVisible()
  await page.getByRole('button', { name: /Suivant/i }).click()

  // ── Étape 3 : aller sur Samedi (nouveau jour) ────────────────────────────
  // Les onglets de jours dans step3 — cliquer Sam
  await page.locator('button[type="button"]').filter({ hasText: /^Sam$/ }).click()

  // Remplir la séance Samedi
  const sessionInput = page.locator('input[placeholder="Ex : Dos/Biceps, Push, Full Body…"]').first()
  await expect(sessionInput).toBeVisible({ timeout: 5_000 })
  await sessionInput.clear()
  await sessionInput.fill('Full Body E2E')

  // Exercice 1 est déjà présent — le remplir
  const card = page.locator('div.rounded-xl.border').filter({ hasText: 'Exercice 1' }).first()
  await expect(card).toBeVisible({ timeout: 5_000 })

  const nameInput = card.locator('input[placeholder="Nom de l\'exercice"]')
  await nameInput.click()
  await nameInput.press('Control+a')
  await nameInput.press('Backspace')
  const firstSuggestion = page.locator('div.absolute.z-50 button[type="button"]').first()
  for (let attempt = 0; attempt < 3; attempt++) {
    await nameInput.pressSequentially('squat', { delay: 80 })
    const visible = await firstSuggestion.isVisible({ timeout: 3_000 }).catch(() => false)
    if (visible) break
    await nameInput.press('Control+a')
    await nameInput.press('Backspace')
    await page.waitForTimeout(1_000)
  }
  await expect(firstSuggestion).toBeVisible({ timeout: 5_000 })
  await page.evaluate(() => {
    const btn = document.querySelector('div.absolute.z-50 button') as HTMLElement | null
    btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  })
  await expect(firstSuggestion).not.toBeVisible({ timeout: 3_000 }).catch(() => {})

  // Remplir les inputs
  const numInputs = card.locator('input[type="number"]')
  await numInputs.nth(0).fill('3')  // sets
  await numInputs.nth(1).fill('10') // reps
  await numInputs.nth(2).fill('60') // weight
  await numInputs.nth(3).fill('90') // rest

  // ── Sauvegarder ─────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /Sauvegarder le programme/i }).click()

  // Toast confirmation mise à jour (peut être "Programme créé" ou "Programme mis à jour" selon l'implémentation)
  await expect(page.getByText(/Programme (créé|mis à jour)/i)).toBeVisible({ timeout: 15_000 })

  // Retour Home — vérifier que Samedi est maintenant présent
  await page.waitForURL('/', { timeout: 10_000 })

  // Samedi doit apparaître dans le sélecteur de jours comme ayant une session
  await page.locator('button').filter({ hasText: /^Sam$/ }).first().click()
  await expect(page.getByText('Full Body E2E')).toBeVisible({ timeout: 8_000 })
})
