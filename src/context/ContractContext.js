import React, { useContext } from 'react'

export const ContractContext = React.createContext({
    contractAddress: '',
    setContractAddress: '',
    coinflip: '',
    setCoinflip: () => {},
    web3: '',
    setWeb3: () => {},
    network: '',
    setNetwork: '',
    contractBalance: '',
    setContractBalance: () => {},
    owner: '',
    setOwner: () => {},
    isOwner: false,
    setIsOwner: () => {},
    sentQueryId: '',
    setSentQueryId: () => {},
    awaitingCallbackResponse: false,
    setAwaitingCallbackResponse: () => {},
    awaitingWithdrawal: false,
    setAwaitingWithdrawal: () => {},

})

export const ContractProvider = ContractContext.Provider
export const useContract = () => useContext(ContractContext)