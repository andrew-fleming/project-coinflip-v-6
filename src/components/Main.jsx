import React, { useState, useEffect } from 'react'
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
const contractAddress = '0x9467766E6F60e10009cacDE771c3158fA6ACE69F'
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
        sentQueryId,
        setSentQueryId,
        awaitingCallbackResponse,
        setAwaitingCallbackResponse,
        awaitingWithdrawal,
        setAwaitingWithdrawal,
    } = useContract();


    //app state necessary only in this component hence no 'AppContext'
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [outcomeMessage, setOutcomeMessage] = useState('');
   
    //
    //functions necessary to fetch onchain data and user info
    //

    const loadUserAddress = async() => {
        let accounts = await web3.eth.getAccounts()
        let account = accounts[0]
        return account
    }

    const loadContractBalance = async() => {
        let balance = await coinflip.methods.contractBalance().call()
        setContractBalance(web3.utils.fromWei(balance))
    }

    const loadUserBalance = async(user) => {
        let userBal = await web3.eth.getBalance(user)
        setUserBalance(Number.parseFloat(web3.utils.fromWei(userBal)).toPrecision(3))
    }

    const loadWinningsBalance = async(userAdd) => {
        let config = {from: userAdd}
        let bal = await coinflip.methods.getWinningsBalance().call(config)
        setWinningsBalance(Number.parseFloat(web3.utils.fromWei(bal)).toPrecision(3));
    }

    const loadOwner = async() => {
        let theOwner = await coinflip.methods.owner().call()
        setOwner(theOwner)
        return theOwner
    }

    const checkOwner = (add, own) => {
        if(add === own){
            setIsOwner(true)
        } else {
            setIsOwner(false)
        }
    }

    
    //
    //initialization
    //

    const componentDidMount = async() => {
        await loadUserAddress().then(response => {
            setUserAddress(response)
            loadUserBalance(response)
            loadWinningsBalance(response)
            .then(loadOwner().then(response => {
                setOwner(response)
                const ownerAdd = response
                loadUserAddress().then(response => {
                    checkOwner(ownerAdd, response)
                })
            }))
            })
            await loadContractBalance()
    }


    //watching for initialization^
    useEffect(() => {
        if(userAddress.length === 0){
            componentDidMount()
        }
    })

    
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
    }, [awaitingWithdrawal, winningsBalance, userBalance, userAddress])


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

