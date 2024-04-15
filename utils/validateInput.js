const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

module.exports = { validateUsername, validateEmail, validatePassword };
