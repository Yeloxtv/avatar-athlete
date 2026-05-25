import { test, expect } from '@playwright/test'
import { login } from './helpers/auth'

// Depends on 01-create-program having run — program with Push E2E on Monday must exist

test('compléter une séance de musculation complète (Lundi — Push E2E)', async ({ page }) => {
  await login(page)

  // Home — sélectionner Lundi et lancer la séance
  await expect(page.locator('button').filter({ hasText: /^Lun$/ }).first()).toBeVisible({ timeout: 10_000 })
  await page.locator('button').filter({ hasText: /^Lun$/ }).first().click()

  // La card séance "Push E2E" doit être visible
  await expect(page.getByText('Push E2E')).toBeVisible({ timeout: 8_000 })
  await expect(page.getByText('⚔️ Lancer la séance')).toBeVisible()
  await page.getByText('⚔️ Lancer la séance').click()

  // Attendre le chargement de la page /train/:id
  await page.waitForURL(/\/train\//, { timeout: 15_000 })

  // Attendre que la session Supabase soit créée (spinner "Préparation de la séance..." disparaît)
  await expect(page.getByText(/Préparation de la séance/i)).not.toBeVisible({ timeout: 20_000 })

  // La saisie de performance doit être visible
  await expect(page.getByRole('button', { name: /Valider la série/i })).toBeVisible({ timeout: 10_000 })

  // Boucle : valider toutes les séries de tous les exercices
  const maxIterations = 60
  let iterations = 0

  while (iterations < maxIterations) {
    iterations++

    if (await page.getByText('Entraînement terminé !').isVisible()) break

    // Phase repos — attendre la stabilité puis cliquer "Passer"
    if (await page.getByRole('button', { name: /^Passer$/i }).isVisible({ timeout: 500 }).catch(() => false)) {
      // Attendre que le bouton soit stable (la phase de repos rend l'UI stable)
      await page.getByRole('button', { name: /^Passer$/i }).waitFor({ state: 'visible' })
      await page.getByRole('button', { name: /^Passer$/i }).click()
      // Laisser la transition React se stabiliser
      await page.waitForFunction(
        () => !document.querySelector('[data-component-file="RestPhase.tsx"]'),
        { timeout: 3_000 }
      ).catch(() => {})
      continue
    }

    // Phase exercice — attendre que "Valider la série" soit stable avant de cliquer
    const validateVisible = await page.getByRole('button', { name: /Valider la série/i })
      .isVisible({ timeout: 2_000 }).catch(() => false)
    if (validateVisible) {
      // Attendre l'état stable : bouton visible ET enabled ET stable dans le DOM
      await page.waitForFunction(
        () => {
          const btns = Array.from(document.querySelectorAll('button'))
          const btn = btns.find(b => b.textContent?.trim() === 'Valider la série')
          return btn && !btn.disabled && btn.isConnected
        },
        { timeout: 5_000 }
      ).catch(() => {})
      // Utiliser dispatchEvent pour éviter le problème de stabilité DOM
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'))
        const btn = btns.find(b => b.textContent?.trim() === 'Valider la série') as HTMLButtonElement | undefined
        btn?.click()
      })
      // Attendre que la transition vers repos ou exercice suivant commence
      await page.waitForTimeout(300)
      continue
    }

    await page.waitForTimeout(500)
  }

  // "Entraînement terminé !" + bouton "Terminer la séance"
  await expect(page.getByText('Entraînement terminé !')).toBeVisible({ timeout: 10_000 })
  await page.getByRole('button', { name: /Terminer la séance/i }).click()

  // Dialog résumé séance — bouton "Valider la séance"
  await expect(page.getByRole('button', { name: /Valider la séance/i })).toBeVisible({ timeout: 5_000 })
  await page.getByRole('button', { name: /Valider la séance/i }).click()

  // Modal récompenses — attendre et cliquer "Retourner à la campagne"
  await page.getByRole('button', { name: /Retourner à la campagne/i }).waitFor({ state: 'visible', timeout: 10_000 })
  await page.getByRole('button', { name: /Retourner à la campagne/i }).click()

  // Retour sur Home (hard navigation via window.location.href)
  await page.waitForURL('/', { timeout: 20_000 })
})
