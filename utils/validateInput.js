const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const validateInput = (type, value) => {
  switch (type) {
    case 'username':
      return USERNAME_REGEX.test(value);
    case 'email':
      return EMAIL_REGEX.test(value);
    case 'password':
      return PASSWORD_REGEX.test(value);
    default:
      throw new Error(`Invalid validation type: ${type}`);
  }
};

module.exports = { validateUsername, validateEmail, validatePassword };
