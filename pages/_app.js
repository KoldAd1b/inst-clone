import "../styles/globals.css";
import { Provider } from "react-redux";

import Head from "next/head";
import store from "../store/index.";
import Header from "../components/Header";
import Modal from "../components/Utility/Modal";
import AuthProvider from "../components/Auth/AuthProvider";

function MyApp({ Component, pageProps: { ...pageProps } }) {
  return (
    <Provider store={store}>
      <Head>
        <title>The Gram</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <AuthProvider>
        <Header />
        <Modal />

        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
