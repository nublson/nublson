import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "prismjs";
import { useEffect } from "react";
import Layout from "../components/Layout";
import Analytics from "../components/utils/Analytics";
import { pageView } from "../services/gtag";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
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

      <Analytics />
    </>
  );
}
export default MyApp;
