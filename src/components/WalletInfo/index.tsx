import { Header, Segment, Center } from "decentraland-ui";
import { useAppSelector } from "hooks/useAppSelector";
import { Link } from "react-router-dom";

function WalletInfo() {
  const userInfo = useAppSelector((state) => state.userInfo);

  function shortenedAddress(address: string): string {
    return address.slice(0, 5) + "..." + address.slice(38, 42);
  }

  return (
    <Center screen>
      <Segment style={{ width: 300 }}>
        <Header>Wallet</Header>
        <p>
          <strong>Wallet: </strong>
          <span>{shortenedAddress(userInfo.address)}</span>
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            <strong>Balance:</strong> {userInfo.balance}
          </span>
          <Link to="/transfer">TRANSFER</Link>
          <Link to="/history">HISTORY</Link>
        </p>
      </Segment>
    </Center>
  );
}

export default WalletInfo;
