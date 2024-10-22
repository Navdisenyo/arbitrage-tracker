# Crypto Arbitrage Tracker

This is a simple React app that allows users to track arbitrage opportunities between different decentralized exchanges (DEXs) for a specific ERC20 token on different blockchain networks. The app fetches token pair data and liquidity information using the Moralis Token Pairs API and finds price differences across exchanges.

## Features

- Fetch token pairs and liquidity for a specific ERC20 token on multiple networks (Ethereum, Binance Smart Chain, Polygon).
- Identify arbitrage opportunities by comparing prices across exchanges.
- Display detailed information about token pairs, including exchange names, prices, and liquidity.
- Built-in loading states with dynamic messages.

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- React (v17 or higher)
- A Moralis account to get an API key. You can sign up for a Moralis account [here](https://developers.moralis.com/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bharathbabu-moralis/crypto-arbitrage-tracker-moralis
   cd frontend
   ```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Moralis API key:
```bash
REACT_APP_MORALIS_API_KEY=your-moralis-api-key
```

4. Start the development server:
```bash
npm start
```

The app will be running at `http://localhost:3000`.


## Usage

- Enter the token contract address of the ERC20 token you want to track in the input field.
- Select the blockchain network from the dropdown
- Click on the "Find Arbitrage Opportunities" button to fetch token pair data and see if there are any arbitrage opportunities across exchanges.

## Token API Reference

This app uses the Moralis Web3 Token API to get token pairs and liquidity details. For more information, check out the official API documentation:

- [Get Token Pairs and Liquidity](https://docs.moralis.com/web3-data-api/evm/reference/token-api#get-token-pairs--liquidity)

## Learn More

- [Moralis Documentation](https://docs.moralis.com/)
- [Moralis Developer Portal](https://developers.moralis.com/)