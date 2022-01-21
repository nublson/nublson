import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Script from "next/script";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script type="text/javascript" src="https://gumroad.com/js/gumroad.js" />
      <DefaultSeo
        twitter={{
          handle: "@nublson",
          site: "@nublson",
          cardType: "summary_large_image",
        }}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
export default MyApp;
