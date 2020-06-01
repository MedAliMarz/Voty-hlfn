/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

//import Hyperledger Fabric 1.4 SDK
const { Contract } = require('fabric-contract-api');
const path = require('path');
const fs = require('fs');

// connect to the election data file
const electionDataPath = path.join(process.cwd(), './lib/data/electionData.json');
const electionDataJson = fs.readFileSync(electionDataPath, 'utf8');
const electionData = JSON.parse(electionDataJson);

// connect to the pres election file
const ballotDataPath = path.join(process.cwd(), './lib/data/presElection.json');
const ballotDataJson = fs.readFileSync(ballotDataPath, 'utf8');
const ballotData = JSON.parse(ballotDataJson);

//import our file which contains our constructors and auxiliary function
let Ballot = require('./Ballot.js');
let Election = require('./Election.js');
let Voter = require('./Voter.js');
let Admin = require('./Admin.js');
let VotableItem = require('./VotableItem.js');
let SuperAdmin = require('./SuperAdmin.js');

class MyAssetContract extends Contract {
  
  /**
   *
   * init
   *
   * This function creates voters and gets the application ready for use by creating 
   * an election from the data files in the data directory.
   * 
   * @param ctx - the context of the transaction
   * @returns the voters which are registered and ready to vote in the election
   */
  async init(ctx) {
    
    let elections = [];
    let voters = [];
 /*
    console.log('[+] init of voterContract was called!');

    let voters = [];
    let elections = [];
    let candiates = [];
    //create voters
    let voter1 = await new Voter('V1', '234', 'Horea', 'Porutiu');
    let voter2 = await new Voter('V2', '345', 'Duncan', 'Conley');

    //update voters array
    voters.push(voter1);
    voters.push(voter2);

    //add the voters to the world state, the election class checks for registered voters 
    await ctx.stub.putState(voter1.voterId, Buffer.from(JSON.stringify(voter1)));
    await ctx.stub.putState(voter2.voterId, Buffer.from(JSON.stringify(voter2)));

    //query for election first before creating one.
    let currElections = JSON.parse(await this.queryByObjectType(ctx, 'election'));

    if (currElections.length === 0) {

      //Nov 3 is election day
      let electionStartDate = await new Date(2020, 11, 3);
      let electionEndDate = await new Date(2020, 11, 4);

      //create the election
      election = await new Election(electionData.electionName, electionData.electionCountry,
        electionData.electionYear, electionStartDate, electionEndDate);

      //update elections array
      elections.push(election);

      await ctx.stub.putState(election.electionId, Buffer.from(JSON.stringify(election)));

    } else {
      election = currElections[0];
    }


    return voters;
    */
  }

  /**
   *
   * generateBallot
   *
   * Creates a ballot in the world state, and updates voter ballot and castBallot properties.
   * 
   * @param ctx - the context of the transaction
   * @param votableItems - The different political parties and candidates you can vote for, which are on the ballot.
   * @param election - the election we are generating a ballot for. All ballots are the same for an election.
   * @param voter - the voter object
   * @returns - nothing - but updates the world state with a ballot for a particular voter object
   */
  /*
  async generateBallot(ctx, votableItems, election, voter) {

    //generate ballot
    let ballot = await new Ballot(ctx, votableItems, election, voter.voterId);
    
    //set reference to voters ballot
    voter.ballot = ballot.ballotId;
    voter.ballotCreated = true;

    // //update state with ballot object we just created
    await ctx.stub.putState(ballot.ballotId, Buffer.from(JSON.stringify(ballot)));

    await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));

  }

  */
  /**
   *
   * createVoter
   *
   * Creates a voter in the world state, based on the args given.
   *  
   * @param args.electionId - the election that the voter is registered for
   * @param args.firstName - first name of voter
   * @param args.lastName - last name of voter
   * @param args.email - email of voter
   * @param args.data - provided data of voter
   * @returns - nothing - but updates the world state with a voter
   */


