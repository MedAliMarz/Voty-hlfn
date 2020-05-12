'use strict';

class Election {

  /**
   *
   * validateElection
   *
   * check for valid election, cross check with government. Don't want duplicate
   * elections.
   *  
   * @param electionId - id of the election
   * @returns - yes if valid Voter, no if invalid
   */
  async validateElection(electionId) {

    //registrarId error checking here, i.e. check if valid drivers License, or state ID
    if (electionId) {
      return true;
    } else {
      return false;
    }
  }
  /**
   *
   * Election
   *
   * Constructor for an Election object. Specifies start and end date.
   *  
   * @param name - election name 
   * @param description - election description
   * @param organisation - what organisation (real life) created the election 
   * @param year - the unique Id which corresponds to a registered voter
   * @param candidacy_startDate
   * @returns - registrar object
   */
  constructor(name, description, organisation, candidacy_startDate, candidacy_endDate , voting_startDate, voting_endDate) {
    
    this.electionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+'_'+name;

    if (this.validateElection(this.electionId)) {

      //create the election object
      this.name = name;
      this.description = description;
      this.organisation = organisation;      
      this.votersNumber = 0
      this.votes = 0
      this.candidacy_startDate = candidacy_startDate;
      this.candidacy_endDate = candidacy_endDate;
      this.voting_startDate = voting_startDate;
      this.voting_endDate = voting_endDate;
      this.type = 'election';
      if (this.__isContract) {
        delete this.__isContract;
      }
      return this;

    } else {
      throw new Error('not a valid election!');
    }

  }
  
}
module.exports = Election;