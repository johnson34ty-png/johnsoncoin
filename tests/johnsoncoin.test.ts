import { describe, expect, it } from "vitest";

// Test constants
const CONTRACT_NAME = 'johnsoncoin';
const TOTAL_SUPPLY = 1000000000000000; // 1 billion tokens with 6 decimals
const TOKEN_NAME = 'JohnsonCoin';
const TOKEN_SYMBOL = 'JOHN';
const TOKEN_DECIMALS = 6;

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("JohnsonCoin Contract Tests", () => {
  it("ensures simnet is well initialised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });
  it("ensures simnet is well initialised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  describe("Contract Initialization", () => {
    it("should have correct token metadata", () => {
      const { result: name } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-name", [], deployer);
      expect(name).toBeOk(Cl.stringAscii(TOKEN_NAME));

      const { result: symbol } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-symbol", [], deployer);
      expect(symbol).toBeOk(Cl.stringAscii(TOKEN_SYMBOL));

      const { result: decimals } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-decimals", [], deployer);
      expect(decimals).toBeOk(Cl.uint(TOKEN_DECIMALS));
    });

    it("should have correct initial supply and deployer balance", () => {
      const { result: totalSupply } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-total-supply", [], deployer);
      expect(totalSupply).toBeOk(Cl.uint(TOTAL_SUPPLY));

      const { result: deployerBalance } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-balance", [Cl.principal(deployer)], deployer);
      expect(deployerBalance).toBeOk(Cl.uint(TOTAL_SUPPLY));
    });

    it("should have deployer as contract owner", () => {
      const { result: owner } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-contract-owner", [], deployer);
      expect(owner).toBeOk(Cl.principal(deployer));
    });
  });

  describe("Transfer Function", () => {
    it("should successfully transfer tokens", () => {
      const transferAmount = 1000000; // 1 JOHN token
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "transfer",
        [Cl.uint(transferAmount), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check balances after transfer
      const { result: deployerBalance } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-balance", [Cl.principal(deployer)], deployer);
      expect(deployerBalance).toBeOk(Cl.uint(TOTAL_SUPPLY - transferAmount));

      const { result: wallet1Balance } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-balance", [Cl.principal(wallet1)], wallet1);
      expect(wallet1Balance).toBeOk(Cl.uint(transferAmount));
    });

    it("should fail when unauthorized user tries to transfer", () => {
      const transferAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "transfer",
        [Cl.uint(transferAmount), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        wallet2 // wallet2 trying to transfer from deployer
      );
      expect(result).toBeErr(Cl.uint(101)); // ERR_NOT_TOKEN_OWNER
    });

    it("should fail when transfer amount is zero", () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "transfer",
        [Cl.uint(0), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        deployer
      );
      expect(result).toBeErr(Cl.uint(103)); // ERR_INVALID_AMOUNT
    });
  });

  describe("Mint Function", () => {
    it("should allow owner to mint tokens", () => {
      const mintAmount = 500000000; // 500 JOHN tokens
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check new balance and total supply
      const { result: wallet1Balance } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-balance", [Cl.principal(wallet1)], wallet1);
      const { result: totalSupply } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-total-supply", [], deployer);
      
      expect(wallet1Balance).toBeOk(Cl.uint(mintAmount));
      expect(totalSupply).toBeOk(Cl.uint(TOTAL_SUPPLY + mintAmount));
    });

    it("should prevent non-owner from minting tokens", () => {
      const mintAmount = 500000000;
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet2)],
        wallet1 // non-owner trying to mint
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY
    });

    it("should fail when mint amount is zero", () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "mint",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(103)); // ERR_INVALID_AMOUNT
    });
  });

  describe("Burn Function", () => {
    it("should allow token holder to burn their tokens", () => {
      const transferAmount = 2000000; // 2 JOHN tokens
      const burnAmount = 1000000; // 1 JOHN token
      
      // First transfer some tokens to wallet1
      simnet.callPublicFn(
        CONTRACT_NAME,
        "transfer",
        [Cl.uint(transferAmount), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        deployer
      );

      // Now burn some tokens
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "burn",
        [Cl.uint(burnAmount), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check balance after burn
      const { result: wallet1Balance } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-balance", [Cl.principal(wallet1)], wallet1);
      const { result: totalSupply } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-total-supply", [], deployer);
      
      expect(wallet1Balance).toBeOk(Cl.uint(transferAmount - burnAmount));
      expect(totalSupply).toBeOk(Cl.uint(TOTAL_SUPPLY - burnAmount));
    });

    it("should prevent unauthorized user from burning tokens", () => {
      const burnAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "burn",
        [Cl.uint(burnAmount), Cl.principal(deployer)],
        wallet2 // wallet2 trying to burn from deployer
      );
      expect(result).toBeErr(Cl.uint(101)); // ERR_NOT_TOKEN_OWNER
    });

    it("should fail when burn amount is zero", () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "burn",
        [Cl.uint(0), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(103)); // ERR_INVALID_AMOUNT
    });
  });

  describe("Token URI Functions", () => {
    it("should allow owner to set token URI", () => {
      const tokenUri = 'https://example.com/johnsoncoin-metadata.json';
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "set-token-uri",
        [Cl.some(Cl.stringUtf8(tokenUri))],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Verify URI was set
      const { result: uri } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-token-uri", [], deployer);
      expect(uri).toBeOk(Cl.some(Cl.stringUtf8(tokenUri)));
    });

    it("should prevent non-owner from setting token URI", () => {
      const tokenUri = 'https://example.com/johnsoncoin-metadata.json';
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "set-token-uri",
        [Cl.some(Cl.stringUtf8(tokenUri))],
        wallet1 // non-owner trying to set URI
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY
    });
  });

  describe("Ownership Transfer", () => {
    it("should allow owner to transfer ownership", () => {
      // Transfer ownership to wallet1
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "transfer-ownership",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Verify new owner
      const { result: newOwner } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-contract-owner", [], wallet1);
      expect(newOwner).toBeOk(Cl.principal(wallet1));

      // Verify old owner cannot mint anymore
      const { result: mintResult } = simnet.callPublicFn(
        CONTRACT_NAME,
        "mint",
        [Cl.uint(1000000), Cl.principal(deployer)],
        deployer
      );
      expect(mintResult).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY

      // Verify new owner can mint
      const { result: newMintResult } = simnet.callPublicFn(
        CONTRACT_NAME,
        "mint",
        [Cl.uint(1000000), Cl.principal(deployer)],
        wallet1
      );
      expect(newMintResult).toBeOk(Cl.bool(true));
    });

    it("should prevent non-owner from transferring ownership", () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        "transfer-ownership",
        [Cl.principal(wallet2)],
        wallet1 // wallet1 is not the owner initially
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY
    });
  });

  describe("Balance and Supply Queries", () => {
    it("should return zero balance for accounts with no tokens", () => {
      const { result } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-balance", [Cl.principal(wallet2)], wallet2);
      expect(result).toBeOk(Cl.uint(0));
    });

    it("should return correct token URI when not set", () => {
      const { result } = simnet.callReadOnlyFn(CONTRACT_NAME, "get-token-uri", [], deployer);
      expect(result).toBeOk(Cl.none());
    });
  });
});
});
