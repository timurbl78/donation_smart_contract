import React, { FC, ReactNode, useEffect, useState } from "react";
// @ts-ignore
import { ethers } from 'ethers';

import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/constants";

export const TransactionContext = React.createContext<{
    connectWallet?: () => Promise<void>;
    currentAccount?: string;
    sendTransaction?: (amount: string) => Promise<void>;
    totalDonations?: string;
    withdraw?: () => Promise<void>;
    isWithdrawLoading?: boolean;
    isDonationLoading?: boolean;
}>({});

// @ts-ignore
const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    console.log(transactionsContract);

    return transactionsContract;
}

const getProvider = () => {
    return new ethers.providers.Web3Provider(ethereum);
}

export interface TransactionProviderProps {
    children: ReactNode;
}

export const TransactionProvider: FC<TransactionProviderProps> = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [totalDonations, setTotalDonations] = useState('');
    const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
    const [isDonationLoading, setIsDonationLoading] = useState(false);

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                return alert("Please install metamask");
            }
    
            const accounts = await ethereum.request({ method: 'eth_accounts' });
    
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log('no accounts found');
            }
    
            console.log(accounts);
        } catch (err) {
            console.log(err);

            throw new Error("No ethereum object.");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                return alert("Please install metamask");
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err);

            throw new Error("No ethereum object.");
        }
    }

    const sendTransaction = async (amount: string) => {
        try {
            const transactionContract = getEthereumContract();
            const provider = getProvider();
            const parsedAmount = ethers.utils.parseEther(amount);
           
            const data = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("donate()"))

            setIsDonationLoading(true);

            const transactionHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: transactionContract.address,
                    // gas: '0x5208',
                    value: parsedAmount._hex,
                    data: data,
                }]
            });

            await provider.waitForTransaction(transactionHash);

            setIsDonationLoading(false);

            getTotalDonations();
        } catch (err) {
            setIsDonationLoading(false);
            console.log(err);
        }
    }

    const withdraw = async () => {
        try {
            const transactionContract = getEthereumContract();
    
            setIsWithdrawLoading(true);
            const transactionHash = await transactionContract.withdrawAll();
    
            console.log('transactionHash: ', transactionHash);
    
            await transactionHash.wait();
    
            setIsWithdrawLoading(false);
    
            getTotalDonations();
        } catch (err) {
            setIsWithdrawLoading(false);
        }
    }

    const getTotalDonations = async () => {
        const transactionContract = getEthereumContract();
        const totalDonations = await transactionContract.getTotalDonations();
        const eths = ethers.utils.formatEther(totalDonations._hex);

        setTotalDonations(eths.toString());
    }

    useEffect(() => {
        checkIfWalletIsConnected();

        getTotalDonations();
    }, []);

    console.log('totalDonations: ', totalDonations);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, sendTransaction, totalDonations, withdraw, isWithdrawLoading, isDonationLoading }}>
            {children}
        </TransactionContext.Provider>
    )
};

