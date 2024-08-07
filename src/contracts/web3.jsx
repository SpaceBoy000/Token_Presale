import * as anchor from "@project-serum/anchor";
import * as Constants from "./constants";
import { IDL } from "./idl";
import { toast } from "react-toastify";
import * as keys from "./keys";
import BN from "bn.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import config from "../config";

import {
    Connection,
    Transaction,
    clusterApiUrl,
    SystemProgram,
    Keypair,
    PublicKey,
    SYSVAR_CLOCK_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";

import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    createAssociatedTokenAccountInstruction,
    getAccount
} from "@solana/spl-token"

// const connection = new Connection(clusterApiUrl("devnet"));
const connection = new Connection("https://dry-late-model.solana-mainnet.quiknode.pro/cb64f8ce1bde3fc9eb832bbfde2acffd6093875f");

export const getProgram = (wallet) => {
    let provider = new anchor.AnchorProvider(
        connection,
        wallet,
        anchor.AnchorProvider.defaultOptions()
    );
    const program = new anchor.Program(IDL, Constants.PROGRAM_ID, provider);
    return program;
};

export const web3_initialize = async (wallet) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    const program = getProgram(wallet);

    const global_state = await keys.getGlobalStateKey();
    console.log("global_state: ", global_state.toBase58());
    // const user_state = await keys.getUserKey();
    const sol_vault = await keys.getVaultKey();
    const token_vault = await keys.getAssociatedTokenAccount(global_state, Constants.BORBI);
    console.log("token_vault: ", token_vault.toBase58());

    const tx = new Transaction().add(
        await program.methods
            .initialize(new PublicKey(config.authority), new anchor.BN(config.tokenPrice))
            .accounts({
                authority: wallet.publicKey,
                globalState: global_state,
                // userState: user_state,
                vault: sol_vault,
                tokenVault: token_vault,
                tokenMint: Constants.BORBI,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            })
            .instruction()
    )
    return await send(connection, wallet, tx)
}

export const web3_start_sale = async (wallet) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    const program = getProgram(wallet);

    const global_state = await keys.getGlobalStateKey();

    const tx = new Transaction().add(
        await program.methods
            .startSale()
            .accounts({
                authority: wallet.publicKey,
                globalState: global_state,
            })
            .instruction()
    )
    return await send(connection, wallet, tx)
}

export const web3_fund_tokens = async (wallet, tokenAmount) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    const program = getProgram(wallet);

    const global_state = await keys.getGlobalStateKey();
    console.log("global_state: ", global_state.toBase58());
    // const user_state = await keys.getUserKey();
    const sol_vault = await keys.getVaultKey();
    const token_vault = await keys.getAssociatedTokenAccount(global_state, Constants.BORBI);
    const user_vault = await keys.getAssociatedTokenAccount(wallet.publicKey, Constants.BORBI);
    console.log("token_vault: ", token_vault.toBase58());

    const tx = new Transaction().add(
        await program.methods
            .fundToken(new anchor.BN(tokenAmount * Math.pow(10, Constants.DECIMALS)))
            .accounts({
                authority: wallet.publicKey,
                state: global_state,
                tokenVault: token_vault,
                userVault: user_vault,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .instruction()
    )
    return await send(connection, wallet, tx)
}

export const web3_buy = async (wallet, sol_amount) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    const program = getProgram(wallet);

    const global_state = await keys.getGlobalStateKey();
    const sol_vault = await keys.getVaultKey();
    const user_state = await keys.getUserStateKey(wallet.publicKey);

    const token_vault = await keys.getAssociatedTokenAccount(global_state, Constants.BORBI);
    const user_vault = await keys.getAssociatedTokenAccount(wallet.publicKey, Constants.BORBI);

    const tx = new Transaction();

    // Create an instruction to create the receiver's token account if it does not exist
    const createAccountInstruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        user_vault,
        wallet.publicKey,
        Constants.BORBI,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    )

    // Check if the receiver's token account exists
    let receiverTokenAccount;
    try {
        receiverTokenAccount = await getAccount(
            connection,
            user_vault,
            "confirmed",
            TOKEN_PROGRAM_ID
        )
        console.log("receiverTokenAccount: ", receiverTokenAccount);
    } catch (e) {
        console.error("getATA Error: ", e);
        // If the account does not exist, add the create account instruction to the transaction
        tx.add(createAccountInstruction)
    }

    tx.add(
        await program.methods
            .buy(new anchor.BN(sol_amount * LAMPORTS_PER_SOL))
            .accounts({
                user: wallet.publicKey,
                globalState: global_state,
                vault: sol_vault,
                userState: user_state,
                tokenVault: token_vault,
                userVault: user_vault,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            })
            .instruction()
    )
    return await send(connection, wallet, tx)
}

