import { createContext, useMemo, useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { web3_buy, web3_start_sale } from "./web3"
import * as anchor from "@project-serum/anchor";

import {
  Connection,
  Transaction,
} from "@solana/web3.js";

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {

  const {txLoading, setTxLoading} = useState(false);
  const pending = false;
  const balance = 0;

  // const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = useWallet();

  // const program = useMemo(() => {
  //   let provider = new anchor.AnchorProvider(
  //     connection,
  //     wallet,
  //     anchor.AnchorProvider.defaultOptions()
  //   );
  //   return new anchor.Program(IDL, Constants.PROGRAM_ID, provider);
  // }, [wallet])

  const startSale = async() => {
    
    setTxLoading(true);

    try {

      await web3_start_sale();
    } catch (e) {
      
    }

    setTxLoading(false);

  }

  const buy = async (sol_amount) => {

    // setTxLoading(true);

    try {
      web3_buy(wallet, sol_amount );
    } catch (e) {
      console.log(e);
    }

    // setTxLoading(false)

  }


  const getStartPresaleTime = () => {

  }

  const getEndPresaleTime = () => {

  }

  const getTotalPresaleAmount = () => {

  }

  const getMaxPresaleCap = () => {

  }

  const getMinPresaleCap = () => {

  }

  const getpTokenPriceForBUSD = () => {

  }

  const getBNBForBUSD = () => {

  }

  const getBUSDForBNB = () => {

  }

  const getUserPaidBUSD = () => {

  }

  const buy_pToken = 0;

  const context = {
    pending,
    balance,
    getStartPresaleTime,
    getEndPresaleTime,
    getTotalPresaleAmount,
    getMaxPresaleCap,
    getMinPresaleCap,
    getpTokenPriceForBUSD,
    getBNBForBUSD,
    getBUSDForBNB,
    getUserPaidBUSD,
    buy_pToken
  }

  return <Web3Context.Provider value={context}>
    {children}
  </Web3Context.Provider>
}