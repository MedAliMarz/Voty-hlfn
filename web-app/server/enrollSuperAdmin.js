/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// capture network variables from config.json
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

// let connection_file = config.connection_file;
let appSuperAdmin = config.appSuperAdmin;
let appSuperAdminSecret = config.appSuperAdminSecret;
let orgMSPID = config.orgMSPID;
let caName = config.caName;

async function main() {
  try {

    // Create a new CA client for interacting with the CA.
    const caURL = caName;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const SuperAdminExists = await wallet.exists(appSuperAdmin);
    if (SuperAdminExists) {
      console.log(`An identity for the super admin "${appSuperAdmin}" already exists in the wallet`);
      return;
    }

    // Enroll super admin, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: appSuperAdmin, enrollmentSecret: appSuperAdminSecret });
    const identity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    wallet.import(appSuperAdmin, identity);
    console.log(`msg: Successfully enrolled super admin "${appSuperAdmin}" and imported it into the wallet`);

  } catch (error) {
    console.error(`Failed to enroll super admin ' ${appSuperAdmin} : ${error}`);
    process.exit(1);
  }
}

main();