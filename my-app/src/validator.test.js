import {
  ValidationError,
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail
} from './validator';

describe('validator.js - Tests unitaires complémentaires pour 100% de couverture', () => {
  describe('validateAge - Cas edge cases', () => {
    test('rejette null', () => {
      expect(() => validateAge(null)).toThrow(ValidationError);
      expect(() => validateAge(null)).toThrow('null ou undefined');
    });

    test('rejette undefined', () => {
      expect(() => validateAge(undefined)).toThrow(ValidationError);
      expect(() => validateAge(undefined)).toThrow('null ou undefined');
    });

    test('rejette un nombre', () => {
      expect(() => validateAge(12345)).toThrow(ValidationError);
      expect(() => validateAge(12345)).toThrow('Format de date invalide');
    });

    test('rejette une chaîne vide', () => {
      expect(() => validateAge('   ')).toThrow(ValidationError);
      expect(() => validateAge('   ')).toThrow('Format de date invalide');
    });

    test('rejette un objet non-Date', () => {
      expect(() => validateAge({ year: 1990 })).toThrow(ValidationError);
      expect(() => validateAge({ year: 1990 })).toThrow('instance de Date');
    });

    test('rejette une date invalide (Invalid Date)', () => {
      expect(() => validateAge(new Date('invalid'))).toThrow(ValidationError);
      expect(() => validateAge(new Date('invalid'))).toThrow('Date de naissance invalide');
    });

    test('accepte une string de date valide', () => {
      const result = validateAge('1990-05-15');
      expect(result.isValid).toBe(true);
      expect(result.age).toBeGreaterThanOrEqual(18);
    });

    test('rejette une string de date invalide', () => {
      expect(() => validateAge('invalid-date')).toThrow(ValidationError);
      expect(() => validateAge('invalid-date')).toThrow('Date de naissance invalide');
    });
  });

  describe('validatePostalCode - Cas edge cases', () => {
    test('rejette null', () => {
      expect(() => validatePostalCode(null)).toThrow(ValidationError);
      expect(() => validatePostalCode(null)).toThrow('null ou undefined');
    });

    test('rejette undefined', () => {
      expect(() => validatePostalCode(undefined)).toThrow(ValidationError);
      expect(() => validatePostalCode(undefined)).toThrow('null ou undefined');
    });

    test('rejette un nombre', () => {
      expect(() => validatePostalCode(75001)).toThrow(ValidationError);
      expect(() => validatePostalCode(75001)).toThrow('chaîne de caractères');
    });

    test('rejette une chaîne vide', () => {
      expect(() => validatePostalCode('   ')).toThrow(ValidationError);
      expect(() => validatePostalCode('   ')).toThrow('ne peut pas être vide');
    });
  });

  describe('validateIdentity - Cas edge cases', () => {
    test('rejette null', () => {
      expect(() => validateIdentity(null)).toThrow(ValidationError);
      expect(() => validateIdentity(null)).toThrow('null ou undefined');
    });

    test('rejette undefined', () => {
      expect(() => validateIdentity(undefined)).toThrow(ValidationError);
      expect(() => validateIdentity(undefined)).toThrow('null ou undefined');
    });

    test('rejette un nombre', () => {
      expect(() => validateIdentity(123)).toThrow(ValidationError);
      expect(() => validateIdentity(123)).toThrow('chaîne de caractères');
    });

    test('rejette une chaîne vide', () => {
      expect(() => validateIdentity('   ')).toThrow(ValidationError);
      expect(() => validateIdentity('   ')).toThrow('ne peut pas être vide');
    });
  });

  describe('validateEmail - Cas edge cases', () => {
    test('rejette null', () => {
      expect(() => validateEmail(null)).toThrow(ValidationError);
      expect(() => validateEmail(null)).toThrow('null ou undefined');
    });

    test('rejette undefined', () => {
      expect(() => validateEmail(undefined)).toThrow(ValidationError);
      expect(() => validateEmail(undefined)).toThrow('null ou undefined');
    });

    test('rejette un nombre', () => {
      expect(() => validateEmail(123)).toThrow(ValidationError);
      expect(() => validateEmail(123)).toThrow('chaîne de caractères');
    });

    test('rejette une chaîne vide', () => {
      expect(() => validateEmail('   ')).toThrow(ValidationError);
      expect(() => validateEmail('   ')).toThrow('ne peut pas être vide');
    });
  });
});
