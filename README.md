# Validator TDD - Module de Validation Robuste

## Description

Projet fil rouge démontrant l'application rigoureuse du cycle **TDD (Test-Driven Development)** pour la création d'un module de validation JavaScript/Node.js.

Ce projet illustre:
- Le cycle **Red-Green-Refactor**
- La couverture exhaustive des **Edge Cases**
- La documentation technique avec **JSDoc**
- L'isolation de la logique métier (pas d'interface graphique)
- La gestion d'erreurs stricte avec codes d'erreur précis

## Fonctionnalités

### 1. Validation d'Âge (`validateAge`)
- Calcul précis basé sur la date de naissance
- Rejet strict si < 18 ans
- Gestion du 29 février (années bissextiles)
- Protection contre les dates futures
- Gestion robuste des valeurs nulles/invalides

**Edge Cases testés:**
- Date de naissance le 29 février
- Dates futures
- null, undefined, objets vides
- Chaînes vides, nombres
- Dates invalides

### 2. Validation Code Postal (`validatePostalCode`)
- Format français strict (5 chiffres exacts)
- Validation du type (doit être une chaîne)

**Edge Cases testés:**
- Codes avec 4 ou 6 chiffres
- Codes avec lettres ou caractères spéciaux
- null, undefined, objets
- Nombres (même avec 5 chiffres)

### 3. Validation Identité (`validateIdentity`)
- Accepte lettres, accents, tirets, apostrophes, espaces
- Rejette les chiffres
- Rejette les caractères spéciaux (@, #, $, etc.)
- Protection XSS (détection de balises HTML)

**Edge Cases testés:**
- Balises `<script>`, `<div>`, `<img>`
- Caractères < et >
- null, undefined, chaînes vides
- Uniquement des espaces

### 4. Validation Email (`validateEmail`)
- Format standard validé par regex
- Support des sous-domaines
- Support des points, tirets, underscores

**Edge Cases testés:**
- Emails sans @, sans domaine, sans extension
- Multiples @
- Espaces dans l'email
- null, undefined, objets

## Installation

```bash
npm install
```

## Exécution des Tests

### Lancer tous les tests
```bash
npm test
```

### Mode watch (développement)
```bash
npm run test:watch
```

### Coverage (couverture de code)
```bash
npm run test:coverage
```

## Documentation

### Générer la documentation JSDoc
```bash
npm run doc
```

La documentation sera générée dans le dossier `docs/`.

## Utilisation

```javascript
const {
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail,
  ValidationError
} = require('./validator');

// Exemple 1: Validation d'âge
try {
  const result = validateAge(new Date('1990-05-15'));
  console.log(`Âge valide: ${result.age} ans`);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Erreur ${error.code}: ${error.message}`);
  }
}

// Exemple 2: Validation code postal
try {
  const result = validatePostalCode('75001');
  console.log(`Code postal valide: ${result.postalCode}`);
} catch (error) {
  console.error(error.code, error.message);
}

// Exemple 3: Validation identité
try {
  const result = validateIdentity('Jean-Pierre');
  console.log(`Identité valide: ${result.identity}`);
} catch (error) {
  console.error(error.code, error.message);
}

// Exemple 4: Validation email
try {
  const result = validateEmail('user@example.com');
  console.log(`Email valide: ${result.email}`);
} catch (error) {
  console.error(error.code, error.message);
}
```

## Cycle TDD: Red-Green-Refactor

### Phase RED
Écriture des tests avant le code (fichier `validator.test.js`):
- Tests pour les cas valides
- Tests pour les cas invalides
- Tests pour tous les edge cases
- Tous les tests échouent (RED)

### Phase GREEN
Implémentation du code minimal pour faire passer les tests (fichier `validator.js`):
- Création de la classe `ValidationError`
- Implémentation des fonctions de validation
- Gestion des edge cases
- Tous les tests passent (GREEN)

### Phase REFACTOR
Amélioration du code sans casser les tests:
- Extraction de fonctions utilitaires (`calculatePreciseAge`)
- Amélioration de la documentation JSDoc
- Optimisation des regex
- Tous les tests continuent de passer

## Codes d'Erreur

| Code | Description |
|------|-------------|
| `INVALID_DATE` | Date invalide, null, undefined, ou format incorrect |
| `DATE_IN_FUTURE` | Date de naissance dans le futur |
| `AGE_BELOW_MINIMUM` | Âge inférieur à 18 ans |
| `INVALID_POSTAL_CODE_FORMAT` | Code postal invalide (pas 5 chiffres) |
| `INVALID_IDENTITY_FORMAT` | Identité contient des caractères invalides |
| `XSS_DETECTED` | Tentative d'injection XSS détectée |
| `INVALID_EMAIL_FORMAT` | Format d'email invalide |

## Structure du Projet

```
TP1/
├── validator.js           # Module de validation (logique métier)
├── validator.test.js      # Tests unitaires (Jest)
├── package.json           # Configuration npm
├── jest.config.js         # Configuration Jest
├── jsdoc.json            # Configuration JSDoc
├── README.md             # Documentation
└── .gitignore            # Fichiers ignorés
```

## Couverture des Tests

Le projet vise une couverture de code de **80%** minimum pour:
- Branches (branches)
- Fonctions (functions)
- Lignes (lines)
- Instructions (statements)

## Principes Appliqués

1. **TDD Strict**: Tests écrits AVANT le code
2. **Isolation**: Aucune dépendance à une interface graphique
3. **Robustesse**: Gestion exhaustive des edge cases
4. **Documentation**: JSDoc complet pour toutes les fonctions
5. **Erreurs Précises**: Codes d'erreur et messages explicites (pas de booléens)
6. **Sécurité**: Protection contre les injections XSS

## Challenge "Profondeur"

Ce projet répond au challenge en testant:

- **29 février**: Gestion complète des années bissextiles
- **null/undefined**: Protection à tous les niveaux
- **Objets vides**: Détection et rejet
- **Balises HTML**: Protection XSS active
- **Tous les types**: Validation stricte des types d'entrée

## License

ISC
