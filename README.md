![image](https://user-images.githubusercontent.com/69282788/102339143-c044a080-3f62-11eb-9503-2f0768a944bc.png)

# Coinflip Betting dApp

Project Coinflip utilizes Ethereum smart contracts and a front-end built in React which culminates into a betting dApp. Part of the complexity herein lies in the random number problem in blockchain. This dApp fetches a random number by sending a call to the Provable (formerly Oraclize) oracle and waiting for a callback which holds the "random number"--randomized by Provable--that can also be confirmed by the network. 

## Local
1. `git clone` this repo to your local environment.
2. `cd project-coinflip-v-6` into your project directory.
3. `npm` the required dependencies.
4. Confgure the `truffle-config.js` file to Ganache or another Ethereum node.
5. Initialize node.
6. In the command line, run `truffle migrate`.
7. Run `npm run start` to get the front end running.
8. Fetch the coinflip contract address from the build abi and replace the existing address inside of `../src/components/Main`
9. Make bets and flip some coins!
