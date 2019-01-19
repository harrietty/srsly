const bcrypt = require('bcrypt');

/**
 * Creates instances of a User object
 */
class User {
  // eslint-disable-next-line require-jsdoc
  constructor(email, hashedPassword) {
    this.email = email;
    this.hashedPassword = hashedPassword;
  }

  /**
   * Compares a plain text password against the hashed version
   * @param {String} password
   * @param {Function} cb
   */
  comparePassword(password, cb) {
    bcrypt.compare(password, this.hashedPassword, (err, res) => {
      if (err) cb(err);
      else cb(null, res);
    });
  }
}

// Temporary User in place of a database of users
const user = new User('hat', '$2b$10$Ex1fB7UrRKc.6irX/MA2nO2zsjZyidfyzaCe0PkfFDgPyhyF7mjKC');

/**
 * Finds a user instance by email
 * @param {String} email
 * @return {Object|null}
 */
const findUser = (email) => {
  return user.email === email ? user : null;
};

module.exports = findUser;