export const web3_withdraw = async (wallet) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    const program = getProgram(wallet);

    const global_state = await keys.getGlobalStateKey();
    console.log("global_state: ", global_state.toBase58());
    // const user_state = await keys.getUserKey();
    const sol_vault = await keys.getVaultKey();
    const token_vault = await keys.getAssociatedTokenAccount(global_state, Constants.BORBI);
    console.log("token_vault: ", token_vault.toBase58());

    const tx = new Transaction().add(
        await program.methods
            .withdraw()
            .accounts({
                authority: wallet.publicKey,
                globalState: global_state,
                // userState: user_state,
                vault: sol_vault,
                to: wallet.publicKey,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            })
            .instruction()
    );

    return await send(connection, wallet, tx);
}

// export const getWalletSolBalance = async (walletPubkey) => {
//     return new BigNumber(await connection.getBalance(walletPubkey)).div(
//         LAMPORTS_PER_SOL
//     ).toString();
// };

export const getContractBalance = async () => {
    // const global_state = await keys.getGlobalStateKey();
    const sol_vault = await keys.getVaultKey();

    return Number(await connection.getBalance(sol_vault)) / LAMPORTS_PER_SOL;
};

export const createState = async (wallet, tokenMint) => {

    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    const program = getProgram(wallet);

    const tokenPerSecond = 1;       // todo
    const state = await keys.getGlobalStateKey();
    console.log('state = ', state.toBase58())

    let rewardVault = await keys.getAssociatedTokenAccount(state, tokenMint);
    console.log('rewardVault = ', rewardVault.toBase58())


    const tx = new Transaction().add(
        await program.methods
            .createState(new BN(tokenPerSecond))
            .accounts({
                authority: wallet.publicKey,            // token owner
                state: state,  // 
                rewardVault: rewardVault,
                rewardMint: tokenMint,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                clock: SYSVAR_CLOCK_PUBKEY,
            })
            .instruction()
    )
    return await send(connection, wallet, tx)
}

async function getTokenBalanceWeb3(vault) {

    try {
        const info = await connection.getTokenAccountBalance(vault);
        if (!info.value.uiAmount) throw new Error('No balance found');
        return info.value.uiAmount;
    } catch (e) {
        // console.log(e);
        return 0;
    }
}

export async function getTotalStaked(tokenMint) {
    const pool = await keys.getPoolKey(tokenMint);
    const poolVault = await keys.getAssociatedTokenAccount(pool, tokenMint);
    return await getTokenBalanceWeb3(poolVault)
}

export async function send(connection, wallet, transaction) {
    const txHash = await sendTransaction(connection, wallet, transaction);
    if (txHash != null) {
        let confirming_id = showToast("Confirming Transaction ...", -1, 2);
        let res = await connection.confirmTransaction(txHash);
        console.log(txHash);
        toast.dismiss(confirming_id);
        if (res.value.err) showToast("Transaction Failed", 2000, 1);
        else showToast("Transaction Confirmed", 2000);
    } else {
        showToast("Transaction Failed", 2000, 1);
    }
    return txHash;
}

export async function sendTransaction(
    connection,
    wallet,
    transaction
) {
    if (wallet.publicKey === null || wallet.signTransaction === undefined)
        return null;
    try {
        transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;
        transaction.feePayer = wallet.publicKey;
        const signedTransaction = await wallet.signTransaction(transaction);
        const rawTransaction = signedTransaction.serialize();

        showToast("Sending Transaction ...", 500);
        // notify({
        //   message: "Transaction",
        //   description: "Sending Transaction ...",
        //   duration: 0.5,
        // });

        const txid = await connection.sendRawTransaction(
            rawTransaction,
            {
                skipPreflight: true,
                preflightCommitment: "processed",
            }
        );
        return txid;
    } catch (e) {
        console.log("tx e = ", e);
        return null;
    }
}

export const showToast = (txt, duration = 5000, ty = 0) => {
    let type = toast.TYPE.SUCCESS;
    if (ty === 1) type = toast.TYPE.ERROR;
    if (ty === 2) type = toast.TYPE.INFO;

    let autoClose = duration;
    if (duration < 0) {
        autoClose = false;
    }
    return toast.error(txt, {
        position: "bottom-right",
        autoClose,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        type,
        theme: "colored",
    });
};

export const getStateInitialized = async () => {
    try {

        const state = await keys.getGlobalStateKey();
        const accInfo = await connection.getAccountInfo(state)

        console.log('>>>>> Acc Info', accInfo);
        if (accInfo) {
            console.log('state is initialized');
            return true;
        }
        console.log('state is not initialized');
        return false;
    } catch (e) {
        return false;
    }
    return false;
}

export const getIsAdmin = async (wallet) => {
    try {
        const program = getProgram(wallet);
        const state = await program.account.stateAccount.all();
        const acc = state[0].account.authority;
        console.log(acc.toBase58())
        // console.log(state);
        if (wallet.publicKey.toString() === acc.toString()) {
            console.log('This is admin');
            return true;
        }
    } catch (e) {
        return false;
    }
    return false
}

export const getIsPoolInitialized = async (tokenMint) => {
    try {
        const pool = await keys.getPoolKey(tokenMint)
        if (await connection.getAccountInfo(pool)) {
            console.log('Pool is initialized : ', tokenMint.toBase58());
            return true;
        }
        console.log('Pool is not initialized', tokenMint.toBase58());
        return false;
    } catch (e) {
        return false;
    }
}
