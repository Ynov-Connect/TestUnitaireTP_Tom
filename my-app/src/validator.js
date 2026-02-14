/**
 * @fileoverview Module de validation robuste avec gestion d'erreurs stricte
 * @version 1.0.0
 * @author Projet TDD - Ynov
 * @license ISC
 */

/**
 * Classe d'erreur personnalisée pour les validations.
 * Cette classe étend Error et ajoute un code d'erreur pour une meilleure gestion des erreurs.
 * 
 * @class ValidationError
 * @extends Error
 * 
 * @property {string} name - Nom de l'erreur (toujours 'ValidationError')
 * @property {string} code - Code d'erreur unique (ex: 'INVALID_DATE', 'XSS_DETECTED')
 * @property {string} message - Message descriptif de l'erreur
 * 
 * @example
 * throw new ValidationError('INVALID_DATE', 'La date est invalide');
 */
class ValidationError extends Error {
  /**
   * Crée une nouvelle erreur de validation
   * @param {string} code - Code d'erreur unique
   * @param {string} message - Message descriptif de l'erreur
   */
  constructor(code, message) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Résultat de la validation d'âge
 * @typedef {Object} AgeValidationResult
 * @property {boolean} isValid - Indique si l'âge est valide (toujours true si la fonction ne lève pas d'erreur)
 * @property {number} age - Âge calculé en années complètes
 * @property {Date} birthDate - Date de naissance validée
 */

/**
 * Valide l'âge d'une personne à partir de sa date de naissance.
 * 
 * Cette fonction effectue les vérifications suivantes:
 * - Vérifie que la valeur n'est pas null ou undefined
 * - Vérifie que le format est correct (Date ou string convertible)
 * - Vérifie que la date n'est pas dans le futur
 * - Calcule l'âge précis (gestion des années bissextiles et du 29 février)
 * - Rejette strictement si l'âge est inférieur à 18 ans
 * 
 * @function validateAge
 * @param {Date|string} birthDate - Date de naissance à valider
 * @returns {AgeValidationResult} Objet contenant le résultat de validation
 * @throws {ValidationError} Lance une erreur avec code INVALID_DATE si la date est invalide
 * @throws {ValidationError} Lance une erreur avec code DATE_IN_FUTURE si la date est future
 * @throws {ValidationError} Lance une erreur avec code AGE_BELOW_MINIMUM si l'âge < 18 ans
 * 
 * @example
 * // Cas valide
 * const result = validateAge(new Date('1990-05-15'));
 * console.log(result); // { isValid: true, age: 35, birthDate: Date }
 * 
 * @example
 * // Cas invalide - Mineur
 * try {
 *   validateAge(new Date('2010-01-01'));
 * } catch (error) {
 *   console.log(error.code); // 'AGE_BELOW_MINIMUM'
 * }
 */
function validateAge(birthDate) {
  // Vérification des valeurs nulles/undefined
  if (birthDate === null || birthDate === undefined) {
    throw new ValidationError(
      'INVALID_DATE',
      'La date de naissance ne peut pas être null ou undefined'
    );
  }

  // Vérification du type
  if (typeof birthDate === 'number' || typeof birthDate === 'string' && birthDate.trim() === '') {
    throw new ValidationError(
      'INVALID_DATE',
      'Format de date invalide'
    );
  }

  // Vérification des objets vides
  if (typeof birthDate === 'object' && !(birthDate instanceof Date)) {
    throw new ValidationError(
      'INVALID_DATE',
      'La date doit être une instance de Date'
    );
  }

  // Conversion en Date si nécessaire
  let dateObj;
  if (birthDate instanceof Date) {
    dateObj = birthDate;
  } else {
    dateObj = new Date(birthDate);
  }

  // Vérification de validité de la date
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(
      'INVALID_DATE',
      'Date de naissance invalide'
    );
  }

  // Vérification date future
  const today = new Date();
  if (dateObj > today) {
    throw new ValidationError(
      'DATE_IN_FUTURE',
      'La date de naissance ne peut pas être dans le futur'
    );
  }

  // Calcul précis de l'âge
  const age = calculateAge({ birth: dateObj });

  // Vérification âge minimum
  if (age < 18) {
    throw new ValidationError(
      'AGE_BELOW_MINIMUM',
      `Âge insuffisant: ${age} ans (minimum requis: 18 ans)`
    );
  }

  return {
    isValid: true,
    age: age,
    birthDate: dateObj
  };
}

/**
 * Calculate a person's age in years.
 * 
 * @private
 * @function calculateAge
 * @param {object} p An object representing a person, implementing a birth Date parameter.
 * @return {number} The age in years of p.
 */
function calculateAge(p) {
  let dateDiff = new Date(Date.now() - p.birth.getTime());
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  return age;
}

/**
 * Résultat de la validation de code postal
 * @typedef {Object} PostalCodeValidationResult
 * @property {boolean} isValid - Indique si le code postal est valide (toujours true si la fonction ne lève pas d'erreur)
 * @property {string} postalCode - Code postal validé
 */

/**
 * Valide un code postal français (format: 5 chiffres exacts).
 * 
 * Cette fonction effectue les vérifications suivantes:
 * - Vérifie que la valeur n'est pas null ou undefined
 * - Vérifie que le type est string (rejette les nombres)
 * - Vérifie que la chaîne n'est pas vide
 * - Vérifie le format: exactement 5 chiffres (regex: /^\d{5}$/)
 * 
 * @function validatePostalCode
 * @param {string} postalCode - Code postal à valider (doit être une string)
 * @returns {PostalCodeValidationResult} Objet contenant le résultat de validation
 * @throws {ValidationError} Lance une erreur avec code INVALID_POSTAL_CODE_FORMAT si le format est invalide
 */
