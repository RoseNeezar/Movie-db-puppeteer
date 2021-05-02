import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, user-scalable=0"
        />
      </Head>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
