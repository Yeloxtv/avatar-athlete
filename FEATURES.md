# État des features — PlayAndTrain
> Dernière mise à jour : 2026-05-14

---

## 🔐 Authentification
- [x] Inscription / Connexion email + mot de passe
- [x] hCaptcha sur le formulaire d'auth (anti-bot)
- [x] Session persistante (Supabase Auth)
- [x] RLS actif sur toutes les tables

---

## 👤 Profil utilisateur
- [x] Pseudo + emoji avatar
- [x] Niveau RPG calculé depuis XP total (système de paliers)
- [x] 4 stats RPG : Force / Endurance / Agilité / Mental
- [x] Barre XP avec progression vers le niveau suivant
- [x] Titre de rang selon le niveau (Recrue → Titan)
- [x] Spécialité dominante affichée (stat la plus haute)
- [x] Streak hebdomadaire affiché sur le profil
- [x] Section badges récents (8 derniers)
- [x] Changement de mode d'entraînement (Guidé ↔ Autonome) depuis le profil
- [ ] Édition du pseudo / avatar depuis l'app (lecture seule actuellement)
- [ ] Photo de profil

---

## 🎯 Onboarding
- [x] Écran de choix de voie au 1er lancement (mode Guidé vs Autonome)
- [x] Sauvegarde du mode en base (`profiles.user_mode`)
- [ ] Onboarding complet : saisie du pseudo + avatar lors de l'inscription

---

## 🏠 Home
### Mode Guidé (débutants)
- [x] Widget profil avec XP, stats, streak semaine
- [x] Quête quotidienne avec progression et bonus XP
- [x] Liste des campagnes publiques avec progression
- [ ] Quête quotidienne dynamique et pertinente (en standby — logique à affiner)

### Mode Autonome (intermédiaires/avancés)
- [x] Widget profil avec XP, stats, streak semaine
- [x] Vue semaine-type avec sélecteur de jour
- [x] Card de séance du jour avec bouton "Lancer la séance"
- [x] Jour de repos affiché si aucune séance ce jour
- [x] Bouton "Modifier mon programme" visible
- [x] Bouton "Créer mon programme" si aucun programme existant

---

## 📋 Programme perso (mode Autonome)
- [x] Wizard mobile-first en 3 étapes (Nom → Jours → Séances)
- [x] Sélection des jours actifs de la semaine
- [x] Création de séances par jour (nom + exercices)
- [x] Champs exercice : Nom + Séries + Reps + Poids cible + Repos
- [x] Mode édition : chargement du programme existant et pré-remplissage
- [x] Suppression des séances désactivées lors de l'édition
- [x] Sauvegarde en base (campaigns + quests + quest_exercises)
- [ ] Réorganisation des exercices par drag & drop
- [ ] Duplication d'une séance sur plusieurs jours
- [ ] Gestion de plusieurs programmes (ex : cycles de 3 mois)
- [ ] Autocomplete depuis la bibliothèque d'exercices

---

## 🗺️ Campagnes & Quêtes (mode Guidé)
- [x] Campagnes publiques créées via Dashboard admin
- [x] Quêtes qui se débloquent linéairement (ordre + statut locked/available/completed)
- [x] QuestCard avec statut visuel, XP, durée, équipements
- [x] Quêtes "Boss" visuellement distinctes
- [x] Reset d'une campagne (recommencer depuis le début)
- [x] Calcul de progression par campagne (X/Y quêtes complétées)
- [ ] Campagnes filtrables par niveau / équipement
- [ ] Recommandation de campagne selon le profil

---

## ⚔️ Entraînement — Interface HIIT / Cardio
- [x] Timer de workout avec démarrage en 3s countdown
- [x] Gestion des rounds (ajouter un round)
- [x] Chrono general + temps par round
- [x] Bouton pause / reset
- [x] Finalisation et navigation vers le récapitulatif
- [ ] Modes EMOM / Tabata / AMRAP avec timers dédiés

---

## 🏋️ Entraînement — Interface Musculation
- [x] Exercices chargés depuis la quête
- [x] Saisie des reps + poids par série
- [x] Indicateurs de séries (dots animés)
- [x] Timer de repos circulaire avec skip / +30s / -30s
- [x] Barre de progression globale de la séance (séries complétées)
- [x] Affichage des performances précédentes (dernière session même exercice)
- [x] Détection de PR (Personal Record) avec flash visuel
- [x] XP live discret (barre de progression sous le titre)
- [x] Feedback micro-récompense (vibration + son) à chaque série
- [x] Bouton "Voir la séance" (drawer liste complète des exercices)
- [x] Remplacement d'exercice (SubstituteDrawer, filtré par groupe musculaire)
- [x] Bouton "Arrêter" avec confirmation et sauvegarde même si session incomplète
- [x] Restauration de l'état si retour en arrière (exercice en cours + chrono)
- [x] Sauvegarde automatique du chrono toutes les 30s
- [ ] Supersets
- [ ] Mode Dégressif / Pyramidal
- [ ] Notes par exercice pendant la séance

---

## 📊 Live Workout Bar
- [x] Mini-player fixe en bas (au-dessus de la TabBar) quand une séance est en cours
- [x] Affiche : exercice en cours + progression + indicateur "LIVE"
- [x] Tap → retour direct à la séance en cours
- [x] Disparaît à la fin de la séance

