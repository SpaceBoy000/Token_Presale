import { PublicKey } from "@solana/web3.js";

export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED";
export const USER_STATE_SEED = "USER_STATE_SEED";
export const VAULT_SEED = "VAULT_SEED";

export const PROGRAM_ID = new PublicKey("HkVtPgDgQZQKSuP75iBdU9Z9FJ2umaEZDZhAB5PY8gqZ");

export const STAKING_POOL = new PublicKey("4FiqZxGqcdL4SpTrhJH5CGnLcivwLeL3mBxSJ4sZm8Rm");

export const BORBI = new PublicKey("EmbMz7GLTV7VqyJYpjFCg8hAfa6QUvMVcWbr9KFonqr4");
export const Authority = new PublicKey("GfZNF2waJ736UYnU3mDs4xfxcN3HwDSdQ7RKR7gQeGN1");

export const DECIMALS = 9;


export const FRENS = new PublicKey("bX2RqUe4zzAtn83AzgdKt5P4bUpF8mzN4y6pBK8ZW6p");
// export const FRENS_SOL = new PublicKey("6MdurmGSwFbFkv9XuMkAWZkkHFjucQjvo44mzahQnq9L");
// export const FRENS_USDT = new PublicKey("FGkK9tMVwyBeZGADLjHKALe4dfHBGvyN5sBSmX76d5jR");
// export const FRENS_USDC = new PublicKey("5XWVtGRFRPceGFNoVTtK6XiuzMEGNxB53ULpacTiYSCd");

// todo: for test, it is now one hour
// export const DAY_IN_MS = 3600 * 1000;
export const DAY_IN_MS = 3600 * 24 * 1000;
export const DAY_IN_SECS = 3600 * 24;
export const HOUR_IN_SECS = 3600;
export const MIN_IN_SECS = 60;
// minimum amount to deposit
// should mul 10**decimals here to get real minimum
export const DEPOSIT_MINIMUM_AMOUNT = 100;
// tier starts from 0
export const DEFAULT_MAX_TIER = 2;

export const CLAIM_AMOUNT_PER_DAY = 1000;
export const FRENS_DECIMALS = 8;
export const AIRDROP_START_DATE = 1704844800; // 1/10 0h0m0s
export const VESTING_PROGRAM_ID = new PublicKey("382ToJvUzby6eQffVHuPoeva9XhyANKNfuvzgBn6MxV5");