  async createVoter(ctx, args) {
    console.log("##VoterContract-Inside createVoter##");
    args = JSON.parse(args);
    //check if election exist
    let check = await this.myAssetExists(ctx, args.electionId);
    //create a new voter if election exists
    if(check){
      let electionAsBytes = await ctx.stub.getState(args.electionId);
      let election = await JSON.parse(electionAsBytes);
      let newVoter = await new Voter(args.electionId, args.firstName, args.lastName,args.email,args.data);
      // update the world state
      await ctx.stub.putState(newVoter.voterId, Buffer.from(JSON.stringify(newVoter)));
      election.votersNumber +=1
      await ctx.stub.putState(election.electionId,Buffer.from(JSON.stringify(election)));
      // let response = `voter with voterId ${newVoter.voterId} is added (updated in the world state)`;
      return newVoter;
    }else{
      let response = {};
        response.error = `Election with id ${args.electionId} doesn't exist `;
        return response;
    }
  }

  /**
   *
   * createAdmin
   *
   * Creates an admin in the world state, based on his email.
   *  
   * @param args.firstName - first name of admin
   * @param args.lastName - last name of admin
   * @param args.email - email of admin
   * @returns - nothing - but updates the world state with an admin
   */


  async createAdmin(ctx, args) {

    args = JSON.parse(args);
    //create a new admin
    let newAdmin = await new Admin(args.firstName, args.lastName, args.email);
      
    // update the world state
    await ctx.stub.putState(newAdmin.email, Buffer.from(JSON.stringify(newAdmin)));
    return newAdmin;

  }


  /**
   *
   * createSuperAdmin
   *
   * Creates a super admin in the world state, based on his email.
   *  
   * @param args.firstName - first name of superadmin
   * @param args.lastName - last name of superadmin
   * @param args.email - email of superadmin
   * @returns - nothing - but updates the world state with a superadmin
   */


  async createSuperAdmin(ctx, args) {

    args = JSON.parse(args);
    //create a new super admin
    let newSuperAdmin = await new SuperAdmin(args.firstName, args.lastName, args.email, args.password);
      
    // update the world state
    await ctx.stub.putState(newSuperAdmin.email, Buffer.from(JSON.stringify(newSuperAdmin)));
    return newSuperAdmin;

  }


  /**
   *
   * createElection
   *
   * Creates an election in the world state, based on the args given.
   *  
   * @param args.name - the election name
   * @param args.description - the election description
   * @param args.organisation - the organisation that create the election
   * @param args.candidacy_startDate - the candidancy phase starting date
   * @param args.candidacy_endDate - the candidancy phase ending date
   * @param args.voting_startDate - the voting phase starting date
   * @param args.voting_endDate - the voting phase ending date
   * @returns - nothing - but updates the world state with an election
   */


  async createElection(ctx, args) {
    args = JSON.parse(args);
    console.log(ctx);
    console.log(args);

    // create the election

    let newElection = await new Election(args.name, args.description, args.organisation,args.candidacy_startDate,args.candidacy_endDate,args.voting_startDate,args.voting_endDate);
    
    // update state with new election
    await ctx.stub.putState(newElection.electionId, Buffer.from(JSON.stringify(newElection)));
    //let response = `A new election with id: ${newElection.electionId} is created (updated in the world state)`;
    return newElection;
  }