---

## 🏆 Récapitulatif de séance (SessionSummary)
- [x] XP gagné avec animation count-up
- [x] Détection de level-up avec animation
- [x] Breakdown des stats gagnées (Force / Endurance / Agilité / Mental)
- [x] PRs réalisés dans la séance
- [x] Stats : durée totale, volume total, intensité
- [x] Streak du jour + bonus streak
- [x] Progression quête quotidienne
- [x] Liste des exercices avec détail séries/reps/poids (collapsible)
- [x] Notes de séance (textarea)
- [x] Effets sonores + confetti au level-up
- [x] Bouton "Récolter les récompenses"
- [ ] Partage de la séance (screenshot / social)
- [ ] Comparaison avec la séance précédente sur les mêmes exercices

---

## 📈 Statistiques
- [x] KPIs globaux : nombre de séances, volume total soulevé, durée moyenne
- [x] Liste des 50 dernières séances (date, durée, volume, exercices)
- [x] Page détail d'une séance : breakdown complet par exercice (sets / reps / poids)
- [x] Mode édition d'une séance (durée + notes)
- [x] Export PDF d'une séance
- [x] Suppression d'une séance
- [ ] Graphiques de progression (poids/reps sur un exercice dans le temps)
- [ ] Filtres par type d'entraînement / période
- [ ] Volume par groupe musculaire

---

## 📅 Historique
- [x] Campagnes complétées avec date et bouton "Rejouer"
- [x] Toutes les quêtes complétées avec stats de dernière session
- [x] Modal détail de session (temps, rounds, date)
- [x] Bouton "Rejouer" par quête
- [ ] Calendrier mensuel des séances

---

## 🏅 Badges
- [x] 13 badges répartis en 3 catégories (Régularité / Performance / Spécialité)
- [x] Barre de progression globale (X/13)
- [x] Affichage visuel (grisé si verrouillé, coloré si débloqué)
- [x] Conditions basées sur : sessions, streak, volume, PRs, spécialisation
- [x] Bouton "Recalculer" pour déclencher manuellement la détection
- [x] Déclenchement automatique en fin de séance
- [ ] Notification push lors du débloquement
- [ ] Badges sociaux (inviter un ami, etc.)

---

## 📚 Bibliothèque d'exercices
- [x] Liste complète des exercices depuis la base (groupés par muscle)
- [x] Groupes musculaires collapsibles
- [x] Nom anglais + nom français
- [x] Badge niveau (Débutant / Intermédiaire / Expert)
- [x] Badge équipement (color-codé)
- [x] Recherche par nom (2+ caractères)
- [ ] Filtres par équipement / niveau
- [ ] Fiche détaillée d'un exercice (description, muscles secondaires, GIF)
- [ ] Ajout d'exercices personnalisés

---

## 🎮 Système XP & Progression
- [x] XP calculé par série (reps × poids)
- [x] XP de fin de séance (base + durée + intensité + bonus streak + bonus quête du jour)
- [x] Distribution XP vers les 4 stats selon le type d'entraînement
- [x] Détection de level-up
- [x] Audit trail des gains XP (`audit_xp` table)
- [ ] Historique XP visible par l'utilisateur
- [ ] Événements spéciaux (double XP weekends, etc.)

---

## 🔔 Streak & Quête quotidienne
- [x] Calcul du streak courant (jours consécutifs)
- [x] Streak le plus long (record)
- [x] Vue des 7 jours de la semaine sur la Home et le profil
- [x] Bonus XP streak en fin de séance
- [x] Quête quotidienne avec cible variable (sessions / séries / XP)
- [ ] Quête quotidienne pertinente selon le mode et l'activité réelle (en standby)
- [ ] Notifications push de rappel d'entraînement

---

## 🛠️ Dashboard Admin (URL directe `/dashboard`)
- [x] CRUD complet des campagnes (titre, slug, description, niveau, équipements, durée)
- [x] CRUD complet des quêtes (type, workout_type, XP, timing, exercices)
- [x] Sélecteur de jour de la semaine (`day_of_week`) sur chaque quête
- [x] Gestion des exercices par quête (nom, reps, séries, poids, repos)
- [x] Accessible uniquement via URL directe (aucun lien dans l'app)
- [ ] Responsive mobile (desktop only actuellement)
- [ ] Gestion des droits admin (n'importe quel compte y a accès via URL)

---

## 📱 App mobile (Capacitor)
- [x] Build Android configuré (Capacitor)
- [x] Vibration tactile lors des micro-récompenses
- [x] TabBar native-like fixe en bas
- [x] LiveWorkoutBar fixe au-dessus de la TabBar
- [ ] Notifications push natives
- [ ] Mode hors-ligne (cache des séances)
- [ ] Icône app + splash screen finalisés
- [ ] Publication Play Store

---

## 🔒 Sécurité
- [x] Variables d'environnement (plus de credentials hardcodés)
- [x] RLS activé sur toutes les tables
- [x] Politiques granulaires (SELECT / INSERT / UPDATE / DELETE séparées)
- [x] SECURITY DEFINER + SET search_path sur les fonctions PostgreSQL
- [x] REVOKE EXECUTE sur anon pour les fonctions sensibles
- [x] hCaptcha sur l'auth
- [ ] Politique admin formelle (accès Dashboard restreint par rôle)
