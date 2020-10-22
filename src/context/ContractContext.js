import React, { useContext } from 'react'

export const ContractContext = React.createContext({
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