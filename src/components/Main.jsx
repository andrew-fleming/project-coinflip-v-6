import React, { useState, useEffect, useCallback } from 'react'
import Coinflip from '../abi/Coinflip.json'
import Web3 from 'web3'
import NavBar from './NavBar'
import ContractBalance from './ContractBalance'
import MainCard from './MainCard'
import OwnerScreen from './OwnerScreen'
import Directions from './Directions'
import ModalWindow from './ModalWindow'
import styled from 'styled-components'

import { useUser } from '../context/UserContext'
import { useContract } from '../context/ContractContext'

const AlignContent = styled.div`
    position: relative;
    top: 1rem;
    display: flex;
    justify-content: space-between;
`;

const AlignQuarter = styled.div`
    width: 25%
`;

const AlignHalf = styled.div`
    width: 50%
`;


const web3 = new Web3(Web3.givenProvider)
const contractAddress = '0x4b6F8E0B8a51e2cFfC529a58B15004F6EB68A62E'
const coinflip = new web3.eth.Contract(Coinflip.abi, contractAddress)


export default function Main() {

    //fetching user context
    const { 
        userAddress, 
        setUserAddress,
        userBalance, 
        setUserBalance,
        winningsBalance,
        setWinningsBalance,
    } = useUser();
    

    //fetching contract context
    const  {
        contractBalance,
        setContractBalance,
        setOwner, 
        setIsOwner, 
        setNetwork,
        sentQueryId,
        setSentQueryId,
        awaitingCallbackResponse,
        setAwaitingCallbackResponse,
        awaitingWithdrawal,
        setAwaitingWithdrawal,
    } = useContract();

    const fetchNetwork = useCallback(async() => {
        let num = await web3.currentProvider.chainId;
        if(num === '0x1'){
            setNetwork('Mainnet')
        } else if(num === '0x3'){
            setNetwork('Ropsten')
        } else if(num === '0x4'){
            setNetwork('Rinkeby')
        } else if(num === '0x5'){
            setNetwork('Goerli')
        } else if(num === '0x42'){
            setNetwork('Kovan')
        } else {
            setNetwork('N/A')
        }
    }, [setNetwork])


    //app state necessary only in this component hence no 'AppContext'
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [outcomeMessage, setOutcomeMessage] = useState('');
   
    //
    //functions necessary to fetch onchain data and user info
    //

    const loadUserAddress = useCallback(async() => {
        let accounts = await web3.eth.getAccounts()
        let account = accounts[0]
        return account
    }, [])

    const loadContractBalance = useCallback(async() => {
        let balance = await coinflip.methods.contractBalance().call()
        setContractBalance(web3.utils.fromWei(balance))
    }, [setContractBalance])

    const loadUserBalance = useCallback(async(user) => {
        let userBal = await web3.eth.getBalance(user)
        setUserBalance(Number.parseFloat(web3.utils.fromWei(userBal)).toPrecision(3))
    }, [setUserBalance])

    const loadWinningsBalance = useCallback(async(userAdd) => {
        let config = {from: userAdd}
        let bal = await coinflip.methods.getWinningsBalance().call(config)
        setWinningsBalance(Number.parseFloat(web3.utils.fromWei(bal)).toPrecision(3));
    }, [setWinningsBalance])

    const loadOwner = useCallback(async() => {
        let theOwner = await coinflip.methods.owner().call()
        setOwner(theOwner)
        return theOwner
    }, [setOwner])

    const checkOwner = useCallback((add, own) => {
        if(add === own){
            setIsOwner(true)
        } else {
            setIsOwner(false)
        }
    }, [setIsOwner])

    
    //
    //initialization
    //

    const componentDidMount = useCallback(async() => {
        await loadUserAddress().then(response => {
            setUserAddress(response)
            loadUserBalance(response)
            loadWinningsBalance(response)
            .then(loadOwner().then(response => {
                setOwner(response)
                const ownerAdd = response
                console.log(response)
                loadUserAddress().then(response => {
                    checkOwner(ownerAdd, response)
                })
            }))
            })
            await loadContractBalance()
            await fetchNetwork()
    }, 
        [loadUserAddress, 
        setUserAddress, 
        loadUserBalance, 
        loadWinningsBalance, 
        loadOwner, 
        setOwner,
        checkOwner,
        fetchNetwork,
        loadContractBalance
    ])


    //watching for initialization^
    useEffect(() => {
        if(userAddress === ''){
            componentDidMount()
        }
    }, [componentDidMount, userAddress])

    
     //
     //set coinflip function with heads/tails functions
     //

     const flip = async(oneZero, bet) => {
        let guess = oneZero
        let betAmt = bet
        let config = {
            value: web3.utils.toWei(betAmt, 'ether'),
            from: userAddress
        }
        coinflip.methods.flip(guess).send(config)
        //set queryId to state
        .on('receipt', function(receipt){
            setSentQueryId(receipt.events.sentQueryId.returnValues[1])
            setAwaitingCallbackResponse(true)
        })
    }

    //watching contract events for callback

    useEffect(() => {
        if(awaitingCallbackResponse){
            coinflip.events.callbackReceived({
                fromBlock: 'latest'
            }, function(error, event){ if(event.returnValues[0] === sentQueryId){
                if(event.returnValues[1] === 'Winner'){
                    setOutcomeMessage('You Won ' + web3.utils.fromWei(event.returnValues[2]) + ' ETH!')
                    loadWinningsBalance(userAddress)
                    loadContractBalance()
                } else {
                    setOutcomeMessage('You lost ' + web3.utils.fromWei(event.returnValues[2]) + ' ETH...')
                    loadWinningsBalance(userAddress)
                    loadContractBalance()
                }
            } setAwaitingCallbackResponse(false) })
            setSentQueryId('')
        }
    }, [awaitingCallbackResponse, 
        sentQueryId, 
        contractBalance, 
        loadContractBalance, 
        loadWinningsBalance, 
        setAwaitingCallbackResponse, 
        setSentQueryId, 
        userAddress])


    //
    //set owner functions
    //

    const fundContract = (x) => {
        let fundAmt = x
        let config = {
            value: web3.utils.toWei(fundAmt, 'ether'),
            from: userAddress
        }
        coinflip.methods.fundContract().send(config)
        .once('receipt', function(receipt){
            loadContractBalance()
            loadUserBalance(userAddress)
        })
    }

    const fundWinnings = (x) => {
        let fundAmt = x
        let config = {
            value: web3.utils.toWei(fundAmt, 'ether'),
            from: userAddress
        }
        coinflip.methods.fundWinnings().send(config)
        .once('receipt', function(receipt){
            loadWinningsBalance(userAddress)
            loadUserBalance(userAddress)
        })
    }

    const withdrawAll = () => {
        var balance = contractBalance
        coinflip.methods.withdrawAll().send(balance, {from: userAddress})
        .on('receipt', function(receipt){
            loadContractBalance()
            loadUserBalance(userAddress)
        })
    }

    //user withdraw function
    const withdrawUserWinnings = () => {
        var balance = winningsBalance
        coinflip.methods.withdrawUserWinnings().send(balance, {from: userAddress})
        setAwaitingWithdrawal(true)
    }

    //waiting to display success and amount of withdrawal
    useEffect(() => {
        if(awaitingWithdrawal === true){
            coinflip.events.userWithdrawal({
                fromBlock:'latest'
            }, function(error, event){ if(event.returnValues[0] === userAddress){
                setOutcomeMessage(web3.utils.fromWei(event.returnValues[1]) + ' ETH Successfully Withdrawn')
                loadWinningsBalance()
                loadUserBalance(userAddress)
                }
            })
            setAwaitingWithdrawal(false)    
        }
    }, [awaitingWithdrawal, winningsBalance, userBalance, userAddress, loadUserBalance, loadWinningsBalance, setAwaitingWithdrawal])


    //
    //display message to user after withdrawals and oracle callbacks 
    //
    useEffect(() => {
        if(outcomeMessage !== ''){
            setModalIsOpen(true)
        }
        return
    }, [outcomeMessage])

    //reset modal and message variable after closing modal
    const modalMessageReset = () => {
        setModalIsOpen(false)
        setOutcomeMessage('')
    }


    return (
        <div>
            <NavBar />
            <ModalWindow open={modalIsOpen}
                onClose={() => modalMessageReset()
                }>
                {outcomeMessage}
            </ModalWindow>
            <AlignContent>
                <AlignQuarter>
                    <Directions />
                </AlignQuarter>
                <AlignHalf>
                    <ContractBalance />
                    <MainCard 
                        withdrawUserWinnings={withdrawUserWinnings}
                        flipCoin={flip}
                    />    
                </AlignHalf>
                <AlignQuarter>
                    <OwnerScreen 
                        fundContract={fundContract}
                        fundWinnings={fundWinnings}
                        withdrawAll={withdrawAll}
                    />
                </AlignQuarter>
            </AlignContent>
        </div>
    )
}

