/**
 * Exemple d'utilisation du module validator.js
 * Démontre l'utilisation de toutes les fonctions de validation
 */

const {
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail,
  ValidationError
} = require('./validator');

console.log('=== EXEMPLES D\'UTILISATION DU MODULE VALIDATOR ===\n');

// ============================================
// 1. VALIDATION D'ÂGE
// ============================================
console.log('1. VALIDATION D\'ÂGE');
console.log('-------------------');

try {
  const result = validateAge(new Date('1990-05-15'));
  console.log('✓ Âge valide:', result.age, 'ans');
} catch (error) {
  console.error('✗ Erreur:', error.message);
}

try {
  const result = validateAge(new Date('2010-01-01'));
  console.log('✓ Âge valide:', result.age, 'ans');
} catch (error) {
  console.error('✗ Erreur [' + error.code + ']:', error.message);
}

console.log();

// ============================================
// 2. VALIDATION CODE POSTAL
// ============================================
console.log('2. VALIDATION CODE POSTAL');
console.log('-------------------------');

try {
  const result = validatePostalCode('75001');
  console.log('✓ Code postal valide:', result.postalCode);
} catch (error) {
  console.error('✗ Erreur:', error.message);
}

try {
  const result = validatePostalCode('750');
  console.log('✓ Code postal valide:', result.postalCode);
} catch (error) {
  console.error('✗ Erreur [' + error.code + ']:', error.message);
}

console.log();

// ============================================
// 3. VALIDATION IDENTITÉ
// ============================================
console.log('3. VALIDATION IDENTITÉ');
console.log('----------------------');

try {
  const result = validateIdentity('Jean-Pierre');
  console.log('✓ Identité valide:', result.identity);
} catch (error) {
  console.error('✗ Erreur:', error.message);
}

try {
  const result = validateIdentity('Éléonore O\'Connor');
  console.log('✓ Identité valide:', result.identity);
} catch (error) {
  console.error('✗ Erreur:', error.message);
}

try {
  const result = validateIdentity('<script>alert("XSS")</script>');
  console.log('✓ Identité valide:', result.identity);
} catch (error) {
  console.error('✗ Erreur [' + error.code + ']:', error.message);
}

try {
  const result = validateIdentity('Dupont123');
  console.log('✓ Identité valide:', result.identity);
} catch (error) {
  console.error('✗ Erreur [' + error.code + ']:', error.message);
}

console.log();

// ============================================
// 4. VALIDATION EMAIL
// ============================================
console.log('4. VALIDATION EMAIL');
console.log('-------------------');

try {
  const result = validateEmail('user@example.com');
  console.log('✓ Email valide:', result.email);
} catch (error) {
  console.error('✗ Erreur:', error.message);
}

try {
  const result = validateEmail('jean.dupont@mail.example.fr');
  console.log('✓ Email valide:', result.email);
} catch (error) {
  console.error('✗ Erreur:', error.message);
}

try {
  const result = validateEmail('invalid.email');
  console.log('✓ Email valide:', result.email);
} catch (error) {
  console.error('✗ Erreur [' + error.code + ']:', error.message);
}

console.log();

// ============================================
// 5. GESTION D'ERREURS COMPLÈTE
// ============================================
console.log('5. EXEMPLE DE GESTION D\'ERREURS');
console.log('--------------------------------');

function validateUserData(birthDate, postalCode, name, email) {
  const errors = [];

  try {
    validateAge(birthDate);
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push({ field: 'age', code: error.code, message: error.message });
    }
  }

  try {
    validatePostalCode(postalCode);
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push({ field: 'postalCode', code: error.code, message: error.message });
    }
  }

  try {
    validateIdentity(name);
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push({ field: 'name', code: error.code, message: error.message });
    }
  }

  try {
    validateEmail(email);
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push({ field: 'email', code: error.code, message: error.message });
    }
  }

  return errors;
}

// Test avec des données invalides
const errors = validateUserData(
  new Date('2010-01-01'),  // Mineur
  '750',                   // Code postal invalide
  'Test123',               // Nom avec chiffres
  'invalid-email'          // Email invalide
);

console.log('Erreurs détectées:', errors.length);
errors.forEach(error => {
  console.log(`  - ${error.field}: [${error.code}] ${error.message}`);
});

console.log('\n=== FIN DES EXEMPLES ===');
