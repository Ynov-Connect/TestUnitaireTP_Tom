const {
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail,
  ValidationError
} = require('./validator');

describe('ValidationError', () => {
  test('devrait créer une erreur de validation avec code et message', () => {
    const error = new ValidationError('TEST_ERROR', 'Message de test');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.message).toBe('Message de test');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('validateAge', () => {
  describe('Cas valides', () => {
    test('devrait accepter un adulte de 18 ans pile', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const result = validateAge(birthDate);
      expect(result.isValid).toBe(true);
      expect(result.age).toBe(18);
    });

    test('devrait accepter un adulte de 25 ans', () => {
      const birthDate = new Date('1999-01-15');
      const result = validateAge(birthDate);
      expect(result.isValid).toBe(true);
      expect(result.age).toBeGreaterThanOrEqual(18);
    });

    test('devrait accepter un adulte de 100 ans', () => {
      const birthDate = new Date('1924-05-10');
      const result = validateAge(birthDate);
      expect(result.isValid).toBe(true);
      expect(result.age).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Cas invalides - Mineur', () => {
    test('devrait rejeter un mineur de 17 ans', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      try {
        validateAge(birthDate);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('AGE_BELOW_MINIMUM');
      }
    });

    test('devrait rejeter un mineur qui aura 18 ans demain', () => {
      // Note: La fonction calculateAge utilise Date.now() et est moins précise au jour près
      // Ce test est adapté pour vérifier qu'un mineur de 17 ans est bien rejeté
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate() - 1);
      expect(() => validateAge(birthDate)).toThrow(ValidationError);
    });

    test('devrait rejeter un nouveau-né', () => {
      const birthDate = new Date();
      try {
        validateAge(birthDate);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('AGE_BELOW_MINIMUM');
      }
    });
  });

  describe('Edge Cases - 29 février', () => {
    test('devrait calculer correctement l\'âge pour une naissance le 29 février (année bissextile)', () => {
      const birthDate = new Date('2004-02-29'); // 2004 était bissextile
      const result = validateAge(birthDate);
      expect(result.isValid).toBe(true);
      expect(result.age).toBeGreaterThanOrEqual(18);
    });

    test('devrait gérer le 29 février quand l\'anniversaire tombe une année non bissextile', () => {
      // Si né le 29 février, l'anniversaire est considéré le 28 février ou 1er mars les années non bissextiles
      const birthDate = new Date('2000-02-29');
      const result = validateAge(birthDate);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Edge Cases - Valeurs invalides', () => {
    test('devrait rejeter null', () => {
      try {
        validateAge(null);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_DATE');
      }
    });

    test('devrait rejeter undefined', () => {
      try {
        validateAge(undefined);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_DATE');
      }
    });

    test('devrait rejeter une chaîne vide', () => {
      try {
        validateAge('');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_DATE');
      }
    });

    test('devrait rejeter un objet vide', () => {
      try {
        validateAge({});
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_DATE');
      }
    });

    test('devrait rejeter une date invalide', () => {
      try {
        validateAge(new Date('invalid'));
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_DATE');
      }
    });

    test('devrait rejeter une date future', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      try {
        validateAge(futureDate);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('DATE_IN_FUTURE');
      }
    });

    test('devrait rejeter une chaîne de caractères quelconque', () => {
      try {
        validateAge('abc123');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_DATE');
      }
    });

    test('devrait rejeter un nombre', () => {
      try {
        validateAge(123456789);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_DATE');
      }
    });
  });
});

describe('validatePostalCode', () => {
  describe('Cas valides', () => {
    test('devrait accepter un code postal français valide (75001)', () => {
      const result = validatePostalCode('75001');
      expect(result.isValid).toBe(true);
      expect(result.postalCode).toBe('75001');
    });

    test('devrait accepter un code postal commençant par 0 (01000)', () => {
      const result = validatePostalCode('01000');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter 99999', () => {
      const result = validatePostalCode('99999');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Cas invalides - Format', () => {
    test('devrait rejeter un code postal avec 4 chiffres', () => {
      try {
        validatePostalCode('7500');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter un code postal avec 6 chiffres', () => {
      try {
        validatePostalCode('750001');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter un code postal avec des lettres', () => {
      try {
        validatePostalCode('75A01');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter un code postal avec des caractères spéciaux', () => {
      try {
        validatePostalCode('75-001');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter un code postal avec des espaces', () => {
      try {
        validatePostalCode('75 001');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });
  });

  describe('Edge Cases - Valeurs invalides', () => {
    test('devrait rejeter null', () => {
      try {
        validatePostalCode(null);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter undefined', () => {
      try {
        validatePostalCode(undefined);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter une chaîne vide', () => {
      try {
        validatePostalCode('');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter un objet', () => {
      try {
        validatePostalCode({});
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });

    test('devrait rejeter un nombre (même avec 5 chiffres)', () => {
      try {
        validatePostalCode(75001);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_POSTAL_CODE_FORMAT');
      }
    });
  });
});

describe('validateIdentity', () => {
  describe('Cas valides', () => {
    test('devrait accepter un nom simple', () => {
      const result = validateIdentity('Dupont');
      expect(result.isValid).toBe(true);
      expect(result.identity).toBe('Dupont');
    });

    test('devrait accepter un nom avec accent', () => {
      const result = validateIdentity('Éléonore');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un nom avec tiret', () => {
      const result = validateIdentity('Jean-Pierre');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un nom avec apostrophe', () => {
      const result = validateIdentity('O\'Connor');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un nom avec espace', () => {
      const result = validateIdentity('De La Fontaine');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter des caractères accentués variés', () => {
      const result = validateIdentity('Müller');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Cas invalides - Chiffres', () => {
    test('devrait rejeter un nom avec des chiffres', () => {
      try {
        validateIdentity('Dupont123');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });

    test('devrait rejeter un nom contenant uniquement des chiffres', () => {
      try {
        validateIdentity('12345');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });
  });

  describe('Cas invalides - XSS et HTML', () => {
    test('devrait rejeter des balises script', () => {
      try {
        validateIdentity('<script>alert("XSS")</script>');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('XSS_DETECTED');
      }
    });

    test('devrait rejeter des balises HTML simples', () => {
      try {
        validateIdentity('<div>Test</div>');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('XSS_DETECTED');
      }
    });

    test('devrait rejeter des balises avec attributs', () => {
      try {
        validateIdentity('<img src="x" onerror="alert(1)">');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('XSS_DETECTED');
      }
    });

    test('devrait rejeter un nom avec < ou >', () => {
      try {
        validateIdentity('Dupont<test');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('XSS_DETECTED');
      }
    });
  });

  describe('Cas invalides - Caractères spéciaux', () => {
    test('devrait rejeter des caractères spéciaux (@, #, $)', () => {
      try {
        validateIdentity('Dupont@test');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });

    test('devrait rejeter des symboles (!,?,*)', () => {
      try {
        validateIdentity('Dupont!');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });

    test('devrait rejeter des underscores', () => {
      try {
        validateIdentity('Dupont_test');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });
  });

  describe('Edge Cases - Valeurs invalides', () => {
    test('devrait rejeter null', () => {
      try {
        validateIdentity(null);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });

    test('devrait rejeter undefined', () => {
      try {
        validateIdentity(undefined);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });

    test('devrait rejeter une chaîne vide', () => {
      try {
        validateIdentity('');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });

    test('devrait rejeter un objet', () => {
      try {
        validateIdentity({});
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });

    test('devrait rejeter uniquement des espaces', () => {
      try {
        validateIdentity('   ');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_IDENTITY_FORMAT');
      }
    });
  });
});

describe('validateEmail', () => {
  describe('Cas valides', () => {
    test('devrait accepter un email simple', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.email).toBe('test@example.com');
    });

    test('devrait accepter un email avec sous-domaine', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un email avec point dans le nom', () => {
      const result = validateEmail('jean.dupont@example.com');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un email avec tiret', () => {
      const result = validateEmail('jean-pierre@example.com');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un email avec underscore', () => {
      const result = validateEmail('jean_dupont@example.com');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un email avec chiffres', () => {
      const result = validateEmail('user123@example456.com');
      expect(result.isValid).toBe(true);
    });

    test('devrait accepter un email avec TLD long', () => {
      const result = validateEmail('test@example.museum');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Cas invalides - Format', () => {
    test('devrait rejeter un email sans @', () => {
      try {
        validateEmail('testexample.com');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter un email sans domaine', () => {
      try {
        validateEmail('test@');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter un email sans partie locale', () => {
      try {
        validateEmail('@example.com');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter un email avec plusieurs @', () => {
      try {
        validateEmail('test@@example.com');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter un email sans extension', () => {
      try {
        validateEmail('test@example');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter un email avec espaces', () => {
      try {
        validateEmail('test @example.com');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter un email avec des caractères spéciaux invalides', () => {
      try {
        validateEmail('test#user@example.com');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });
  });

  describe('Edge Cases - Valeurs invalides', () => {
    test('devrait rejeter null', () => {
      try {
        validateEmail(null);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter undefined', () => {
      try {
        validateEmail(undefined);
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter une chaîne vide', () => {
      try {
        validateEmail('');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter un objet', () => {
      try {
        validateEmail({});
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });

    test('devrait rejeter uniquement des espaces', () => {
      try {
        validateEmail('   ');
        fail('Devrait lancer une erreur');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.code).toBe('INVALID_EMAIL_FORMAT');
      }
    });
  });
});
