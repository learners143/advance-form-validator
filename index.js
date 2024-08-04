// index.js

/**
* Validates a form based on the provided rules.
* @param {Object} data - The form data to validate.
* @param {Object} rules - Validation rules.
* @returns {Promise<Object>} - A promise that resolves to an object with validation results.
*/
async function validateForm(data, rules) {
  const errors = {};
  const validData = {};

  // Define regex patterns for email and phone numbers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  // Function to validate individual fields
  async function validateField(field, value, rule) {
    let fieldErrors = [];

    if (rule.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(rule.messages?.required || 'This field is required.');
    }

    if (value === undefined || value === null || value === '') {
      return fieldErrors; // Skip further validation if the field is not required and is missing
    }

    if (rule.type === 'string' && typeof value !== 'string') {
      fieldErrors.push(rule.messages?.type || 'This field must be a string.');
    }

    if (rule.type === 'number' && typeof value !== 'number' && !phoneRegex.test(value)) {
      fieldErrors.push(rule.messages?.type || 'This field must be a number.');
    }

    if (rule.type === 'email' && !emailRegex.test(value)) {
      fieldErrors.push(rule.messages?.email || 'Invalid email format.');
    }


    if (rule.minLength && value.length < rule.minLength) {
      fieldErrors.push(rule.messages?.minLength || `Must be at least ${rule.minLength} characters.`);
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      fieldErrors.push(rule.messages?.maxLength || `Must be at most ${rule.maxLength} characters.`);
    }

    if (rule.regex && !rule.regex.test(value)) {
      fieldErrors.push(rule.messages?.regex || 'Invalid format.');
    }

    if (rule.file) {
      if (!value) {
        fieldErrors.push(rule.messages?.required || 'File is required.');
      } else {
        const file = value;
        if (file.size > (rule.maxSize || Infinity)) {
          fieldErrors.push(rule.messages?.maxSize || `File size exceeds ${rule.maxSize / 1024 / 1024} MB.`);
        }
        if (rule.allowedTypes && !rule.allowedTypes.includes(file.type)) {
          fieldErrors.push(rule.messages?.type || 'Invalid file type.');
        }
      }
    }

    if (rule.asyncValidator) {
      try {
        const result = await rule.asyncValidator(value);
        if (!result.valid) {
          fieldErrors.push(result.message || 'Validation failed.');
        }
      } catch (error) {
        fieldErrors.push('Asynchronous validation error.');
      }
    }

    return fieldErrors;
  }

  // Recursively validate nested objects
  async function validateObject(obj, ruleSet, parentKey = '') {
    for (const [field, rule] of Object.entries(ruleSet)) {
      const fullKey = parentKey ? `${parentKey}.${field}`: field;
      const value = obj[field];

      if (rule.type === 'object' && typeof value === 'object' && !Array.isArray(value)) {
        await validateObject(value, rule.fields, fullKey);
      } else {
        const fieldErrors = await validateField(fullKey, value, rule);
        if (fieldErrors.length > 0) {
          errors[fullKey] = fieldErrors;
        } else {
          validData[fullKey] = value;
        }
      }
    }
  }

  await validateObject(data, rules);

  return {
    errors,
    data: validData
  };
}

module.export = {
  validateForm
}