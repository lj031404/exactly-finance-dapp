import { useContext, useEffect, useState } from "react";
import { Page } from "decentraland-ui";
import useWallet from "hooks/useWallet";
import { ethers } from "ethers";
import { useAppSelector } from "hooks/useAppSelector";
import { useAppDispatch } from "hooks/useAppDispatch";
import { getBalance } from "slices/userInfoSlice";

import WalletInfo from "components/WalletInfo";
import Web3Context from "contexts/Web3Context";
import MetamaskConnect from "components/MetamaskConnect";
import { getContractData } from "utils/contract";
import tokenData from "abi/token.json";

function Home() {
  const web3Provider = useContext(Web3Context);
  const wallet = useWallet();
  const userInfo = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();

  const [isConnected, setIsConnected] = useState<Boolean>(false);

  useEffect(() => {
    getWalletBalance();
  }, [userInfo]);

  useEffect(() => {
    setComponentData();
  }, [web3Provider.provider]);

  async function setComponentData() {
    const isConnected: Boolean = await wallet.isConnected();
    setIsConnected(isConnected);
    if (isConnected && web3Provider?.provider) {
      wallet.getWalletAddress(web3Provider.provider);
      getWalletBalance();
    }
  }

  async function getWalletBalance() {
    if (userInfo?.address) {
      const contract = await getContractData(
        tokenData.address,
        tokenData.abi,
        web3Provider.provider!
      );

      const balance: ethers.BigNumber = await contract?.balanceOf(
        userInfo.address
      );
      const parsedBalance: String = ethers.utils.formatUnits(balance, 0);
      dispatch(getBalance(parsedBalance));
    }
  }

  return (
    <>
      <div className="Page-story-container">
        <Page>{!isConnected ? <MetamaskConnect /> : <WalletInfo />}</Page>
      </div>
    </>
  );
}

export default Home;
