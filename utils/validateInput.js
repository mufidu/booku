const validateInput = (type, value) => {
  switch (type) {
    case 'username':
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      return usernameRegex.test(value);
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    case 'password':
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(value);
    default:
      throw new Error(`Invalid validation type: ${type}`);
  }
};

module.exports = { validateUsername, validateEmail, validatePassword };
