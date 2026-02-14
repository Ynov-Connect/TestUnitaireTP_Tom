import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail,
} from './validator';
import './UserForm.css';

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    postalCode: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name, value) => {
    try {
      switch (name) {
        case 'firstName':
          validateIdentity(value);
          return null;
        case 'lastName':
          validateIdentity(value);
          return null;
        case 'email':
          validateEmail(value);
          return null;
        case 'birthDate':
          if (!value) {
            throw new Error('La date de naissance est requise');
          }
          validateAge(new Date(value));
          return null;
        case 'postalCode':
          validatePostalCode(value);
          return null;
        case 'city':
          validateIdentity(value);
          return null;
        default:
          return null;
      }
    } catch (error) {
      return error.message;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every((value) => value !== '');
    const noErrors = Object.keys(formData).every((name) => {
      return validateField(name, formData[name]) === null;
    });
    setIsValid(allFieldsFilled && noErrors);
  }, [formData, validateField]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((name) => {
      const error = validateField(name, formData[name]);
      if (error) {
        newErrors[name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }

    localStorage.setItem('userData', JSON.stringify(formData));

    toast.success('Formulaire soumis avec succès !', {
      position: 'top-right',
      autoClose: 3000,
    });

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      postalCode: '',
      city: '',
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="user-form-container">
      <h1>Formulaire d'inscription</h1>
      <form onSubmit={handleSubmit} className="user-form">
        {/* Prénom */}
        <div className="form-group">
          <label htmlFor="firstName">Prénom *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.firstName && touched.firstName ? 'error' : ''}
            aria-label="Prénom"
          />
          {errors.firstName && touched.firstName && (
            <span className="error-message" role="alert">
              {errors.firstName}
            </span>
          )}
        </div>

        {/* Nom */}
        <div className="form-group">
          <label htmlFor="lastName">Nom *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.lastName && touched.lastName ? 'error' : ''}
            aria-label="Nom"
          />
          {errors.lastName && touched.lastName && (
            <span className="error-message" role="alert">
              {errors.lastName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? 'error' : ''}
            aria-label="Email"
          />
          {errors.email && touched.email && (
            <span className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Date de naissance */}
        <div className="form-group">
          <label htmlFor="birthDate">Date de naissance *</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.birthDate && touched.birthDate ? 'error' : ''}
            aria-label="Date de naissance"
          />
          {errors.birthDate && touched.birthDate && (
            <span className="error-message" role="alert">
              {errors.birthDate}
            </span>
          )}
        </div>

        {/* Code postal */}
        <div className="form-group">
          <label htmlFor="postalCode">Code postal *</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="5"
            className={errors.postalCode && touched.postalCode ? 'error' : ''}
            aria-label="Code postal"
          />
          {errors.postalCode && touched.postalCode && (
            <span className="error-message" role="alert">
              {errors.postalCode}
            </span>
          )}
        </div>

        {/* Ville */}
        <div className="form-group">
          <label htmlFor="city">Ville *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.city && touched.city ? 'error' : ''}
            aria-label="Ville"
          />
          {errors.city && touched.city && (
            <span className="error-message" role="alert">
              {errors.city}
            </span>
          )}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={!isValid}
          className="submit-button"
          aria-label="Soumettre le formulaire"
        >
          Soumettre
        </button>
      </form>
    </div>
  );
};

export default UserForm;