  /**
   *
   * updateElection
   *
   * update an election in the world state, based on the args given.
   *  
   * @param args.candidateId - the election id
   * @param args.description - the election country
   * @param args.organisation - the election year
   * @returns - nothing - but updates the world state with a voter
   */
  async updateElection(ctx, args) {
    args = JSON.parse(args);
    console.log(ctx);
    console.log(args);
    let electionId = args.electionId;
    let electionExists = await this.myAssetExists(ctx, electionId);
    // check the existance of the election
    if (electionExists) {
      let electionAsBytes = await ctx.stub.getState(electionId);
      let election = await JSON.parse(electionAsBytes);
      console.log("election before update" ,election)
      let updatedElection = {
        ...election,
        description:args.description,organisation:args.organisation
        }
      console.log("updatedElection" ,updatedElection)
      // update state with new election
      await ctx.stub.putState(updatedElection.electionId, Buffer.from(JSON.stringify(updatedElection)));

      //let response = `A new election with id: ${newElection.electionId} is created (updated in the world state)`;
      return updatedElection;
    }else{
      let response = {
        error:'Election not found!'
      }
      return response;
    }
  }
  /**
   *
   * validateElection
   *
   * change the state of election from created --> validated (by the superadmin)
   *  
   * @param args.candidateId - the election id
   * @returns - nothing - but updates the world state with a voter
   */
  async validateElection(ctx, args) {
    args = JSON.parse(args);

    let electionId = args.electionId;
    let electionExists = await this.myAssetExists(ctx, electionId);
    // check the existance of the election
    if (electionExists) {
      let electionAsBytes = await ctx.stub.getState(electionId);
      let election = await JSON.parse(electionAsBytes);
      console.log("election before validating" ,election)
      election.state="validated";
      console.log("election after validating" ,election)
      // update state with new election
      await ctx.stub.putState(election.electionId, Buffer.from(JSON.stringify(election)));

      //let response = `A new election with id: ${newElection.electionId} is created (updated in the world state)`;
      return election;
    }else{
      let response = {
        error:'Election not found!'
      }
      return response;
    }
  }
  /**
  *
  * updateAdmin
  *
  * update an admin in the world state, based on the args given.
  *  
  * @param args.email - the admin's email
  * @param args.firstName - the admin's firstName
  * @param args.lastName - the admin's lastName
  * @param args.elections - the admin's elections
  * @returns - nothing - but updates the world state with an admin
  */
 async updateAdmin(ctx, args) {
  args = JSON.parse(args);
  console.log(ctx);
  console.log(args);
  let email = args.email;
  let adminExists = await this.myAssetExists(ctx, email);
  // check the existance of the admin
  if (adminExists) {
    let adminAsBytes = await ctx.stub.getState(email);
    let admin = await JSON.parse(adminAsBytes);
    console.log("admin before update" ,admin)
    let updatedAdmin = {
      ...admin,
      firstName:args.firstName,lastName:args.lastName,email:args.email,elections:args.elections
      }
    console.log("updatedAdmin" ,updatedAdmin)
    // update state with new election
    await ctx.stub.putState(updatedAdmin.email, Buffer.from(JSON.stringify(updatedAdmin)));

    return updatedAdmin;
  }else{
    let response = {
      error:'Admin not found!'
    }
    return response;
  }
}
/**
 *
 * deleteMyAsset
 *
 * Deletes a key-value pair from the world state, based on the key given.
 *  
 * @param myAssetId - the key of the asset to delete
 * @returns - nothing - but deletes the value in the world state
 */
async deleteMyAsset(ctx, myAssetId) {

  const exists = await this.myAssetExists(ctx, myAssetId);
  if (!exists) {
    throw new Error(`The my asset ${myAssetId} does not exist`);
  }

  await ctx.stub.deleteState(myAssetId);

}

/**
 *
 * readMyAsset
 *
 * Reads a key-value pair from the world state, based on the key given.
 *  
 * @param myAssetId - the key of the asset to read
 * @returns - nothing - but reads the value in the world state
 */
async readMyAsset(ctx, myAssetId) {

  const exists = await this.myAssetExists(ctx, myAssetId);

  if (!exists) {
    // throw new Error(`The my asset ${myAssetId} does not exist`);
    let response = {};
    response.error = `The my asset ${myAssetId} does not exist`;
    return response;
  }

  const buffer = await ctx.stub.getState(myAssetId);
  const asset = JSON.parse(buffer.toString());
  return asset;
}
 
  /**
   *
   * myAssetExists
   *
   * Checks to see if a key exists in the world state. 
   * @param myAssetId - the key of the asset to read
   * @returns boolean indicating if the asset exists or not. 
   */
  async myAssetExists(ctx, myAssetId) {

    const buffer = await ctx.stub.getState(myAssetId);
    return (!!buffer && buffer.length > 0);

  }

