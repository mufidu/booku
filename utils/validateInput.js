const validateInput = (type, value) => {
  switch (type) {
    // Validates that the username is 3-20 characters long and can contain letters, numbers, and underscores.
    case 'username':
      const regexUsername = /^[a-zA-Z0-9_]{3,20}$/;
      return regexUsername.test(value);
    // Validates that the email is in a proper format.
    case 'email':
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regexEmail.test(value);
    // Validates that the password is at least 8 characters long, contains at least one letter and one number.
    case 'password':
      const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return regexPassword.test(value);
    // Placeholder for future validation types (e.g., phone number validation)
    // case 'phone':
    //   TODO: Implement phone number validation
    default:
      throw new Error('Invalid validation type');
  }
};

module.exports = { validateUsername, validateEmail, validatePassword };
