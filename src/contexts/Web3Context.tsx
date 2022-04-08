import React from "react";
import { ethers } from "ethers";

interface IWeb3Context {
  provider: ethers.providers.Web3Provider | undefined;
  updateProvider: (provider: ethers.providers.Web3Provider) => void;
}

const defaultState = {
  provider: undefined,
  updateProvider: () => {},
};

const Web3Context = React.createContext<IWeb3Context>(defaultState);

export default Web3Context;
