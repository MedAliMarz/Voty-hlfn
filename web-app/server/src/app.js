'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
moment().format();
let network = require('./fabric/network.js');

var generator = require('generate-password');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

//use this identity to query
const appAdmin = config.appAdmin;

// get crypto tools for password hashing
const crypto = require('crypto');

// token-based authentication and autorization ( json web tokens )
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'ptROYMOE3Hb$LWw&4u+[rp14l&OSf#';

// we'll put here all the invalidated tokens, we'll need a way to clean up the old tokens
let blackListedTokens = [];

// function which will be called to clean our blackListedTokens array of elements that surpassed 20 mins
// a good way to use it is by calling it in the authenticateJWT function :]
// which means on every request that needs authentication, we'll update/clean our blacklist
function cleanBlackList() {
  if(blackListedTokens.length > 0) {
    // keep only the tokens that didn't surpass 20 mins since their push time
    blackListedTokens = blackListedTokens.filter(element => (Date.now() - JSON.parse(element)["push_time"]) < 2400000);
  }
}

function token_exists(black_list, token) {
  let exist = false;
  black_list.forEach(token_entry => {
    console.log("###EQUALS### ??? => " + String(JSON.parse(token_entry)["token"]).localeCompare(String(token)));
    if(String(JSON.parse(token_entry)["token"]).localeCompare(String(token)) == 0) {
      exist = true;
      return exist;
    }
  });
  return exist;
}

// Express middleware that handles the authentication process
const authenticateJWT = (req, res, next) => {
  cleanBlackList();
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];
      // if the token entered is black-listed, we deny the user's requests
      if(blackListedTokens.length > 0 && token_exists(blackListedTokens, token)) {
        return res.status(403).json({error:'Bad request , token is no longer valid'});
      }

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.status(403).json(err);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

app.get('/election/:id', async (req, res) => {
  // Return specific election
  if(!req.params.id){
    return res.status(400).json({error:'Bad request , election id missing'});
  }else{

   try{
    let networkObj = await network.connectToNetwork(appAdmin);
    let check = await network.invoke(networkObj, true, 'myAssetExists', req.params.id);
    check = JSON.parse(check.toString())
      if(check){ // all good here!
        let response = await network.invoke(networkObj, true, 'readMyAsset', req.params.id);
        return res.status(200).json(JSON.parse(response));
      }else{
        return res.status(404).json({error:'Requested election not found'});
      }
    }catch(e){
      return res.status(500).json(JSON.parse({error:'Problem in transaction'}));
    }
  }

})
app.get('/election/:id/voters', async (req, res) => {
  // Return specific election
  if(!req.params.id){
    return res.status(400).json({error:'Bad request , election id missing'});
  }else{

   try{
    let networkObj = await network.connectToNetwork(appAdmin);
    let check = await network.invoke(networkObj, true, 'myAssetExists', req.params.id);
    check = JSON.parse(check.toString())
    if(check){ // all good here!
      let response = await network.invoke(networkObj, true, 'queryByObjectType', 'voter');
      let parsedResponse = JSON.parse(response)
      return res.status(200).json(JSON.parse(parsedResponse).filter(voter=>voter['Record'].electionId==req.params.id).map(voter=>voter['Record']));
    }else{
      return res.status(404).json({error:'Specified election not found'});
    }
    }catch(e){
      return res.status(500).json({error:'Problem in transaction',e:e});
    }
  }

})
app.get('/election', async (req, res) => {
  // Return all elections
  console.log(req.params);
  console.log("get elections")
  try{
    let networkObj = await network.connectToNetwork(appAdmin);
    let response = await network.invoke(networkObj, true, 'queryByObjectType', 'election');
    let parsedResponse = await JSON.parse(response);
    
    return res.status(200).json(JSON.parse(parsedResponse));
  }catch(e){
    console.log(e);
    return res.status(500).json({error:'Problem in transaction'})
  }
})


// create an election
app.post('/election' , authenticateJWT, async (req, res) => {


  let {name,description,organisation,candidacy_startDate,candidacy_endDate,voting_startDate,voting_endDate} = req.body
  if(!req.body || !name || !description || !organisation || !candidacy_startDate || !candidacy_endDate || !voting_startDate || !voting_endDate){
    return res.status(400).json({error:'You must supply all needed attributs'});
  }else{
    
    if (!moment(candidacy_startDate).isValid() || !moment(candidacy_endDate).isValid() || !moment(voting_startDate).isValid() || !moment(voting_endDate).isValid()){
      return res.status(400).json({error:'One of the supplied dates is invalid'});
    }else{
      try{

      let networkObj = await network.connectToNetwork(appAdmin);
      let response = await network.invoke(networkObj, false, 'createElection', [JSON.stringify({name,description,organisation,candidacy_startDate,candidacy_endDate,voting_startDate,voting_endDate})]);
      let parsedResponse = await JSON.parse(response);
      return res.status(200).send(parsedResponse);
      }catch(e ){
        return res.status(500).json({error:'Problem in transaction execution'});
      }
    }
  }
  
});

