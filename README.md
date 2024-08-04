# Advance Form Validator

`advance-form-validator` is a powerful and flexible library for validating form data in JavaScript. It allows you to define complex validation rules and provides detailed feedback for user input errors.

## Installation

To install the package, you can use npm or yarn:

```bash
npm install advance-form-validator
```
# Or,

```
yarn add advance-form-validator
```
# Quick Usage
Here's a basic example of how to use `advance-form-validator` in a React component:

## Step 1: Import and Set Up
Import the `validateForm` function from the package and use it to validate your form data against defined rules.



# Validation Rules
The validateForm function supports the following validation rules:

### Type Validation:

- `type`: 'string' - Ensures the field is a string.
- `type`: 'number' - Ensures the field is a phone number.
- `type`: 'email' - Ensures the field is a valid email address.
- `type`: 'file' - Ensures the field is a valid file with type and size constraints.

### Required Field:

- `required: true` - Field must not be empty.
### Length Constraints:

- `minLength` - Minimum number of characters for a string.
- `maxLength` - Maximum number of characters for a string.
File Constraints (for file inputs):

- `allowedTypes` - Array of allowed MIME types.
- `maxSize` - Maximum allowed file size in bytes.
### Custom Messages:

- `messages` - Custom error messages for each validation rule. For example, messages: { required: 'This field is required.' }.


# Example
Here's an example of how to use validateForm with a form that includes email, phone, username, password, full name, profile picture, and cover image fields.

```
const formData = {
  email: 'user@example.com',
  phone: '1234567890',
  username: 'validUser',
  password: 'securePassword',
  fullName: 'John Doe',
  profilePic: fileInput.files[0],
  coverImage: fileInput.files[1]
};
```

# Example Rules

### you can pass custom message if you wnat else you don't need to pass message section

```
const rules = {
  email: { 
    type: 'email', 
    required: true,
    messages: {
      required: 'Email is mandatory.',
      email: 'Please enter a valid email address.'
    }
  },
  phone: { 
    type: 'number', 
    required: true,
    messages: {
      required: 'Phone number is required.',
      number: 'Invalid phone number format.'
    }
  },
  username: { 
    type: 'string', 
    minLength: 3, 
    maxLength: 20, 
    required: true,
    messages: {
      minLength: 'Username must be at least 3 characters long.',
      maxLength: 'Username can be at most 20 characters long.'
    }
  },
  password: { 
    type: 'string', 
    minLength: 8, 
    required: true,
    messages: {
      minLength: 'Password must be at least 8 characters long.'
    }
  },
  fullName: { 
    type: 'string', 
    minLength: 2,
    messages: {
      minLength: 'Full name must be at least 2 characters long.'
    }
  },
  profilePic: { 
    file: true,
    allowedTypes: ['image/jpeg', 'image/png'],
    maxSize: 1000000, // 1 MB
    messages: {
      required: 'Profile picture is required.',
      type: 'Invalid file type. Only JPEG and PNG are allowed.',
      maxSize: 'File size exceeds 1 MB.'
    }
  },
  coverImage: { 
    file: true,
    allowedTypes: ['image/jpeg', 'image/png'],
    maxSize: 2000000, // 2 MB
    messages: {
      required: 'Cover image is required.',
      type: 'Invalid file type. Only JPEG and PNG are allowed.',
      maxSize: 'File size exceeds 2 MB.'
    }
  }
};
```

```
const result = await validateForm(formData, rules);
console.log(result.errors);

// Handle valid data (if needed)
console.log('Valid Data:', result.data);
```
## Combined error

```
const combinedErrors = Object.values(errors).flat();
```

### Displaying Errors

```
{combinedErrors.length > 0 && (
        <div className="error-container">
          <h3>Form Errors:</h3>
          <ul>
            {combinedErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
```