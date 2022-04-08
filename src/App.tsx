import "./App.css";
import "decentraland-ui/lib/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "pages/Home";
import Transfer from "pages/Transfer";
import Web3Context from "contexts/Web3Context";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useWallet from "hooks/useWallet";
import History from "pages/History";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const wallet = useWallet();
  const [isConnected, setIsConnected] = useState<Boolean>(false);

  function updateProvider(provider: ethers.providers.Web3Provider) {
    setProvider(provider);
  }

  useEffect(() => {
    setComponentData();
  }, []);

  async function setComponentData() {
    const isConnected = await wallet.isConnected();
    setIsConnected(isConnected);

    if (isConnected) {
      getProvider();
    }
  }
  async function getProvider() {
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      setProvider(provider);
    } catch (err) {
      console.log("There was an error when getting provider");
    }
  }

  return (
    <Web3Context.Provider value={{ provider, updateProvider }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/transfer" element={<Transfer />}></Route>
            <Route path="/history" element={<History />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Web3Context.Provider>
  );
}

export default App;