app.put('/election/:id' , authenticateJWT, async (req, res) => {

  if(!req.params.id){
    return res.status(400).json({error:'Bad request , election id missing'});
  }else{
    let {description,organisation} = req.body
    if(!req.body || ( !description && !organisation) ){
      return res.status(400).json({error:'No attributs to change'});
    }else{
        let updatedElection = {electionId:req.params.id}
        if(description) {updatedElection['description']=description}
        if(organisation) {updatedElection['organisation']=organisation}
        console.dir('updating election '+updatedElection)
        try{
        let networkObj = await network.connectToNetwork(appAdmin);
        let response = await network.invoke(networkObj, false, 'updateElection', [JSON.stringify(updatedElection)]);
        let parsedResponse = await JSON.parse(response);
        return res.status(200).send(parsedResponse);
        }catch(e){
          return res.status(500).json({error:'Problem in transaction execution',e});
        }
    }
  }
});

// get voter by id
app.get('/voter/:id', authenticateJWT, async (req, res) => {
  if(!req.params.id){
    return res.status(400).json({error:'Bad request , voter id missing'});
  }else{

    try{
      let networkObj = await network.connectToNetwork(appAdmin);
      let check = await network.invoke(networkObj, true, 'myAssetExists', req.params.id);
      check = JSON.parse(check.toString());
      if(check){ // all good
        let response = await network.invoke(networkObj, true, 'readMyAsset', req.params.id);
        return res.status(200).json(JSON.parse(response));
      }else{
        return res.status(404).json({error:'Requested userId not found'});
      }
    }catch(e){
      return res.status(500).json(JSON.parse({error:'Problem in transaction'}));
    }
  }
});

//get all voters
app.get('/voter', authenticateJWT, async (req, res) => {
  console.log("get voters")
  try{
  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryByObjectType', 'voter');
  let parsedResponse = await JSON.parse(response);
  let modifiedResponse = JSON.parse(parsedResponse).map(voter=> voter['Record'])

  return res.status(200).json(modifiedResponse);
  }catch(e){
    return res.status(500).json({error:'Problem in transaction'})
  }
});

// create a voter, no auth required
app.post('/voter', async (req, res) => {
  let {electionId,firstName,lastName,email,data} = req.body;
  if(!req.body  || !electionId || !firstName || !lastName || !email || !data ){
    return res.status(400).json({error:'You must supply all needed attributs'});
  }else{
      try{
        let networkObj = await network.connectToNetwork(appAdmin);
        
        

        // first we add the voter then enrollhim
        // it may be the wrong way but we need the random generated id to use it for registration
        let response = await network.invoke(networkObj, false, 'createVoter', [JSON.stringify({electionId,firstName,lastName,email,data})] );
        let newVoter = await JSON.parse(response);
        if(newVoter.error){
            return res.status(500).json(newVoter);
        } 
        
        else {

          // Here we need to create the user's password, then send it to his email
          let password = generator.generate({
            length: 10,
            numbers: true
          });

          //Second create the identity for the voter and add to wallet, normally admin should register him, we're just testing here..
          let resp = await network.registerVoter( newVoter.voterId, newVoter.electionId, newVoter.firstName, newVoter.lastName, newVoter.email, password, newVoter.data);
          console.log('response from registerVoter: ');
          console.log(resp);
          if (resp.error) {
            return res.status(404).json(resp.error);
          }  
        
          return res.status(200).json(newVoter);
        }
      }catch(e){
        return res.status(500).json({error:'Problem in transaction execution'});
      }
  }
});
        

