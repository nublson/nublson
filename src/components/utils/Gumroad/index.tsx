import Script from "next/script";

function Gumroad() {
  return (
    <Script
      type="text/javascript"
      src="https://gumroad.com/js/gumroad.js"
      strategy="beforeInteractive"
    />
  );
}

export default Gumroad;