  /**
   *
   * castVote
   * 
   * First to checks that a particular voter_email has not voted before, and then 
   * checks if it is a valid election time, and if it is, we increment the 
   * count of the political party that was picked by the voter and update 
   * the world state. 
   * 
   * @param electionId - the electionId of the election we want to vote in
   * @param email - the email of the voter that wants to vote
   * @param votableId - the Id of the candidate the voter has selected.
   * @returns an array which has the winning briefs of the ballot. 
   */
  async castVote(ctx, args) {
    args = JSON.parse(args);

    //get the political party the voter voted for, also the key
    let votableId = args.picked;

    //check to make sure the election exists
    let electionExists = await this.myAssetExists(ctx, args.electionId);

    if (electionExists) {

      //make sure we have an election
      let electionAsBytes = await ctx.stub.getState(args.electionId);
      let election = await JSON.parse(electionAsBytes);
      let voterAsBytes = await ctx.stub.getState(args.email);
      let voter = await JSON.parse(voterAsBytes);

      if (voter.hasVoted) {
        let response = {};
        response.error = 'this voter has already cast this ballot!';
        return response;
      }

      //check the date of the election, to make sure the election is still open
      let currentTime = await new Date(2020, 11, 3);

      //parse date objects
      let parsedCurrentTime = await Date.parse(currentTime);
      let electionStart = await Date.parse(election.startDate);
      let electionEnd = await Date.parse(election.endDate);

      //only allow vote if the election has started 
      if (parsedCurrentTime >= electionStart && parsedCurrentTime < electionEnd) {

        let votableExists = await this.myAssetExists(ctx, votableId);
        if (!votableExists) {
          let response = {};
          response.error = 'VotableId does not exist!';
          return response;
        }

        //get the votable object from the state - with the votableId the user picked
        let votableAsBytes = await ctx.stub.getState(votableId);
        let votable = await JSON.parse(votableAsBytes);

        //increase the vote of the political party that was picked by the voter
        await votable.count++;

        //update the state with the new vote count
        let result = await ctx.stub.putState(votableId, Buffer.from(JSON.stringify(votable)));
        console.log(result);

        //make sure this voter cannot vote again! 
        voter.ballotCast = true;
        voter.picked = {};
        voter.picked = args.picked;

        //update state to say that this voter has voted, and who they picked
        let response = await ctx.stub.putState(voter.email, Buffer.from(JSON.stringify(voter)));
        console.log(response);
        return voter;

      } else {
        let response = {};
        response.error = 'the election is not open now!';
        return response;
      }

    } else {
      let response = {};
      response.error = 'the election or the voter does not exist!';
      return response;
    }
  }
  /**
   *
   * vote
   * 
   * First to checks that a particular voterId has not voted before, and then 
   * checks if it is a valid election time, and if it is, we increment the 
   * count of the political party that was picked by the voter and update 
   * the world state. 
   * 
   * @param 
   * @param electionId - the electionId of the election we want to vote in
   * @param voterId - the id of the voter who wants to vote
   * @param candidateId - the candiateId of the selected candidate
   * @returns an array which has the winning briefs of the ballot. 
   */
  async vote(ctx, args) {
    args = JSON.parse(args);
    //check election existance
    let check_election = await this.myAssetExists(ctx, args.electionId);
    if(!check_election){
      let response = {};
      response.error = 'Election not found';
      return response;
    }
    //check voter existance
    let check_voter = await this.myAssetExists(ctx, args.voterId);
    if(!check_voter){
      let response = {};
      response.error = 'Voter doesn\'t exist';
      return response;
    }
    //check candidate existance
    let check_candidate = await this.myAssetExists(ctx, args.candidateId);
    if(!check_candidate){
      let response = {};
      response.error = 'Candidate doesn\'t exist';
      return response;
    }
    
    // check if the voter joined the right election
    let voterAsBytes = await ctx.stub.getState(args.voterId);
    let voter = await JSON.parse(voterAsBytes);
    if(voter.electionId!=args.electionId){
      let response = {};
      response.error = 'Voter is not registered in the selected election';
      return response;
    }
    // check if the voter didn't already vote
    if(voter.hasVoted){
      let response = {};
      response.error = 'Voter already voted';
      return response;
    }
    // check if the candiate join the right election and is a candidate
    let candidateAsBytes = await ctx.stub.getState(args.candidateId);
    let candidate = await JSON.parse(candidateAsBytes);
    if(candidate.electionId!=args.electionId || !candidate.isCandidate || !candidate.isActive){
      let response = {};
      response.error = 'Candidate is not registered in the selected election';
    }
    
    // check the timing (election deadline and starting time)
    let electionAsBytes = await ctx.stub.getState(args.electionId);
    let election = await JSON.parse(electionAsBytes);
    
    let electionStart = await Date.parse(election.voting_startDate);
    let electionEnd = await Date.parse(election.voting_endDate);
    let currentTime = await new Date();
    let parsedCurrentTime = await Date.parse(currentTime);
    if (parsedCurrentTime >= electionStart && parsedCurrentTime < electionEnd && election.state=="validated") {
      // change the status of the voter
      voter.hasVoted = true;
      // update voter state
      await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
      // add the vote to the candidate
      candidate.votes += 1
      // update candidate state
      await ctx.stub.putState(candidate.voterId, Buffer.from(JSON.stringify(candidate)));
      // add the vote to the election
      election.votes +=1
      // update the election state
      await ctx.stub.putState(election.electionId, Buffer.from(JSON.stringify(election)));

      let response  = 'A vote has been updated in world state';
      return response
      } else {
        let response = {};
        response.error = `The election ${args.electionId} is not open for voting now!`;
        return response;
      }

   
  }
  /**
   *
   * candidature
   * 
   * First to checks that a particular voter is in the same election 
   * checks if that voter is not a candidate yet 
   * change his attribut and add him to the list
   * 
   * @param electionId - the electionId of the election we want to vote in
   * @param voterId - the id of the voter who wants to vote
   * @param data - the id of the voter who wants to vote
   * @returns none. 
   */
  async candidature(ctx, args) {
    args = JSON.parse(args);

    let voter_id = args.voterId;
    let electionId = args.electionId;
    let electionExists = await this.myAssetExists(ctx, electionId);
    let voterExists  = await this.myAssetExists(ctx,voter_id);
    // check the existance of the election
    if (electionExists) {
      let electionAsBytes = await ctx.stub.getState(electionId);
      let election = await JSON.parse(electionAsBytes);
      // check the candidacy phase deadline
      let candidacyStart = await Date.parse(election.candidacy_startDate);
      let candidacyEnd = await Date.parse(election.candidacy_endDate);
      let currentTime = await new Date();
      let parsedCurrentTime = await Date.parse(currentTime);
      if(parsedCurrentTime >= candidacyStart && parsedCurrentTime < candidacyEnd && election.state=="validated"){
        // check the existance of the voter
        if (voterExists){
        
          let voterAsBytes = await ctx.stub.getState(args.voterId);
          let voter = await JSON.parse(voterAsBytes);
          // check if the voter is in the correct election
          if(voter.electionId == electionId){
            voter.data = args.data
            voter.isCandidate = true;
            voter.isActive = true;
            voter.votes=0;
            await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
            //let response = `Voter with id: ${voter.voterId} is now a candidate in the election`;
            return voter;
          }else{
            let response = {};
            response.error = 'this voter not assigned to the election';
            return response;
          }
          
  
        }else{
          let response = {};
          response.error = 'this voter doesn\'t exist!';
          return response;
        }
      }else{
        let response = {};
          response.error = 'Candidacy phase not open!';
          return response;
      }
      
    }else{
      let response = {};
      response.error = 'Election not found!';
      return response;
    }
  }
/**
   *
   * updateCandidacy
   * 
   * First to checks that a particular voter is in the same election 
   * checks if that voter is already candidate
   * activate/desactivate his candidacy 
   * update his career (data) field
   * 
   * @param electionId - the electionId of the election we want to vote in
   * @param data - the career 'data' of the candidate to change
   * @param isActive - the new value for the candidacy activity field
   * @param voterId - the email of the voter who wants to vote
   * @returns none. 
   */
  async updateCandidacy(ctx,args){
    args = JSON.parse(args);
    let voter_id = args.voterId;
    let electionId = args.electionId;
    
    let electionExists = await this.myAssetExists(ctx, electionId);
    let voterExists  = await this.myAssetExists(ctx,voter_id);
    if (electionExists) {
      let electionAsBytes = await ctx.stub.getState(electionId);
      let election = await JSON.parse(electionAsBytes);
      // candidacy phase deadline test
      let candidacyStart = await Date.parse(election.candidacy_startDate);
      let candidacyEnd = await Date.parse(election.candidacy_endDate);
      let currentTime = await new Date();
      let parsedCurrentTime = await Date.parse(currentTime);
      if(parsedCurrentTime >= candidacyStart && parsedCurrentTime < candidacyEnd && election.state=="validated"){
        if (voterExists){
          
          let voterAsBytes = await ctx.stub.getState(args.voterId);
          let voter = await JSON.parse(voterAsBytes);
          
          if(voter.electionId == electionId && voter.isCandidate){
            voter.isActive = args.isActive;
            voter.data = args.data
            await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
            //let response = `The candidate with id: ${voter.voterId} toggled his candidacy`;
            return voter;
          }else{
            let response = {};
            response.error = 'This is not a candidate in this election';
            return response;
          }
          

        }else{
          let response = {};
          response.error = 'this voter doesn\'t exist!';
          return response;
        }
      }else{
        let response = {};
        response.error = 'Candidacy phase not open!';
        return response;
      }
    }else{
      let response = {};
      response.error = 'Election not found!';
      return response;
    }
  }
/**
   *
   * toggleCandidacy
   * 
   * First to checks that a particular voter is in the same election 
   * checks if that voter is already candidate
   * activate/desactivate his candidacy
   * 
   * @param electionId - the electionId of the election we want to vote in
   * @param voterId - the email of the voter who wants to vote
   * @returns none. 
   */
  async toggleCandidacy(ctx,args){
    args = JSON.parse(args);

    //get the political party the voter voted for, also the key
    let voter_id = args.voterId;
    let electionId = args.electionId;
    let electionExists = await this.myAssetExists(ctx, electionId);
    let voterExists  = await this.myAssetExists(ctx,voter_id);
    if (electionExists) {
      let electionAsBytes = await ctx.stub.getState(electionId);
      let election = await JSON.parse(electionAsBytes);
      // candidacy phase deadline test
      let candidacyStart = await Date.parse(election.candidacy_startDate);
      let candidacyEnd = await Date.parse(election.candidacy_endDate);
      let currentTime = await new Date();
      let parsedCurrentTime = await Date.parse(currentTime);
      if(parsedCurrentTime >= candidacyStart && parsedCurrentTime < candidacyEnd){
        if (voterExists){
          
          let voterAsBytes = await ctx.stub.getState(args.voterId);
          let voter = await JSON.parse(voterAsBytes);
          
          if(voter.electionId == electionId && voter.isCandidate){
            voter.isActive = !voter.isActive;
            await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
            //let response = `The candidate with id: ${voter.voterId} toggled his candidacy`;
            return voter;
          }else{
            let response = {};
            response.error = 'This is not a candidate in this election';
            return response;
          }
          

        }else{
          let response = {};
          response.error = 'this voter doesn\'t exist!';
          return response;
        }
      }else{
        let response = {};
        response.error = 'Candidacy phase not open!';
        return response;
      }
    }else{
      let response = {};
      response.error = 'Election not found!';
      return response;
    }
  }
  /**
   * Query and return all key value pairs in the world state.
   *
   * @param {Context} ctx the transaction context
   * @returns - all key-value pairs in the world state
  */
  async queryAll(ctx) {

    let queryString = {
      selector: {}
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

  }

  /**
     * Evaluate a queryString
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
    */
  async queryWithQueryString(ctx, queryString) {

    console.log('query String');
    console.log(JSON.stringify(queryString));

    let resultsIterator = await ctx.stub.getQueryResult(queryString);

    let allResults = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let res = await resultsIterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;

        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }

        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await resultsIterator.close();
        console.info(allResults);
        console.log(JSON.stringify(allResults));
        return JSON.stringify(allResults);
      }
    }
  }

  /**
  * Query by the main objects in this app: ballot, election, votableItem, and Voter. 
  * Return all key-value pairs of a given type. 
  *
  * @param {Context} ctx the transaction context
  * @param {String} objectType the type of the object - should be either ballot, election, votableItem, or Voter
  */
  async queryByObjectType(ctx, objectType) {

    let queryString = {
      selector: {
        type: objectType
      }
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

  }
}
module.exports = MyAssetContract;
