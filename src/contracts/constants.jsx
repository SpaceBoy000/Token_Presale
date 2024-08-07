import { PublicKey } from "@solana/web3.js";

export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED";
export const USER_STATE_SEED = "USER_STATE_SEED";
export const VAULT_SEED = "VAULT_SEED";

export const PROGRAM_ID = new PublicKey("5SjYRFKqjkxeHKYFDD8GgZoXZUzYW87iQQe1jb1waxPw");

export const STAKING_POOL = new PublicKey("4FiqZxGqcdL4SpTrhJH5CGnLcivwLeL3mBxSJ4sZm8Rm");

export const BORBI = new PublicKey("4uA3437vPHGxALwkJjaLX9rN2jrZSsXqQf4m3oESW7kp");
export const Authority = new PublicKey("D8FzQonjEyK2rc14pHMaX2JHWLTdwD7cPj1bnUfytfz8");

export const DECIMALS = 9;


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
