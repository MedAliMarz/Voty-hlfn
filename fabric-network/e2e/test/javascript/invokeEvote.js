/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

// const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
const ccpPath = path.resolve(__dirname, '..', '..', 'connection.json');

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('voter-contract');

        // Submit the specified transaction.
	
	const election = await contract.submitTransaction('createElection','{"name":"test_election","country":"TN","year":"2020","candidacy_startDate":"2020/05/13 12:00 PM","candidacy_endDate":"2020/05/14 12:00 PM","voting_startDate":"2020/05/14 12:00 PM","voting_endDate":"2020/05/15 12:00 PM"}');
        console.log(`Transaction has been submitted, result is: ${election.toString()}`);
        const electionId = JSON.parse(election.toString()).electionId;

	const voter = await contract.submitTransaction('createVoter','{"electionId":"' + electionId + '","voterId":"28586319","firstName":"khalil","lastName":"mejri"}');
        console.log(`Transaction has been submitted, result is: ${voter.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
