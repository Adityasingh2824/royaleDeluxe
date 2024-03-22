import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import dataReducer from "./store";
const store = configureStore({
  reducer: {
    clientReduxStore: dataReducer,
  },
});

import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
const wallets = [new PetraWallet()];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <Provider store={store}>
          <AptosWalletAdapterProvider
            plugins={wallets}
            autoConnect={false}>
      <App />
       </AptosWalletAdapterProvider>
    </Provider>
  </React.StrictMode>,
)
