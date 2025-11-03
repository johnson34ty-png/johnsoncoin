# JohnsonBit (JBIT)

A minimal fungible token implemented in Clarity using Clarinet.

- Name: JohnsonBit
- Symbol: JBIT
- Decimals: 6
- Features: self-mint (only to your own address), transfer, read-only getters for name, symbol, decimals, total supply, and balances.

## Prerequisites
- Clarinet installed (check with `clarinet --version`).

If you need to install Clarinet, see official docs: https://docs.hiro.so/clarinet

## Project layout
- `contracts/johnsonbit.clar`: Token smart contract
- `tests/johnsonbit.test.ts`: Test scaffold (add tests here)
- `Clarinet.toml`, `settings/`: Clarinet configuration

## Common commands
- Check contracts:
  ```bash
  clarinet check
  ```
- Run tests:
  ```bash
  npm install
  npm test
  ```
- Open a REPL:
  ```bash
  clarinet console
  ```

## Contract interface
- `transfer(amount uint, sender principal, recipient principal) -> (response bool uint)`
- `mint(amount uint, to principal) -> (response bool uint)` (caller must equal `to`)
- `get-name() -> (string-ascii ...)`
- `get-symbol() -> (string-ascii ...)`
- `get-decimals() -> uint`
- `get-total-supply() -> uint`
- `get-balance(who principal) -> uint`

## Notes
This contract is intentionally simple and does not implement SIP-010. If you want SIP-010 compliance (recommended for production), I can add the trait and adjust the interfaces accordingly. We can also add an explicit owner/admin with restricted minting if you prefer.
