//Import Hyperledger Fabric 1.4 programming model - fabric-network
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

//connect to the config file
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
// let userName = config.userName;
let gatewayDiscovery = config.gatewayDiscovery;
let orgMSPID = config.orgMSPID;
let appSuperAdmin = config.appSuperAdmin;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// get crypto tools for password hashing
const crypto = require('crypto');

// get mailing tool to send password to each voter/user
const nodemailer = require('nodemailer');

const util = require('util');

exports.connectToNetwork = async function (credentials) {
  
  const gateway = new Gateway();

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    ////console.log(`Wallet path: ${walletPath}`)//;

    //we need to retrieve email and password
    if(String(credentials).includes('|')) {
      const email_and_password = String(credentials).split('|');
      var email = email_and_password[0];
      var password = email_and_password[1];
    }
    else {
      var email = credentials;
      var password = "";
    }

    //testing..
    //console.log(`email = ${email}`);
    //console.log(`hashed_password = ${password}`);

    ////console.log('wallet: ');
    ////console.log(util.inspect(wallet));
    ////console.log('ccp: ');
    ////console.log(util.inspect(ccp));

    // generate credentials
    if(password != "") // a regular user that provided a password
    { 
      //set his credentials in the correct format
      var user_credentials = credentials;
    }
    else if(email == appSuperAdmin){ // super admin
      var user_credentials = email;
    }
    else { // a regular user that did not provide a password, he'll be rejected
      var user_credentials = "";
    }

    const userExists = await wallet.exists(user_credentials);
    if (!userExists) {
      //console.log('An identity for the user ' + email + ' does not exist in the wallet');
      //console.log('Run the registerUser.js application before retrying');
      let response = {};
      response.error = 'An identity for the user ' + email + ' does not exist in the wallet. Register ' + email + ' first';
      return response;
    }

    //console.log('before gateway.connect: ');

    await gateway.connect(ccp, { wallet, identity: credentials, discovery: gatewayDiscovery });
    console.log(gateway);
    // Connect to our local fabric
    const network = await gateway.getNetwork('mychannel');
    console.log(network);

    //console.log('Connected to mychannel. ');
    // Get the contract we have installed on the peer
    const contract = await network.getContract('voter-contract');


    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };

    return networkObj;

  } catch (error) {
    //console.log(`Error processing transaction. ${error}`);
    //console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    //console.log('Done connecting to network.');
    // gateway.disconnect();
  }
};

