import { useState } from "react";
import { getAddress } from "../slices/userInfoSlice";
import { useAppDispatch } from "./useAppDispatch";
import ethers from "ethers";

export default function useWallet() {
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState<string>();

  async function getWalletAddress(provider: ethers.providers.Web3Provider) {
    try {
      const signer: ethers.ethers.providers.JsonRpcSigner =
        provider?.getSigner();

      const address: string | undefined = await signer?.getAddress();
      setAddress(address);
      dispatch(getAddress(address));
    } catch (e) {
      console.log(e);
    }
  }

  async function isConnected(): Promise<Boolean> {
    try {
      if (!window.ethereum) return false;
      const addressArray: String[] = await window.ethereum.request({
        method: "eth_accounts",
      });

      return addressArray.length > 0;
    } catch (err) {
      return false;
    }
  }

  return { address, getWalletAddress, isConnected };
}
