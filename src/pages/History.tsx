import { useContext, useEffect, useState } from "react";
import { Page, Table } from "decentraland-ui";
import useWallet from "hooks/useWallet";
import { ethers } from "ethers";
import { useAppSelector } from "hooks/useAppSelector";
import { Link } from "react-router-dom";
import Web3Context from "contexts/Web3Context";

function History() {
  
  const address = '0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD'
  
  const web3Provider = useContext(Web3Context);
  const wallet = useWallet();
  const userInfo = useAppSelector((state) => state.userInfo);

  const [transactions, setTransactions] = useState<ethers.providers.TransactionResponse[]>([])

  useEffect(() => {
    setComponentData();
  }, [userInfo, web3Provider.provider]);

  async function setComponentData() {
    const isConnected: Boolean = await wallet.isConnected();
    if (isConnected && web3Provider?.provider && userInfo) {
      wallet.getWalletAddress(web3Provider.provider);
      getInteractions()
    }
  }

  function getInteractions() {
    let etherscanProvider = new ethers.providers.EtherscanProvider('kovan');

    etherscanProvider.getHistory(userInfo?.address, '',).then((history) => {
        setTransactions(history.filter(transation => transation.to === address))
    });
  }

  return (
    <>
      <div className="Page-story-container">
        <Page>
          <Link to="/transfer">Go To Transfer</Link>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Block</Table.HeaderCell>
                <Table.HeaderCell>From</Table.HeaderCell>
                <Table.HeaderCell>To</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactions.map((history, index) => {
                return (
                    <Table.Row key={index}>
                      <Table.Cell>{ history.blockNumber }</Table.Cell>
                      <Table.Cell>{ history.from }</Table.Cell>
                      <Table.Cell>{ history.to }</Table.Cell>
                      <Table.Cell >{history.value.toHexString()}</Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
        </Page>
      </div>
    </>
  );
}

export default History;
