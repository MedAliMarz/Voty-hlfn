'use strict';

class Voter {
  /**
   *
   * Voter
   *
   * Constructor for a Voter object. Voter has a voterId and registrar that the
   * voter is . 
   *  
   * @param items - an array of choices 
   * @param electionId - what election you are joining
   * @returns - voter object
   */
  constructor(electionId, firstName, lastName, email, data) {

      this.electionId = electionId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.data = data;
      this.isCandidate = false;
      this.hasVoted = false;
      this.isActive = false;
      this.type = 'voter';
      this.votes = -1;
      if (this.__isContract) {
        delete this.__isContract;
      }
      if (this.name) {
        delete this.name;
      }
      return this;
  }

  /**
   *
   * validateVoter
   *
   * check for valid ID card - stateID or drivers License.
   *  
   * @param email - voter's email 
   * @returns - yes if valid Voter, no if invalid
   */
  async validateVoter(email) {
    //email error checking here, i.e. check if valid drivers License, or state ID
    if (email) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   * validateRegistrar
   *
   * check for valid registrarId, should be cross checked with government
   *  
   * @param voterId - an array of choices 
   * @returns - yes if valid Voter, no if invalid
   */
  async validateRegistrar(registrarId) {

    //registrarId error checking here, i.e. check if valid drivers License, or state ID
    if (registrarId) {
      return true;
    } else {
      return false;
    }
  }

}
module.exports = Voter;
