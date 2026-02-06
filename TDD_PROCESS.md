# Cycle TDD Appliqué - Validator.js

## Méthodologie TDD

### Le Cycle Red-Green-Refactor

```
┌─────────────┐
│     RED     │  Écrire un test qui échoue
│   (Échec)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    GREEN    │  Écrire le code minimal pour faire passer le test
│  (Succès)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  REFACTOR   │  Améliorer le code sans casser les tests
│ (Nettoyage) │
└──────┬──────┘
       │
       └─────► Recommencer
```

## PHASE RED - Écriture des Tests

### Étape 1: Tests écrits AVANT le code

**Fichier**: `validator.test.js`

#### Tests pour `validateAge`
- 17 tests écrits couvrant:
  - Cas valides (18 ans, 25 ans, 100 ans)
  - Cas invalides (mineurs)
  - Edge cases (29 février, dates futures, null, undefined, objets vides)

#### Tests pour `validatePostalCode`
- 14 tests écrits couvrant:
  - Cas valides (75001, 01000, 99999)
  - Cas invalides (4 chiffres, 6 chiffres, lettres)
  - Edge cases (null, undefined, nombres, objets)

#### Tests pour `validateIdentity`
- 21 tests écrits couvrant:
  - Cas valides (accents, tirets, apostrophes)
  - Cas invalides (chiffres, caractères spéciaux)
  - Protection XSS (balises HTML)
  - Edge cases (null, undefined, chaînes vides)

#### Tests pour `validateEmail`
- 17 tests écrits couvrant:
  - Cas valides (formats standards)
  - Cas invalides (sans @, sans domaine, sans extension)
  - Edge cases (null, undefined, espaces)

**Total**: 69 tests écrits

**Résultat**: Tous les tests échouent (phase RED) car le code n'existe pas encore

---

## PHASE GREEN - Implémentation Minimale

### Étape 2: Code minimal pour faire passer les tests

**Fichier**: `validator.js`

#### Implémentation de `ValidationError`
```javascript
class ValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}
```

#### Implémentation de `validateAge`
- Vérification null/undefined
- Vérification du type
- Conversion en Date
- Validation de la date
- Calcul précis de l'âge (gestion 29 février)
- Vérification âge >= 18 ans

#### Implémentation de `validatePostalCode`
- Vérification null/undefined
- Vérification du type (doit être string)
- Regex: `/^\d{5}$/` (exactement 5 chiffres)

#### Implémentation de `validateIdentity`
- Vérification null/undefined
- Vérification du type
- Protection XSS: détection de `<` ou `>`
- Regex: `/^[a-zA-ZÀ-ÿ\u00C0-\u017F\s'\-]+$/`

#### Implémentation de `validateEmail`
- Vérification null/undefined
- Vérification du type
- Regex: `/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`

**Résultat**: Tous les tests passent (69/69)

## PHASE REFACTOR - Amélioration du Code

### Étape 3: Refactorisation sans casser les tests

#### Améliorations apportées:

1. **Extraction de fonction utilitaire**
   ```javascript
   function calculatePreciseAge(birthDate, currentDate) {
     // Logique extraite pour meilleure lisibilité
   }
   ```

2. **Documentation JSDoc complète**
   - Ajout de @typedef pour les types de retour
   - Ajout de @param pour tous les paramètres
   - Ajout de @returns et @throws
   - Ajout de @example pour chaque fonction

3. **Amélioration de la protection XSS**
   - Regex simplifiée: `/<|>/` (détecte < ou > isolés)
   - Plus simple et plus sûre

4. **Messages d'erreur descriptifs**
   - Codes d'erreur explicites
   - Contexte fourni (ex: âge calculé)

**Résultat**: Tous les tests continuent de passer (69/69)

## Résultats Finaux

### Couverture de Code
```
File          | % Stmts | % Branch | % Funcs | % Lines
--------------|---------|----------|---------|--------
validator.js  |   100%  |   100%   |  100%   |  100%
```

### Tests
- **Total**: 69 tests
- **Réussis**: 69
- **Échoués**: 0
- **Temps d'exécution**: ~300ms

### Codes d'Erreur Implémentés

| Code | Usage |
|------|-------|
| `INVALID_DATE` | Date invalide ou mal formatée |
| `DATE_IN_FUTURE` | Date de naissance dans le futur |
| `AGE_BELOW_MINIMUM` | Âge < 18 ans |
| `INVALID_POSTAL_CODE_FORMAT` | Code postal invalide |
| `INVALID_IDENTITY_FORMAT` | Identité avec caractères invalides |
| `XSS_DETECTED` | Tentative d'injection XSS |
| `INVALID_EMAIL_FORMAT` | Format d'email invalide |

## Conclusion

Ce projet démontre l'application complète du cycle TDD:

1. **RED**: 69 tests écrits avant le code
2. **GREEN**: Implémentation minimale pour faire passer tous les tests
3. **REFACTOR**: Amélioration du code avec documentation complète

**Résultat**: Module de validation robuste avec 100% de couverture de code.
