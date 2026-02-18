# Activité 2 & 3 - Tests d'Intégration React + E2E CI/CD

[![CI](https://github.com/Ynov-Connect/TestUnitaireTP_Tom/actions/workflows/ci.yml/badge.svg)](https://github.com/Ynov-Connect/TestUnitaireTP_Tom/actions/workflows/ci.yml)

## Vue d'ensemble


## Fonctionnalités implémentées

### 1. Formulaire d'inscription
-  **6 champs requis** : Prénom, Nom, Email, Date de naissance, Code postal, Ville
-  **Validation en temps réel** : Feedback immédiat sur les erreurs
-  **Sécurité UI** : Bouton désactivé tant que le formulaire est invalide
-  **Toast de succès** : Notification après soumission réussie
-  **Sauvegarde localStorage** : Persistance des données
-  **Réinitialisation** : Champs vidés après soumission

### 2. Tests d'intégration
- **19 tests automatisés** avec React Testing Library
- **Scénarios chaotiques** : Utilisateur qui corrige ses erreurs
- **Spies (espions)** : Vérification de `localStorage.setItem` et `toast.success`
- **Accessibilité** : Tests avec `role="alert"`
---

## Installation

```bash
cd my-app
npm install
```
---

## Structure du projet

```
my-app/
├── src/
│   ├── validator.js          # Module de validation (copié depuis de l'activité)
│   ├── UserForm.js            # Composant formulaire principal
│   ├── UserForm.css           # Styles du formulaire
│   ├── UserForm.test.js       # Tests d'intégration (19 tests)
│   ├── App.js                 # Composant racine
│   ├── App.test.js            # Tests de base
│   └── setupTests.js          # Configuration Jest
├── babel.config.js            # Configuration Babel
├── TEST_PLAN.md               # Stratégie de tests
├── README_ACTIVITE2.md        # Documentation
└── package.json
```

---

## Lancer l'application

### Mode développement

```bash
npm start
```

L'application s'ouvre sur `http://localhost:3000`

### Build de production

```bash
npm run build
```

---

### Tous les tests

```bash
npm test
```

### Tests sans mode watch

```bash
npm test -- --watchAll=false
```

### Coverage

```bash
npm test -- --coverage --watchAll=false
```

---

## Résultats des tests

```
PASS src/App.test.js
PASS src/UserForm.test.js

Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        ~9s
```

### Tests d'intégration (UserForm.test.js)

| Catégorie | Tests | Description |
|-----------|-------|-------------|
| **Affichage initial** | 2 | Champs présents, bouton désactivé |
| **Validation temps réel** | 6 | Erreurs affichées et corrigées |
| **Scénario chaotique** | 1 | Utilisateur erratique avec corrections |
| **État du bouton** | 2 | Désactivé si invalide, activé si valide |
| **Régression** | 4 | Accents, tirets, apostrophes, 18 ans |
| **Accessibilité** | 3 | role="alert", classe "error" |

---

## Interface utilisateur

### Validation en temps réel
- **Champs invalides** : Bordure rouge + message d'erreur en rouge sous le champ
- **Champs valides** : Bordure bleue
- **Bouton désactivé** : Gris et non cliquable
- **Bouton actif** : Bleu et cliquable

### Messages d'erreur
- Prénom/Nom : "L'identité ne doit contenir que des lettres, tirets, apostrophes et espaces"
- Email : "Format d'email invalide"
- Date de naissance : "Âge insuffisant: X ans (minimum requis: 18 ans)"
- Code postal : "Le code postal doit contenir exactement 5 chiffres"
- Ville : (même que prénom/nom)

---

## Test manuel de la soumission

1. **Lancer l'application** : `npm start`
2. **Remplir le formulaire** avec des valeurs valides :
   - Prénom : Tom
   - Nom : Vieira
   - Email : tom.vieira@example.com
   - Date de naissance : (date qui donne 18+ ans)
   - Code postal : 29200
   - Ville : Brest
3. **Vérifier** que le bouton devient bleu (actif)
4. **Cliquer** sur "Soumettre"
   - Toast vert  apparaît
   - Tous les champs sont vidés
   - DevTools > Application > Local Storage > `userData` contient les données JSON

---

## Documentation des tests

Consultez le fichier **TEST_PLAN.md** pour:
- Liste des scénarios couverts
- Outils utilisés
- Guide de maintenance

---

## Règles de validation

### Prénom et Nom
- Lettres uniquement (y compris accents)
- Tirets (-) et apostrophes (')
- Chiffres et caractères spéciaux
- Balises HTML (protection XSS)

### Email
- Format : `partie_locale@domaine.extension`
- Caractères spéciaux non autorisés

### Date de naissance
- Âge ≥ 18 ans
- Date dans le futur
- Date invalide

### Code postal
- Exactement 5 chiffres
- Lettres ou caractères spéciaux non autorisés

### Ville
- Mêmes règles que Prénom/Nom

---

## Intégration avec l'Activité 1

Le module `validator.js` (TP1) est intégré directement :
- `validateIdentity()` : Prénom, Nom, Ville
- `validateEmail()` : Email
- `validateAge()` : Date de naissance
- `validatePostalCode()` : Code postal

---

## Résultat final

Tous les objectifs de l'Activité 2 sont atteints** :
1. Formulaire complet avec 6 champs
2. Validation en temps réel avec feedback immédiat
3. Bouton désactivé si formulaire invalide
4. Toast + localStorage + réinitialisation
5. Tests d'intégration avec scénarios chaotiques
6. Spies pour vérifier localStorage et toast
7. Documentation complète (TEST_PLAN.md)

---