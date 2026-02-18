# Formulaire d'inscription – TP Tests & CI/CD

[![Build, Test and Deploy](https://github.com/Ynov-Connect/TestUnitaireTP_Tom/actions/workflows/build_test_deploy_react.yml/badge.svg)](https://github.com/Ynov-Connect/TestUnitaireTP_Tom/actions/workflows/build_test_deploy_react.yml)

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

## Structure du projet

```
my-app/
├── src/
│   ├── validator.js        # Module de validation (logique métier)
│   ├── UserForm.js         # Composant React principal
│   ├── App.js              # Composant racine
│   ├── *.test.js           # Tests Jest / RTL
│   └── *.css               # Styles
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
- **react-toastify** – Notifications
- **Jest + React Testing Library** – Tests UT/IT
- **ESLint** – Linting
- **JSDoc** – Documentation
- **GitHub Actions** – CI/CD
