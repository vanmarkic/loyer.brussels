# Site Web du Collectif Wuune

## Vue d'ensemble

Ce site web a été transformé pour représenter le collectif Wuune, une organisation citoyenne qui lutte contre les loyers abusifs à Bruxelles et dans toute la Belgique.

## Nouvelles fonctionnalités implémentées

### 1. Page d'accueil visuellement impactante

- Grand visuel avec le texte "BAISSE MON LOYER"
- Design chaleureux avec des personnes engagées
- Slogan explicite et bouton d'appel à l'action "Commencer"
- Navigation avec onglets : Accueil, Wuune, Notre campagne, Contact

### 2. Section "Qui sommes-nous ?"

- Description du collectif Wuune
- Images de manifestations à ambiance chaleureuse
- Valeurs et mission du collectif

### 3. Page "Rejoins notre campagne"

- Explication claire de la campagne contre les loyers abusifs
- Objectifs et actions concrètes
- Moyens de participation

### 4. Page "Contact"

- Formulaire de prise de contact
- Adresse email générique du collectif
- Options d'inscription à la newsletter et aux assemblées locales

### 5. Outil d'évaluation du loyer amélioré

#### Choix de région initial

- **Bruxelles** : Encadrement en vigueur
- **Wallonie** : Encadrement non encore appliqué mais évaluation possible
- **Flandres** : Outil en cours d'évaluation

#### Filtres préalables

- Vérification du type de logement (privé, AIS, social)
- Message informatif si l'encadrement ne s'applique pas

#### Page introductive pour Bruxelles

- Message rassurant sur l'utilité de l'outil
- Garantie de confidentialité
- Consentement explicite à la collecte des données
- Choix du type d'utilisateur : locataire, bailleur, autre

### 6. Parcours spécifique pour les bailleurs

- Accueil rassurant : "Informez-vous pour éviter les conflits"
- Accès à la grille légale des loyers
- Guide "Puis-je augmenter le loyer ?"
- Diagnostic rapide d'évaluation des risques
- Alertes en cas de non-respect des seuils légaux
- Conseils pour maintenir de bonnes relations
- Possibilité de médiation volontaire
- Kit pour un bail conforme
- Information sur BADALA

### 7. Parcours spécifique pour les locataires

#### Questionnaire rapide

- Collecte d'informations sur le logement
- Évaluation de l'utilité d'une contestation

#### Simulateur automatisé avec sections détaillées

**Section 1 - Situation personnelle et du bail :**

- Type de bail et durée
- Date de début du bail
- Revenu mensuel (optionnel)
- Composition du foyer
- Questions sur l'indexation
- Retards éventuels et menaces d'expulsion
- Tentatives de médiation
- Respect des obligations (chaudière, assurance)

**Section 2 - Problèmes du logement :**

- Insalubrité et défauts importants
- Problèmes de santé liés au logement

**Section 3 - Points positifs :**

- Avantages et équipements du logement

### 8. Affichage de résultats personnalisés

#### Messages adaptés selon la situation :

**Loyer inférieur à la grille :**

- Félicitations pour le loyer équitable
- Invitation à rejoindre Wuune pour défendre un encadrement plus strict

**Loyer élevé mais non-abusif :**

- Suggestion de négociation basée sur les défauts éventuels
- Accompagnement possible par Wuune

**Loyer abusif :**

- Alerte forte sur le caractère abusif
- Incitation à demander une baisse
- Invitation pressante à rejoindre Wuune pour obtenir de l'aide

**Dans tous les cas :**

- Proposition systématique d'adhésion à Wuune
- Options d'adhésion directe ou demande d'informations complémentaires

## Fonctionnalités techniques

### Composants créés

- `WuuneResultStep` : Affichage personnalisé des résultats
- Pages dédiées pour chaque région
- Questionnaire détaillé pour les locataires
- Interface spécifique pour les bailleurs

### Styles et design

- Palette de couleurs centrée sur le rouge (couleur Wuune)
- Design chaleureux et engageant
- Animations et transitions fluides
- Images SVG personnalisées pour les manifestations

### Navigation et UX

- Navigation intuitive entre les différents parcours
- Filtrage intelligent selon le type d'utilisateur
- Messages contextuels et informatifs
- Appels à l'action clairs et engageants

## Structure des fichiers

```
app/[locale]/
├── page.tsx                          # Page d'accueil Wuune
├── wuune/page.tsx                     # Page "Qui sommes-nous"
├── campagne/page.tsx                  # Page "Notre campagne"
├── contact/page.tsx                   # Page contact
├── calculateur/
│   ├── page.tsx                       # Choix de région
│   └── bruxelles/
│       ├── page.tsx                   # Calculateur Bruxelles
│       ├── bailleur/page.tsx          # Parcours bailleur
│       └── questionnaire/page.tsx     # Questionnaire détaillé

app/components/rental-calculator/
├── wuune-result-step.tsx              # Résultats personnalisés
└── calculator.tsx                     # Calculateur principal (modifié)

public/
├── hero-manifestation.svg             # Image manifestation
└── community-warmth.svg               # Image communauté
```

## Prochaines étapes

1. Intégration avec une base de données pour stocker les réponses des questionnaires
2. Système d'envoi d'emails automatisé
3. Interface d'administration pour gérer les adhésions
4. Analytics pour suivre l'utilisation de l'outil
5. Optimisation SEO pour améliorer la visibilité
6. Tests utilisateurs et améliorations de l'UX

## Technologies utilisées

- **Next.js 14** avec App Router
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **next-intl** pour l'internationalisation
- **Composants UI** basés sur Radix UI

## Installation et développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

Le site sera accessible sur `http://localhost:3000`.