exports.invoke = async function (networkObj, isQuery, func, args) {
  try {
    //console.log('inside invoke');
    //console.log(`isQuery: ${isQuery}, func: ${func}, args: ${args}`);
    ////console.log(util.inspect(networkObj));


    ////console.log(util.inspect(JSON.parse(args[0])));

    if (isQuery === true) {
      //console.log('inside isQuery');

      if (args) {
        //console.log('inside isQuery, args');
        //console.log(args);
        let response = await networkObj.contract.evaluateTransaction(func, args);
        //console.log(response);
        //console.log(`Transaction ${func} with args ${args} has been evaluated`);
  
        await networkObj.gateway.disconnect();
  
        return response;
        
      } else {

        let response = await networkObj.contract.evaluateTransaction(func);
        //console.log(response);
        //console.log(`Transaction ${func} without args has been evaluated`);
  
        await networkObj.gateway.disconnect();
  
        return response;
      }
    } else {
      //console.log('notQuery');
      if (args) {
        //console.log('notQuery, args');
        //console.log(args);
        //console.log(func);

        args = JSON.parse(args[0]);

        ////console.log(util.inspect(args));
        args = JSON.stringify(args);
        //console.log("**args** => " + args);
        ////console.log(util.inspect(args));

        //console.log('before submit');
        ////console.log(util.inspect(networkObj));
        ////console.log("networkObj.contract => ", networkObj.contract);
        let response = await networkObj.contract.submitTransaction(func, args);
        //console.log('after submit');

        //console.log(response);
        //console.log(`Transaction ${func} with args ${args} has been submitted`);
  
        await networkObj.gateway.disconnect();
  
        return response;


      } else {
        let response = await networkObj.contract.submitTransaction(func);
        //console.log(response);
        //console.log(`Transaction ${func} with args has been submitted`);
  
        await networkObj.gateway.disconnect();
  
        return response;
      }
    }

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.registerVoter = async function (admin_credentials, voterId, electionId, firstName, lastName, email, password, data) {

  if (!admin_credentials || !voterId || !electionId || !firstName || !lastName || !email || !password || !data) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    ////console.log(`Wallet path: ${walletPath}`);
    ////console.log(wallet);

    // Check to see if we've already enrolled the user.
    let user_hashed_pw = crypto.pbkdf2Sync(password, "iC!T+1=*nHQ3", 5000, 20, 'sha1').toString('hex');
    const user_credentials = voterId + '|' + user_hashed_pw;
    const userExists = await wallet.exists(user_credentials);
    if (userExists) {
      let response = {};
      //console.log(`An identity for the user ${voterId} already exists in the wallet`);
      response.error = `Error! An identity for the user ${voterId} already exists in the wallet. Please enter
        a different license number.`;
      return response;
    }

    // Check to see if we've already enrolled the admin.
    const adminExists = await wallet.exists(admin_credentials);
    if (!adminExists) {
      let admin_email = String(admin_credentials).split('|')[0];
      //console.log(`An identity for the admin user ${admin_email} does not exist in the wallet`);
      //console.log('Run the enrollAdmin.js application before retrying');
      let response = {};
      response.error = `An identity for the admin user ${admin_email} does not exist in the wallet. 
        Run the enrollAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: appSuperAdmin, discovery: gatewayDiscovery });
    //console.log("Inside Register Voter, connected to the gateway!");

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity(); // HERE, adminIdentity == appSuperAdmin identity
    //console.log(`AdminIdentity connected to the gateway: ${adminIdentity}`);

    //testing password and hash
    //console.log("Password: " + password);
    //console.log("Hashed password: " + user_hashed_pw);

    // Register the user
    const secret = await ca.register({ affiliation: '', enrollmentID: voterId, role: 'voter' }, adminIdentity);
    //console.log(`###SECRET### =>  ${secret}`);
    // Enroll user
    const enrollment = await ca.enroll({ enrollmentID: voterId, enrollmentSecret: secret });
    //console.log(`###ENROLLMENT### =>  ${enrollment}`);
    // Create User Identity
    const userIdentity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    //console.log(`###USER_IDENTITY### =>  ${userIdentity}`);
    // Import user credentials & identity to wallet
    await wallet.import(user_credentials, userIdentity);
    console.log(`Successfully registered voter ${firstName} ${lastName}. Use your id: ${voterId} to login above.`);
    
    // send the password to the user/voter through email
    // 1 - configuration of the transport object, here we're using mailtrap to test with fake emails
    let transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
         user: 'fed21155c52ed5',
         pass: '29f135d029a046'
      }
    });

    // 2 - Now we'll set up our message
    const message = {
      from: 'admin@voty.com', // Sender address
      to: email,         // List of recipients
      subject: 'Voty - Election Credentials', // Subject line
      html: `<h1>Welcome to VOTY!</h1><p>Hey <b>${firstName} ${lastName}</b><br><p>You were registered to the election <b>${electionId}</b><br><p>Here's your <b>voter id</b>: ${voterId} <br><br><p>Here's your <b>password</b>: ${password} <br>Keep it somewhere safe!` // HTML message
    };

    // 3 - Send the email
    transport.sendMail(message, function(err, info) {
      if (err) {
        //console.log(err);
      } else {
        //console.log(info);
      }
    });

    let response = `Successfully registered voter ${firstName} ${lastName}. Use your id: ${voterId} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${email} + : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
};


exports.registerAdmin = async function (firstName, lastName, email, password) {

  if (!firstName || !lastName || !email || !password) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    ////console.log(`Wallet path: ${walletPath}`);
    ////console.log(wallet);

    // Set up our admin's credentials in the correct format stored in the wallet
    var admin_hashed_pw = crypto.pbkdf2Sync(password, "iC!T+1=*nHQ3", 5000, 20, 'sha1').toString('hex');
    const admin_credentials = email + '|' + admin_hashed_pw;

    // Check to see if we've already enrolled the admin.
    const adminExists = await wallet.exists(admin_credentials);
    if (adminExists) {
      let response = {};
      //console.log(`An identity for the user ${email} already exists in the wallet`);
      response.error = `Error! An identity for the user ${email} already exists in the wallet. Please enter
        a different license number.`;
      return response;
    }

    // Check to see if we've already enrolled the super admin.
    const superAdminExists = await wallet.exists(appSuperAdmin);
    if (!superAdminExists) {
      //console.log(`An identity for the super admin ${appSuperAdmin} does not exist in the wallet`);
      //console.log('Run the enrollAdmin.js application before retrying');
      let response = {};
      response.error = `An identity for the super admin ${appSuperAdmin} does not exist in the wallet. 
        Run the enrollSuperAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: appSuperAdmin, discovery: gatewayDiscovery });

    // Get the CA client object from the gateway to interact with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const currentIdentity = gateway.getCurrentIdentity(); // HERE, currentIdentity == appSuperAdmin identity
    //console.log(`Current identity connected to the gateway: ${currentIdentity}`);

    // Register the admin
    const secret = await ca.register({ affiliation: '', enrollmentID: email, role: 'admin' }, currentIdentity);
    // Enroll the admin
    const enrollment = await ca.enroll({ enrollmentID: email, enrollmentSecret: secret });
    // Create his identity
    const identity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    // import him to the wallet
    await wallet.import(admin_credentials, identity);
    console.log(`Successfully registered admin ${firstName} ${lastName}. Use your email: ${email} to login above.`);
    
    // send the password to the admin through email
    // 1 - configuration of the transport object, here we're using mailtrap to test with fake emails
    let transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
         user: 'fed21155c52ed5',
         pass: '29f135d029a046'
      }
    });

    // 2 - Now we'll set up our message
    const message = {
      from: 'admin@voty.com', // Sender address
      to: email,         // List of recipients
      subject: 'Voty - Election Credentials', // Subject line
      html: `<h1>Welcome to VOTY!</h1><p>Hey <b>${firstName} ${lastName}</b>!<br>You were registered as an admin by our super admin, you can create elections and add voters!<br><p>Here's your <b>password</b>: ${password} <br>Keep it somewhere safe!` // HTML message
    };

    // 3 - Send the email
    transport.sendMail(message, function(err, info) {
      if (err) {
        //console.log(err);
      } else {
        //console.log(info);
      }
    });

    let response = `Successfully registered admin ${firstName} ${lastName}. Use your email: ${email} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register admin + ${email} + : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
};


exports.registerSuperAdmin = async function (firstName, lastName, email, password) {

  if (!firstName || !lastName || !email || !password) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    ////console.log(`Wallet path: ${walletPath}`);
    ////console.log(wallet);

    // Set up our admin's credentials in the correct format stored in the wallet
    var admin_hashed_pw = crypto.pbkdf2Sync(password, "iC!T+1=*nHQ3", 5000, 20, 'sha1').toString('hex');
    const admin_credentials = email + '|' + admin_hashed_pw;

    // Check to see if we've already enrolled the admin.
    const adminExists = await wallet.exists(admin_credentials);
    if (adminExists) {
      let response = {};
      //console.log(`An identity for the user ${email} already exists in the wallet`);
      response.error = `Error! An identity for the user ${email} already exists in the wallet. Please enter
        a different license number.`;
      return response;
    }

    // Check to see if we've already enrolled the super admin.
    const superAdminExists = await wallet.exists(appSuperAdmin);
    if (!superAdminExists) {
      //console.log(`An identity for the super admin ${appSuperAdmin} does not exist in the wallet`);
      //console.log('Run the enrollAdmin.js application before retrying');
      let response = {};
      response.error = `An identity for the super admin ${appSuperAdmin} does not exist in the wallet. 
        Run the enrollSuperAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: appSuperAdmin, discovery: gatewayDiscovery });

    // Get the CA client object from the gateway to interact with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const currentIdentity = gateway.getCurrentIdentity(); // HERE, currentIdentity == appSuperAdmin identity
    //console.log(`Current identity connected to the gateway: ${currentIdentity}`);

    // Register the admin
    const secret = await ca.register({ affiliation: '', enrollmentID: email, role: 'superadmin' }, currentIdentity);
    // Enroll the admin
    const enrollment = await ca.enroll({ enrollmentID: email, enrollmentSecret: secret });
    // Create his identity
    const identity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    // import him to the wallet
    await wallet.import(admin_credentials, identity);
    console.log(`Successfully registered admin ${firstName} ${lastName}. Use your email: ${email} to login above.`);
    
    // send the password to the admin through email
    // 1 - configuration of the transport object, here we're using mailtrap to test with fake emails
    let transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
         user: 'fed21155c52ed5',
         pass: '29f135d029a046'
      }
    });

    // 2 - Now we'll set up our message
    const message = {
      from: 'admin@voty.com', // Sender address
      to: email,         // List of recipients
      subject: 'Voty - Election Credentials', // Subject line
      html: `<h1>Welcome to VOTY!</h1><p>Hey <b>${firstName} ${lastName}</b><br><p>Here's your <b>password</b>: ${password} <br>Keep it somewhere safe!` // HTML message
    };

    // 3 - Send the email
    transport.sendMail(message, function(err, info) {
      if (err) {
        //console.log(err);
      } else {
        //console.log(info);
      }
    });

    let response = `Successfully registered superadmin ${firstName} ${lastName}. Use your email: ${email} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register superadmin + ${email} + : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
};
