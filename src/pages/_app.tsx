import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pageView } from "../services/analytics";

const Layout = dynamic(() => import("../components/Layout"));
const GumroadScript = dynamic(() => import("../components/scripts/Gumroad"));

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
      <GumroadScript />
    </>
  );
}
export default MyApp;