//login user
app.post('/login', async (req, res) => {
  let {voterId,password} = req.body;
  if(!req.body || !voterId || !password){
    return res.status(400).json({error:'You must supply all needed attributs'});
  }
  else {
    var hash = crypto.pbkdf2Sync(password, "iC!T+1=*nHQ3", 5000, 20, 'sha1').toString('hex');
    var credentials = voterId + '@' + hash;
    let networkObj = await network.connectToNetwork(credentials);
    console.log('networkobj: ');
    console.log(util.inspect(networkObj));
  
    if (networkObj.error) {
      return res.status(404).send(networkObj);
    }
  
    try {
      let invokeResponse = await network.invoke(networkObj, true, 'readMyAsset', voterId);
      let parsedResponse = await JSON.parse(invokeResponse);
      if(parsedResponse.error){
        return res.status(500).json(parsedResponse);
      } 
      // everything is ok, login successfull
      // we get the user's role (admin, voter)
      let role = parsedResponse["type"];
      // Generate an access token
      const accessToken = jwt.sign(
        { username: voterId,  role: role }, 
          accessTokenSecret, 
        { expiresIn: '40m' }
        );
      // we send the accessToken as a response
      return res.status(200).json({
        ...parsedResponse,
        token:accessToken
      });
      }catch(e){
        return res.status(500).json({error:'Problem in transaction execution'});
      }
  }
});

// logout user
app.post('/logout', authenticateJWT, (req, res) => {
  // two ways to logout: 
  // 1- user will logout before token expiry, in this case we'll come here and invalidate his token this way
  // 2- token expires => we'll log him out from the frontend, we won't contact the server in this case
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];
      // on logout, we'll put the user's token in a blacklist, so that he won't be able to use it again
      const token_entry = JSON.stringify({"token": token, "push_time": Date.now()});
      blackListedTokens.push(token_entry);
      console.log("###LOGOUT - BlackListedTokens### => " + blackListedTokens);
  }

  return res.status(200).json({result:"Logout successful"});
});

//get candidate by ID
app.get("/candidate/:id", async (req, res)=> {
  if(!req.params.id){
    return res.status(400).json({error:'Bad request , candidate id missing'});
  }else{

   try{
    let networkObj = await network.connectToNetwork(appAdmin);
    let check = await network.invoke(networkObj, true, 'myAssetExists', req.params.id);
    check = JSON.parse(check.toString())
    if(check){
      let response = await network.invoke(networkObj, true, 'readMyAsset', req.params.id);
      let answer = JSON.parse(response);
      if(!answer.isCandidate){
        return res.status(404).json({error:`Entity with id ${req.params.id} is not a candidate`});
      }
      return res.status(200).json({
        voterId:answer.voterId,
        electionId:answer.electionId,
        firstName:answer.firstName,
        lastName:answer.lastName,
        email:answer.email,
        data:answer.data,
      });
    }else{
      return res.status(404).json({error:'Requested candidate not found'});
    }
    }catch(e){
      return res.status(500).json({error:'Problem in transaction'});
    }
  }
});

//get all candidates
app.get("/candidate", authenticateJWT, async (req, res)=> {
  // TEMP: making adjustment here before return
  try{
    let networkObj = await network.connectToNetwork(appAdmin);
    let response = await network.invoke(networkObj, true, 'queryByObjectType', 'voter');
    let parsedResponse = await JSON.parse(response);
    let modifiedResponse = JSON.parse(parsedResponse).map(voter=> voter['Record']).filter(v=>v.isCandidate);
    return res.status(200).json(modifiedResponse);
    }catch(e){
      return res.status(500).json({error:'Problem in transaction'})
    }

});

// become a candidate, needs auth
app.post("/candidate", authenticateJWT, async (req, res) => {
  let {voterId,electionId} = req.body
  if(!req.body || !voterId || !electionId ){
    return res.status(400).json({error:'You must supply all needed attributs'});
  }else{
    
    
      try{
      let networkObj = await network.connectToNetwork(appAdmin);
      let response = await network.invoke(networkObj, false, 'candidature', [JSON.stringify({voterId,electionId})]);
      let parsedResponse = await JSON.parse(response);
      if(parsedResponse.error){
        return res.status(500).json(parsedResponse);
      } 
      
      return res.status(200).json(parsedResponse);
      }catch(e ){
        return res.status(500).json({error:'Problem in transaction execution'});
      }
    
  }
  
});

// update candidacy
app.put("/toggleCandidate", authenticateJWT, async (req, res) => {
  let {voterId,electionId} = req.body;
  if(!req.body || !voterId || !electionId ){
    return res.status(400).json({error:'You must supply all needed attributs'});
  }else{
    
    
      try{
      let networkObj = await network.connectToNetwork(appAdmin);
      let response = await network.invoke(networkObj, false, 'toggleCandidacy', [JSON.stringify({voterId,electionId})]);
      let parsedResponse = await JSON.parse(response);
      if(parsedResponse.error){
        return res.status(500).json(parsedResponse);
      }
      // all good here, only voters can apply candidacy, later we'll add a verification for the user's role
      
      return res.status(200).json(parsedResponse);
      }catch(e ){
        return res.status(500).json({error:'Problem in transaction execution'});
      }
    
  }
});

