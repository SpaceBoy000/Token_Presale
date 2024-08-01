import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6">
      <Link to="/">
        <img src="/logo.png" alt="fren" className="md:w-8 sm:w-8 w-8" />
      </Link>

      <div className="relative">
        <WalletMultiButton />
      </div>
    </header>
  );
};

export default Header;
