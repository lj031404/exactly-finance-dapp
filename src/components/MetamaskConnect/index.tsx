import Web3Context from "contexts/Web3Context";
import { Center, Button, Toasts, Toast, ToastType } from "decentraland-ui";
import { ethers } from "ethers";
import { useContext, useState } from "react";

function MetamaskConnect() {
  const [error, setError] = useState<string>("");
  const { updateProvider } = useContext(Web3Context);

  async function handleProvider() {
    setError("");

    try {
      await window.ethereum.enable();
      const provider: ethers.providers.Web3Provider =
        new ethers.providers.Web3Provider(window.ethereum, "any");

      updateProvider && updateProvider(provider);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <Center>
      <Button primary onClick={handleProvider}>
        Connect
      </Button>
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
    </Center>
  );
}

export default MetamaskConnect;
