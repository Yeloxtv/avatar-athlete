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

  // La session démarre automatiquement — attendre l'interface muscu
  // Le bouton "Valider la série" doit être visible dans StrengthPerformanceInput
  await expect(page.getByRole('button', { name: /Valider la série/i })).toBeVisible({ timeout: 15_000 })

  // Boucle : valider toutes les séries de tous les exercices
  // On continue tant que le bouton "Valider la série" ou "Passer" (repos) est visible
  // et qu'on n'a pas atteint l'écran de fin ("Entraînement terminé !")
  const maxIterations = 50 // sécurité anti-boucle infinie
  let iterations = 0

  while (iterations < maxIterations) {
    iterations++

    const isComplete = await page.getByText('Entraînement terminé !').isVisible()
    if (isComplete) break

    // Phase repos — bouton "Passer"
    const skipBtn = page.getByRole('button', { name: /^Passer$/i })
    if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await skipBtn.click()
      continue
    }

    // Phase exercice — bouton "Valider la série"
    const validateBtn = page.getByRole('button', { name: /Valider la série/i })
    if (await validateBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const isDisabled = await validateBtn.isDisabled()
      if (!isDisabled) {
        await validateBtn.click()
      } else {
        // Attendre que le bouton soit actif
        await page.waitForFunction(
          () => {
            const btn = document.querySelector('button:not([disabled])') as HTMLButtonElement | null
            return btn?.textContent?.includes('Valider la série') ?? false
          },
          { timeout: 5_000 }
        ).catch(() => {})
        await validateBtn.click().catch(() => {})
      }
      continue
    }

    // Ni repos ni valider visible — attendre un peu
    await page.waitForTimeout(500)
  }

  // Vérifier qu'on est sur l'écran de fin
  await expect(page.getByText('Entraînement terminé !')).toBeVisible({ timeout: 10_000 })

  // Cliquer "Terminer la séance"
  await page.getByRole('button', { name: /Terminer la séance/i }).click()

  // Possibilité de dialog finisher — si présent, passer
  const finisherDialog = page.getByText('Finisher disponible')
  if (await finisherDialog.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await page.getByRole('button', { name: /Passer, aller au résumé/i }).click()
  }

  // Attendre la page résumé
  await page.waitForURL(/\/training\/.*\/summary/, { timeout: 15_000 })

  // La page résumé doit afficher "Mission accomplie"
  await expect(page.getByText('Mission accomplie')).toBeVisible({ timeout: 15_000 })

  // XP affiché (le +0 peut apparaître pendant le chargement, on attend un vrai résultat)
  // Le texte +{xp} doit être présent dans la section XP
  await expect(page.getByText(/^\+\d+$/).first()).toBeVisible({ timeout: 10_000 })

  // Valider l'entraînement — "Récolter les récompenses"
  await expect(page.getByRole('button', { name: /Récolter les récompenses/i })).toBeVisible({ timeout: 5_000 })
  await page.getByRole('button', { name: /Récolter les récompenses/i }).click()

  // Modal WorkoutRewards — bouton "Retourner à la campagne" ou retour automatique sur Home
  const returnBtn = page.getByRole('button', { name: /Retourner à la campagne/i })
  if (await returnBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await returnBtn.click()
  }

  // Retour sur Home
  await page.waitForURL('/', { timeout: 15_000 })
})
