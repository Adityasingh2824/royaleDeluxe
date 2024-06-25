import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'

import { createClient } from "graphql-ws";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  //uri: "http://localhost:3000/graphql",
  //uri: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",
  uri: "https://indexer.testnet.aptoslabs.com/v1/graphql",
});

const wsLink =
  typeof window !== "undefined"
  ? new GraphQLWsLink(
  createClient({
    //url: "ws://localhost:3000/graphql",
    //url: "wss://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",
    url: "wss://indexer.testnet.aptoslabs.com/v1/graphql",
  })
    )
    : null;

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink =
  typeof window !== "undefined" && wsLink != null
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
    : httpLink;
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

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
        <ApolloProvider client={client}>
          <AptosWalletAdapterProvider
            plugins={wallets}
            autoConnect={false}>
          <App />
      
        </AptosWalletAdapterProvider>
            </ApolloProvider>
    </Provider>
  </React.StrictMode>,
)