// cast a vote
app.post('/vote', authenticateJWT, async (req, res)=>{
  let {voterId,electionId,candidateId} = req.body;
  if(!req.body || !voterId || !electionId || !candidateId  ){
    return res.status(400).json({error:'You must supply all needed attributs'});
  }else{
    
    
      try{
      let networkObj = await network.connectToNetwork(appAdmin);
      let response = await network.invoke(networkObj, false, 'vote', [JSON.stringify({voterId,electionId,candidateId})]);
      let parsedResponse = await JSON.parse(response);
      if(parsedResponse.error){
        return res.status(500).json(parsedResponse);
      } 
      
      return res.status(200).json(parsedResponse);
      }catch(e ){
        return res.status(500).json({error:'Problem in transaction execution'});
      }
    
  }
})

//get all assets in world state
app.get('/queryAll', authenticateJWT, async (req, res) => {

  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryAll', '');
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);

});

app.get('/getCurrentStanding', authenticateJWT, async (req, res) => {

  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryByObjectType', 'votableItem');
  let parsedResponse = await JSON.parse(response);
  console.log(parsedResponse);
  res.send(parsedResponse);

});

//vote for some candidates. This will increase the vote count for the votable objects
app.post('/castBallot', async (req, res) => {
  let networkObj = await network.connectToNetwork(req.body.voterId);
  console.log('util inspecting');
  console.log(util.inspect(networkObj));
  req.body = JSON.stringify(req.body);
  console.log('req.body');
  console.log(req.body);
  let args = [req.body];

  let response = await network.invoke(networkObj, false, 'castVote', args);
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    // let parsedResponse = await JSON.parse(response);
    res.send(response);
  }
});

//query for certain objects within the world state
app.post('/queryWithQueryString', authenticateJWT, async (req, res) => {

  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryByObjectType', req.body.selected);
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);

});

//get voter info, create voter object, and update state with their voterId
app.post('/registerVoter', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  let voterId = req.body.voterId;
  let password = req.body.password;

  //first create the identity for the voter and add to wallet
  let response = await network.registerVoter(voterId, req.body.registrarId, req.body.firstName, req.body.lastName, password);
  console.log('response from registerVoter: ');
  console.log(response);
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('req.body.voterId');
    console.log(req.body.voterId);
    let networkObj = await network.connectToNetwork(voterId);
    console.log('networkobj: ');
    console.log(networkObj);

    if (networkObj.error) {
      res.send(networkObj.error);
    }
    console.log('network obj');
    console.log(util.inspect(networkObj));


    req.body = JSON.stringify(req.body);
    let args = [req.body];
    //connect to network and update the state with voterId  

    let invokeResponse = await network.invoke(networkObj, false, 'createVoter', args);
    
    if (invokeResponse.error) {
      res.send(invokeResponse.error);
    } else {

      console.log('after network.invoke ');
      let parsedResponse = JSON.parse(invokeResponse);
      parsedResponse += '. Use voterId to login above.';
      res.send(parsedResponse);

    }

  }


});

//used as a way to login the voter to the app and make sure they haven't voted before 
app.post('/validateVoter', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  let networkObj = await network.connectToNetwork(req.body.voterId);
  console.log('networkobj: ');
  console.log(util.inspect(networkObj));

  if (networkObj.error) {
    res.send(networkObj);
  }

  let invokeResponse = await network.invoke(networkObj, true, 'readMyAsset', req.body.voterId);
  if (invokeResponse.error) {
    res.send(invokeResponse);
  } else {
    console.log('after network.invoke ');
    let parsedResponse = await JSON.parse(invokeResponse);
    if (parsedResponse.ballotCast) {
      let response = {};
      response.error = 'This voter has already cast a ballot, we cannot allow double-voting!';
      res.send(response);
    }
    // let response = `Voter with voterId ${parsedResponse.voterId} is ready to cast a ballot.`  
    res.send(parsedResponse);
  }

});

app.post('/queryByKey', authenticateJWT, async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);

  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('after network OBj');
  let response = await network.invoke(networkObj, true, 'readMyAsset', req.body.key);
  response = JSON.parse(response);
  if (response.error) {
    console.log('inside eRRRRR');
    res.send(response.error);
  } else {
    console.log('inside ELSE');
    res.send(response);
  }
});
app.get('/', async(req,res)=>{
  res.status(200).json({"result":"Voty API web server running"})
})

app.listen(process.env.PORT || 8081);
