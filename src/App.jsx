import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./app.scss"

import Token from "./pages/Token";
import { WalletContextProvider } from "./components/WalletContextProvider";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Web3Provider } from "./contracts/Web3Context";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <WalletContextProvider>
        <Web3Provider>
          <Routes>
            <Route path="/" element={<Token />} />
            <Route path="/token" element={<Token />} />
          </Routes>
        </Web3Provider>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={'colored'}
        />
      </WalletContextProvider>
    </>
  );
}

export default App;
