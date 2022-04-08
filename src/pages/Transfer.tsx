import { useContext, useEffect, useState } from "react";
import {
  Button,
  Navbar,
  Page,
  Footer,
  Modal,
  Field,
  Toasts,
  Toast,
  ToastType,
} from "decentraland-ui";
import useWallet from "hooks/useWallet";
import { ethers } from "ethers";
import Web3Context from "contexts/Web3Context";
import MetamaskConnect from "components/MetamaskConnect";
import { getContractData } from "utils/contract";
import tokenData from "abi/token.json";
import { Link } from "react-router-dom";

interface ErrorField {
  amount?: boolean;
  recipient?: boolean;
}

function Transfer() {
  const web3Provider = useContext(Web3Context);
  const wallet = useWallet();

  const [recipient, setRecipient] = useState<string>();
  const [amount, setAmount] = useState<string>("0");
  const [isConnected, setIsConnected] = useState<Boolean>(false);
  const [contract, setContract] = useState<ethers.Contract>();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successfulTx, setSuccessfulTx] = useState<boolean>(false);
  const [formError, setFormError] = useState<ErrorField>({
    amount: false,
    recipient: false,
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setComponentData();
    setRecipient('0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD')
  }, [web3Provider.provider]);

  async function setComponentData() {
    const isConnected: Boolean = await wallet.isConnected();
    setIsConnected(isConnected);

    if (isConnected && web3Provider.provider) {
      try {
        const contractData: ethers.Contract | undefined = await getContractData(
          tokenData.address,
          tokenData.abi,
          web3Provider.provider
        );

        setContract(contractData);
      } catch (err: any) {
        setError(err.message);
      }
    }
  }

  async function handleClick() {
    setFormError({
      amount: false,
      recipient: false,
    });

    if (contract && !isSending) {
      if (recipient && amount) {
        try {
          setIsSending(true);
          const tx = await contract.transfer(recipient, amount);
          const txResult = await tx.wait();
          setSuccessfulTx(txResult.status == 1);
          setIsSending(false);
        } catch (err: any) {
          setError(err.message);
          setIsSending(false);
        }
      } else {
        setFormError({
          amount: !amount ? true : amount.length == 0,
          recipient: !recipient ? true : recipient.length == 0,
        });
      }
    }
  }

  function sanitizeAmount(value: string) {
    const validator = /^[0-9\b]+$/;
    if (validator.test(value) || value == "") {
      setAmount(value);
    } else {
      return;
    }
  }

  return (
    <>
      <Page>
        {!isConnected ? (
          <MetamaskConnect />
        ) : (
          <Modal size="small" open={true}>
            <Modal.Header>
              Transfer
            </Modal.Header>
            
            <Modal.Content>
              <Field
                name="amount"
                label="Amount"
                value={amount}
                onChange={(e: any) => sanitizeAmount(e.target.value)}
                error={!amount && formError.amount}
              />
              
              <Link to="/history">Go To History</Link>
            </Modal.Content>
            <Modal.Actions>
              <Button primary onClick={handleClick} loading={isSending}>
                Transfer
              </Button>
            </Modal.Actions>
            {successfulTx && (
              <Toasts position="top right">
                <Toast
                  type={ToastType.INFO}
                  title="Success"
                  body="Succesful transaction"
                  timeout={2}
                  onClose={() => setSuccessfulTx(false)}
                  closable
                />
              </Toasts>
            )}
          </Modal>
        )}
        {error && (
          <Toasts position="top right">
            <Toast
              type={ToastType.ERROR}
              title="Error"
              body={error}
              timeout={2}
              onClose={() => setError("")}
              closable
            />
          </Toasts>
        )}
      </Page>
    </>
  );
}

export default Transfer;
