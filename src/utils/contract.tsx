import { ethers } from "ethers";

export function getContractData(
  address: string,
  abi: ethers.ContractInterface,
  provider: ethers.providers.Web3Provider
) {
  if (!address || !abi || !provider) return;

  const contract = new ethers.Contract(address, abi, provider?.getSigner());
  return contract;
}
