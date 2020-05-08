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
   * @param election - what election you are making ballots for 
   * @param voterId - the unique Id which corresponds to a registered voter
   * @returns - registrar object
   */
  constructor( electionId, firstName, lastName, email, data) {


      this.voterId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);;
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
   * @param voterId - an array of choices 
   * @returns - yes if valid Voter, no if invalid
   */
  async validateVoter(voterId) {
    //VoterId error checking here, i.e. check if valid drivers License, or state ID
    if (voterId) {
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
