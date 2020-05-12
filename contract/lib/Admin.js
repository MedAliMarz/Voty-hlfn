'use strict';

class Admin {
  /**
   *
   * Admin
   *
   * Constructor for an Admin object. Admin has an email, firstname and lastname
   *  
   * @param elections - elections created by admin
   * @param firstName - first name of admin
   * @param lastName - last name of admin
   * @param email - admin's email
   * @returns - admin object
   */
  constructor(firstName, lastName, email) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.elections = [];
      this.type = 'admin';
      if (this.__isContract) {
        delete this.__isContract;
      }
      if (this.name) {
        delete this.name;
      }
      return this;
  }
}
module.exports = Admin;