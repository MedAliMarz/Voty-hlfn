'use strict';

class SuperAdmin {
  /**
   *
   * Super Admin
   *
   * Constructor for a Super Admin object. SuperAdmin has an email, firstname and lastname
   *  
   * @param firstName - first name of super admin
   * @param lastName - last name of super admin
   * @param email - super admin's email
   * @returns - super admin object
   */
  constructor(firstName, lastName, email) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.type = 'superadmin';
      if (this.__isContract) {
        delete this.__isContract;
      }
      if (this.name) {
        delete this.name;
      }
      return this;
  }
}
module.exports = SuperAdmin;