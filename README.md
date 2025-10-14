# JohnsonCoin (JOHN)

JohnsonCoin is a SIP-010 compliant fungible token built on the Stacks blockchain. This repository contains the smart contract implementation and testing infrastructure for the JOHN token.

## Token Details

- **Name**: JohnsonCoin
- **Symbol**: JOHN
- **Decimals**: 6
- **Total Supply**: 1,000,000,000 JOHN (1 billion tokens)
- **Standard**: SIP-010 (Stacks Improvement Proposal)

## Features

- ✅ SIP-010 compliant fungible token
- ✅ Standard transfer functionality
- ✅ Minting capabilities (owner only)
- ✅ Burning functionality
- ✅ Ownership transfer
- ✅ Token URI management
- ✅ Comprehensive error handling

## Smart Contract Functions

### SIP-010 Standard Functions

- `transfer(amount, from, to, memo)` - Transfer tokens between accounts
- `get-name()` - Returns the token name
- `get-symbol()` - Returns the token symbol
- `get-decimals()` - Returns the number of decimals
- `get-balance(who)` - Returns the balance of an account
- `get-total-supply()` - Returns the total token supply
- `get-token-uri()` - Returns the token metadata URI

### Additional Functions

- `mint(amount, to)` - Mint new tokens (owner only)
- `burn(amount, from)` - Burn tokens from an account
- `set-token-uri(value)` - Set token metadata URI (owner only)
- `transfer-ownership(new-owner)` - Transfer contract ownership
- `get-contract-owner()` - Get current contract owner

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Stacks smart contract development tool
- [Node.js](https://nodejs.org/) - For running tests
- [Stacks CLI](https://github.com/hirosystems/stacks.js) - For blockchain interactions

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/johnsoncoin.git
cd johnsoncoin
```

2. Install dependencies:
```bash
npm install
```

### Development

#### Check Contract Syntax
```bash
clarinet check
```

#### Run Tests
```bash
npm test
```

#### Start Local Development Environment
```bash
clarinet integrate
```

### Deployment

#### Deploy to Testnet
1. Configure your testnet settings in `settings/Testnet.toml`
2. Deploy the contract:
```bash
clarinet publish --testnet
```

#### Deploy to Mainnet
1. Configure your mainnet settings in `settings/Mainnet.toml`
2. Deploy the contract:
```bash
clarinet publish --mainnet
```

## Contract Architecture

### Error Codes
- `u100` - ERR_OWNER_ONLY: Function restricted to contract owner
- `u101` - ERR_NOT_TOKEN_OWNER: Caller not authorized for token operation
- `u102` - ERR_INSUFFICIENT_BALANCE: Insufficient token balance
- `u103` - ERR_INVALID_AMOUNT: Invalid amount (must be > 0)

### Security Features

- Owner-only functions protected by access control
- Input validation for all public functions
- Safe arithmetic operations
- Proper error handling and reporting

## Usage Examples

### Transfer Tokens
```clarity
(contract-call? .johnsoncoin transfer u1000000 tx-sender 'SP1ABCD...EFGH none)
```

### Check Balance
```clarity
(contract-call? .johnsoncoin get-balance 'SP1ABCD...EFGH)
```

### Mint Tokens (Owner Only)
```clarity
(contract-call? .johnsoncoin mint u500000000 'SP1ABCD...EFGH)
```

### Burn Tokens
```clarity
(contract-call? .johnsoncoin burn u100000 tx-sender)
```

## Testing

The project includes comprehensive test coverage for all contract functions:

- Transfer functionality tests
- Access control tests
- Error condition tests
- Edge case handling

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

This smart contract has been developed following security best practices. However, it has not been formally audited. Use at your own risk in production environments.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Disclaimer**: This is experimental software. Use at your own risk.
 
