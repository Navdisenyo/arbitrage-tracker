import React, { useState } from "react";
import Select from "react-select";
import "./App.css"; // Updated CSS

const App = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState([]);
  const [allTokenPairs, setAllTokenPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const networks = [
    { value: "eth", label: "Ethereum" },
    { value: "bsc", label: "Binance Smart Chain" },
    { value: "polygon", label: "Polygon" },
    { value: "base", label: "Base" },
    { value: "optimism", label: "Optimism" },
    { value: "arbitrum", label: "Arbitrum" },
  ];
  
  const getBlockExplorerUrl = (network) => {
    switch (network) {
      case "eth":
        return "https://etherscan.io/address/";
      case "bsc":
        return "https://bscscan.com/address/";
      case "polygon":
        return "https://polygonscan.com/address/";
      case "base":
        return "https://basescan.org/address/";
      case "optimism":
        return "https://optimistic.etherscan.io/address/";
      case "arbitrum":
        return "https://arbiscan.io/address/";
      default:
        return "https://etherscan.io/address/";
    }
  };
  

  const fetchArbitrageOpportunities = async () => {
    setLoading(true);
    setLoadingText("Fetching all token pair data...");
  
    try {
      const apiKey = process.env.REACT_APP_MORALIS_API_KEY;
      const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/pairs?chain=${network}`;
      
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "X-API-Key": apiKey,
        },
      });
      
      const data = await response.json();
      const pairs = data.pairs;
      setAllTokenPairs(pairs);
  
      setLoadingText("Finding possible arbitrage opportunities...");
  
      const groupedByPair = {};
      
      for (const pair of pairs) {
        if (pair.exchange_name) {
          const pairLabel = pair.pair_label;
          
          if (!groupedByPair[pairLabel]) {
            groupedByPair[pairLabel] = [];
          }
          
          groupedByPair[pairLabel].push(pair);
        }
      }
  
      const opportunities = [];
      
      for (const pairLabel in groupedByPair) {
        const exchanges = groupedByPair[pairLabel];
        
        exchanges.sort((a, b) => b.usd_price - a.usd_price);
  
        if (exchanges.length >= 2) {
          const highestPriceExchange = exchanges[0];
          const lowestPriceExchange = exchanges[exchanges.length - 1];
  
          const priceDifference = highestPriceExchange.usd_price - lowestPriceExchange.usd_price;
  
          opportunities.push({
            pairLabel,
            highestPriceExchange,
            lowestPriceExchange,
            priceDifference,
          });
        }
      }
  
      setArbitrageOpportunities(opportunities);
    } catch (error) {
      console.error("Error fetching arbitrage opportunities:", error);
    } finally {
      setLoading(false);
    }
  };
  


  const handleNetworkChange = (selectedOption) => {
    setNetwork(selectedOption.value);
  };

  return (
    <div className="app">
      <h1 className="title">Crypto Arbitrage Tracker</h1>
      <p style={{ textAlign: "center" }}>Built using Moralis Token Pairs API</p>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Token Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="token-input"
        />
        <Select
          options={networks}
          onChange={handleNetworkChange}
          placeholder="Select Network"
          className="network-select"
          styles={{
            control: (base) => ({
              ...base,
              fontSize: "1.1rem", // Set the font size here
            }),
            placeholder: (base) => ({
              ...base,
              fontSize: "1.1rem", // Set the placeholder font size
            }),
            singleValue: (base) => ({
              ...base,
              fontSize: "1.1rem", // Set the selected value font size
            }),
          }}
        />

        <button
          onClick={fetchArbitrageOpportunities}
          disabled={!tokenAddress || !network || loading}
          className="fetch-btn"
        >
          {loading ? "Loading..." : "Find Arbitrage Opportunities"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>{loadingText}</p>
        </div>
      )}

      {/* Arbitrage Opportunities */}
      {!loading && arbitrageOpportunities.length > 0 && (
        <div className="results">
          <h2>Arbitrage Opportunities</h2>
          {arbitrageOpportunities.map((opportunity, index) => (
            <div key={index} className="pair-info">
              <h3>{opportunity.pairLabel}</h3>
              <div className="exchange-details">
                <div className="exchange">
                  <h4>
                    Highest Price Exchange:{" "}
                    {opportunity.highestPriceExchange.exchange_name}
                  </h4>
                  <p>
                    Price: $
                    {opportunity.highestPriceExchange.usd_price.toFixed(6)}
                  </p>
                  <p>
                    Liquidity: $
                    {opportunity.highestPriceExchange.liquidity_usd.toLocaleString()}
                  </p>
                  <p>
                    Pair Address:{" "}
                    <a
                      href={`https://etherscan.io/address/${opportunity.highestPriceExchange.pair_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {opportunity.highestPriceExchange.pair_address}
                    </a>
                  </p>
                </div>
                <div className="exchange">
                  <h4>
                    Lowest Price Exchange:{" "}
                    {opportunity.lowestPriceExchange.exchange_name}
                  </h4>
                  <p>
                    Price: $
                    {opportunity.lowestPriceExchange.usd_price.toFixed(6)}
                  </p>
                  <p>
                    Liquidity: $
                    {opportunity.lowestPriceExchange.liquidity_usd.toLocaleString()}
                  </p>
                  <p>
                    Pair Address:{" "}
                    <a
                      href={`${getBlockExplorerUrl(network)}${
                        opportunity.highestPriceExchange.pair_address
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {opportunity.highestPriceExchange.pair_address}
                    </a>
                  </p>
                </div>
              </div>
              <p className="price-diff">
                Price Difference: ${opportunity.priceDifference.toFixed(6)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* All Token Pairs */}
      {!loading && allTokenPairs.length > 0 && (
        <div className="results">
          <h2>All Token Pairs</h2>
          {allTokenPairs.map((pair, index) => (
            <div key={index} className="pair-info">
              <h3>{pair.pair_label}</h3>
              <div className="exchange-details">
                <div className="exchange">
                  <h4>
                    Exchange: {pair.exchange_name ? pair.exchange_name : "N/A"}
                  </h4>
                  <p>Price: ${pair.usd_price.toFixed(6)}</p>
                  <p>Liquidity: ${pair.liquidity_usd.toLocaleString()}</p>
                  <p>
                    Pair Address:{" "}
                    <a
                      href={`${getBlockExplorerUrl(network)}${
                        pair.pair_address
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pair.pair_address}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer>
        <img
          src="https://moralis-portfolio-staging-f5f5e6cfeae8.herokuapp.com/images/Powered-by-Moralis-Badge-Text-Grey.svg"
          alt="Powered by Moralis"
          className="moralis-logo"
        />
      </footer>
    </div>
  );
};

export default App;
