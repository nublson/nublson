import Script from "next/script";

function Gumroad() {
  return (
    <Script
      src="https://gumroad.com/js/gumroad.js"
      strategy="beforeInteractive"
      title="gumroad"
      id="gumroad-script"
    />
  );
}

export default Gumroad;