function validatePostalCode(postalCode) {
  if (postalCode === null || postalCode === undefined) {
    throw new ValidationError(
      'INVALID_POSTAL_CODE_FORMAT',
      'Le code postal ne peut pas être null ou undefined'
    );
  }

  if (typeof postalCode !== 'string') {
    throw new ValidationError(
      'INVALID_POSTAL_CODE_FORMAT',
      'Le code postal doit être une chaîne de caractères'
    );
  }

  if (postalCode.trim() === '') {
    throw new ValidationError(
      'INVALID_POSTAL_CODE_FORMAT',
      'Le code postal ne peut pas être vide'
    );
  }

  // Format français: exactement 5 chiffres
  const postalCodeRegex = /^\d{5}$/;
  
  if (!postalCodeRegex.test(postalCode)) {
    throw new ValidationError(
      'INVALID_POSTAL_CODE_FORMAT',
      'Le code postal doit contenir exactement 5 chiffres'
    );
  }

  return {
    isValid: true,
    postalCode: postalCode
  };
}

/**
 * Résultat de la validation d'identité
 * @typedef {Object} IdentityValidationResult
 * @property {boolean} isValid - Indique si l'identité est valide (toujours true si la fonction ne lève pas d'erreur)
 * @property {string} identity - Identité validée
 */

/**
 * Valide un nom ou prénom avec protection XSS.
 * 
 * Cette fonction effectue les vérifications suivantes:
 * - Vérifie que la valeur n'est pas null ou undefined
 * - Vérifie que le type est string
 * - Vérifie que la chaîne n'est pas vide ou uniquement des espaces
 * - Détecte les tentatives d'injection XSS (caractères < ou >)
 * - Valide le format: lettres (avec accents), tirets, apostrophes, espaces uniquement
 * - Rejette les chiffres et caractères spéciaux
 * 
 * Caractères acceptés:
 * - Lettres: a-z, A-Z
 * - Accents: À-ÿ, caractères Unicode \u00C0-\u017F
 * - Tirets: -
 * - Apostrophes: '
 * - Espaces
 * 
 * @function validateIdentity
 * @param {string} identity - Nom ou prénom à valider
 * @returns {IdentityValidationResult} Objet contenant le résultat de validation
 * @throws {ValidationError} Lance une erreur avec code XSS_DETECTED si des balises HTML sont détectées
 * @throws {ValidationError} Lance une erreur avec code INVALID_IDENTITY_FORMAT si le format est invalide
 * 
 */
function validateIdentity(identity) {
  if (identity === null || identity === undefined) {
    throw new ValidationError('INVALID_IDENTITY_FORMAT', 'L\'identité ne peut pas être null ou undefined');
  }

  if (typeof identity !== 'string') {
    throw new ValidationError('INVALID_IDENTITY_FORMAT', 'L\'identité doit être une chaîne de caractères');
  }

  if (identity.trim() === '') {
    throw new ValidationError(
      'INVALID_IDENTITY_FORMAT',
      'L\'identité ne peut pas être vide'
    );
  }

  // Protection XSS: détection de balises HTML et caractères < ou >
  const xssRegex = /<|>/;
  if (xssRegex.test(identity)) {
    throw new ValidationError(
      'XSS_DETECTED',
      'Détection de balises HTML: tentative d\'injection potentielle'
    );
  }

  // Format valide: lettres (avec accents), tirets, apostrophes, espaces
  // Rejette: chiffres et caractères spéciaux
  const identityRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s'\-]+$/;
  
  if (!identityRegex.test(identity)) {
    throw new ValidationError(
      'INVALID_IDENTITY_FORMAT',
      'L\'identité ne doit contenir que des lettres, tirets, apostrophes et espaces'
    );
  }

  return {
    isValid: true,
    identity: identity
  };
}

/**
 * Résultat de la validation d'email
 * @typedef {Object} EmailValidationResult
 * @property {boolean} isValid - Indique si l'email est valide (toujours true si la fonction ne lève pas d'erreur)
 * @property {string} email - Email validé
 */

/**
 * Valide une adresse email selon le format standard.
 * 
 * Cette fonction effectue les vérifications suivantes:
 * - Vérifie que la valeur n'est pas null ou undefined
 * - Vérifie que le type est string
 * - Vérifie que la chaîne n'est pas vide ou uniquement des espaces
 * - Valide le format: partie_locale@domaine.extension
 * 
 * Format accepté:
 * - Partie locale: lettres, chiffres, points (.), underscores (_), tirets (-)
 * - Arobase: @ (obligatoire, un seul)
 * - Domaine: lettres, chiffres, points (.), tirets (-)
 * - Extension: au moins 2 lettres
 * 
 * @function validateEmail
 * @param {string} email - Adresse email à valider
 * @returns {EmailValidationResult} Objet contenant le résultat de validation
 * @throws {ValidationError} Lance une erreur avec code INVALID_EMAIL_FORMAT si le format est invalide
 */
function validateEmail(email) {
  if (email === null || email === undefined) {
    throw new ValidationError(
      'INVALID_EMAIL_FORMAT',
      'L\'email ne peut pas être null ou undefined'
    );
  }

  if (typeof email !== 'string') {
    throw new ValidationError(
      'INVALID_EMAIL_FORMAT',
      'L\'email doit être une chaîne de caractères'
    );
  }

  if (email.trim() === '') {
    throw new ValidationError(
      'INVALID_EMAIL_FORMAT',
      'L\'email ne peut pas être vide'
    );
  }

  // Regex pour validation email standard
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    throw new ValidationError(
      'INVALID_EMAIL_FORMAT',
      'Format d\'email invalide'
    );
  }

  return {
    isValid: true,
    email: email
  };
}

module.exports = {
  ValidationError,
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail
};
