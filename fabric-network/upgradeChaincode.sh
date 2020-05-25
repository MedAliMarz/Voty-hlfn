#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml up -d cli
docker ps -a

# wait for Hyperledger CLI container to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Upgrading smart contract on peer0.org1.example.com
docker exec -e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp cli peer chaincode upgrade -n voter-contract -v $1 -C mychannel -p /opt/gopath/src/github.com/chaincode -l node
# Instantiating smart contract on mychannel
docker exec -e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n voter-contract -l node -v $1 -c '{"Args":[]}' -P 'AND('\''Org1MSP.member'\'')' --peerAddresses peer0.org1.example.com:7051
# Waiting for instantiation request to be committed ...
sleep 10
# Submitting initLedger transaction to smart contract on mychannel
docker exec -e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n voter-contract -c '{"function":"init","Args":[]}' --waitForEvent --peerAddresses peer0.org1.example.com:7051
# Closing connection to fabric tools ...
docker stop cli
docker rm cli

