# Formulaire d'inscription – TP Tests & CI/CD

[![Build, Test and Deploy](https://github.com/Ynov-Connect/TestUnitaireTP_Tom/actions/workflows/build_test_deploy_react.yml/badge.svg)](https://github.com/Ynov-Connect/TestUnitaireTP_Tom/actions/workflows/build_test_deploy_react.yml)
[![codecov](https://codecov.io/gh/Ynov-Connect/TestUnitaireTP_Tom/branch/main/graph/badge.svg)](https://codecov.io/gh/Ynov-Connect/TestUnitaireTP_Tom)

- **Application** : [https://ynov-connect.github.io/TestUnitaireTP_Tom/](https://ynov-connect.github.io/TestUnitaireTP_Tom/)
- **Documentation JSDoc** : [https://ynov-connect.github.io/TestUnitaireTP_Tom/docs/](https://ynov-connect.github.io/TestUnitaireTP_Tom/docs/)
- **Couverture Codecov** : [https://codecov.io/gh/Ynov-Connect/TestUnitaireTP_Tom](https://codecov.io/gh/Ynov-Connect/TestUnitaireTP_Tom)

> Projet pédagogique Ynov – Tests Unitaires, Tests d'Intégration, Tests E2E et Pipeline CI/CD.

---

## Pré-requis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Google Chrome** (pour les tests Cypress en local)

---

## Installation

```bash
git clone https://github.com/Ynov-Connect/TestUnitaireTP_Tom.git
cd TestUnitaireTP_Tom/my-app
npm install
```

---

## Lancer l'application

```bash
npm start
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Exécuter les tests

### Tests Unitaires & Intégration (Jest + React Testing Library)

```bash
npm test
```

Avec rapport de couverture :

```bash
npm test -- --watchAll=false --coverage
```

### Linting (ESLint)

```bash
npm run lint
```

## Générer la documentation (JSDoc)

```bash
npm run jsdoc
```

La doc est générée dans `public/docs/` et accessible à `/docs` une fois l'app démarrée.

---

## Tests E2E (Cypress)

### Lancer les tests E2E en mode headless (CI)

```bash
npm run test:e2e
```

### Ouvrir l'interface interactive Cypress

```bash
npm run cy:open
```

> Cypress requiert que l'application soit démarrée (`npm start`) ou utilise `start-server-and-test` automatiquement via `test:e2e`.

### Scénarios E2E implémentés (`cypress/e2e/register.cy.js`)

| Scénario | Description |
|---|---|
| **Nominal** | Accueil (0 inscrits) → Formulaire → Inscription valide → Accueil (1 inscrit, utilisateur dans la liste) |
| **Erreur** | Accueil (1 inscrit) → Formulaire → Saisie invalide → Retour → Accueil (toujours 1 inscrit, liste inchangée) |

---

## Structure du projet

```
my-app/
├── src/
│   ├── validator.js        # Module de validation (logique métier pure)
│   ├── UsersContext.js     # Contexte React – état partagé des utilisateurs
│   ├── HomePage.js         # Page d'accueil : compteur + liste des inscrits
│   ├── UserForm.js         # Page formulaire : inscription avec validation
│   ├── App.js              # Composant racine avec routage
│   ├── *.test.js           # Tests Jest / RTL
│   └── *.css               # Styles
├── cypress/
│   └── e2e/
│       └── register.cy.js  # Tests E2E – parcours d'inscription
├── public/
│   └── docs/               # Documentation JSDoc générée
├── jsdoc.config.json        # Configuration JSDoc
├── cypress.config.js        # Configuration Cypress
└── package.json
```

---

## Règles de validation du formulaire

| Champ | Règle |
|---|---|
| Prénom / Nom | Lettres, tirets, apostrophes, accents uniquement |
| Email | Format standard `xxx@xxx.xx` |
| Date de naissance | Âge minimum 18 ans |
| Code postal | Exactement 5 chiffres |
| Ville | Lettres, tirets, apostrophes, accents |

---

## Technologies

- **React 19** – UI
- **React Router DOM v6** – Navigation SPA multi-pages
- **React Context** – Gestion d'état partagé (liste des inscrits)
- **react-toastify** – Notifications
- **Jest + React Testing Library** – Tests UT/IT
- **Cypress** – Tests E2E
- **@faker-js/faker** – Données anonymisées RGPD
- **ESLint** – Linting
- **JSDoc** – Documentation
- **GitHub Actions** – CI/CD
