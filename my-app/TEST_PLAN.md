# Plan de Test - Activité 2 : Tests d'Intégration React

## Architecture des Tests

#### Scénarios couverts par les UT :

##### validateAge()
- Accepte un âge valide (≥ 18 ans)
- Rejette un âge < 18 ans 
- Rejette une date future
- Rejette null/undefined 
- Rejette un format invalide 
- Gère les cas limites

##### validatePostalCode()
- Accepte un code postal valide (5 chiffres)
- Rejette un code postal trop court/long
- Rejette un code postal avec lettres
- Rejette null/undefined
- Rejette un type non-string

##### validateIdentity()
- Accepte des noms valides (lettres, accents, tirets, apostrophes)
- Rejette les chiffres dans les noms
- Rejette les caractères spéciaux
- Détecte les tentatives XSS 
- Rejette null/undefined
- Gère les noms composés (Jean-Pierre, O'Connor)
- Gère les accents français (François, Élise)

##### validateEmail()
- Accepte un email valide
- Rejette un format invalide
- Rejette null/undefined
- Rejette une chaîne vide

---

### 2. Tests d'Intégration (IT) - Interface React

##### 2.1 Affichage et État Initial
- Affiche tous les champs requis (Nom, Prénom, Email, Date naissance, CP, Ville)
- Le bouton de soumission est désactivé initialement
- Aucune erreur n'est affichée au chargement

##### 2.2 Validation en Temps Réel
- Affiche une erreur en rouge sous le champ concerné lors de la perte de focus (blur)
- Mise à jour de l'erreur en temps réel lors de la correction
- Disparition de l'erreur quand la valeur devient valide
- Les champs en erreur ont la classe CSS "error"

##### 2.3 Scénarios Utilisateur "Chaotique"

**Test : Prénom invalide puis correction**
- Saisit "Jean123" → Affiche erreur "ne doit contenir que des lettres"
- Corrige en "Jean" → Erreur disparaît

**Test : Tentative XSS**
- Saisit `<script>alert("XSS")</script>` → Détecte et affiche "balises HTML"

**Test : Email invalide puis correction**
- Saisit "invalide@" → Affiche erreur "format email invalide"
- Corrige en "valide@example.com" → Erreur disparaît

**Test : Âge insuffisant**
- Saisit date = 15 ans → Affiche erreur "insuffisant"

**Test : Code postal invalide**
- Saisit "123" → Affiche erreur "5 chiffres"
- Saisit "750AB" → Affiche erreur "5 chiffres"
- Corrige en "75001" → Erreur disparaît

**Test : Scénario complet désorganisé**
1. Commence par email invalide
2. Prénom avec chiffres
3. Vérifie bouton désactivé
4. Corrige email
5. Corrige prénom
6. Remplit nom
7. Date future (erreur)
8. Corrige date
9. Code postal invalide
10. Corrige code postal
11. Ville valide
12. **Résultat** : Plus d'erreurs, bouton actif

##### 2.4 Logique du Bouton de Soumission
- Reste désactivé si tous les champs ne sont pas remplis
- Reste désactivé si au moins un champ est invalide
- S'active uniquement quand tous les champs sont valides

##### 2.5 Soumission et Effets de Bord
- **localStorage.setItem()** : Vérifie que les données sont sauvegardées avec un spy
- Vérifie le format JSON des données sauvegardées
- **Toast** : Vérifie que toast.success() est appelé
- Réinitialisation : Tous les champs sont vidés après soumission
- État du formulaire : Erreurs et "touched" sont réinitialisés

##### 2.6 Tests de Régression et Cas Limites
- Caractères accentués acceptés (François)
- Noms composés avec tirets (Dupont-Martin)
- Apostrophes dans les noms (O'Connor)
- Utilisateur de 18 ans exactement

##### 2.7 Tests du DOM et Accessibilité
- Les erreurs ont `role="alert"` pour l'accessibilité
- Les erreurs sont visibles (`toBeVisible()`)
- Les champs en erreur ont la classe CSS "error"
- Le bouton a un état visuellement différent quand désactivé

---

### Tests d'Intégration (React UI)
**Responsabilité** : Valider l'interaction utilisateur et l'intégration avec la logique métier

- Simulent le comportement réel d'un utilisateur
- Vérifient que l'UI réagit correctement aux erreurs de validation
- Testent les effets de bord (localStorage, toast)
- Vérifient l'état du bouton selon la validité du formulaire
- Testent l'accessibilité et le DOM

---

## Métriques de Qualité

### Couverture des Tests
- **UT (validator.js)** : 100% de couverture de code
- **IT (UserForm)** : Tous les flux utilisateur critiques couverts

### Nombre de Tests
- **Tests Unitaires** : ~40 tests (validator.test.js)
- **Tests d'Intégration** : ~18 tests (UserForm.test.js)
- **Total** : ~58 tests

---

## Commandes de Test

```bash
# Tests unitaires (module validator.js)
cd TP1
npm test

# Tests d'intégration (React)
cd TP1/my-app
npm test

# Coverage des tests React
cd TP1/my-app
npm test -- --coverage
```

---

## Conclusion

1. **Fiabilité** : La logique métier est testée de manière exhaustive
3. **Maintenabilité** : Séparation claire entre UT et IT
4. **Non-régression** : Les tests détectent les bugs avant la production
