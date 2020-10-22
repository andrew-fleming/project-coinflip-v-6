import React, { useContext } from 'react'

export const UserContext = React.createContext({
    userAddress: '',
    setUserAddress: () => {},
    userBalance: '',
    setUserBalance: () => {},
    winningsBalance: '',
    setWinningsBalance: () => {},
})

export const UserProvider = UserContext.Provider
export const useUser = () => useContext(UserContext)