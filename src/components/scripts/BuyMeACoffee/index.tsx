import Script from "next/script";

function BuyMeACoffee() {
  return (
    <Script
      strategy="beforeInteractive"
      data-name="BMC-Widget"
      data-cfasync="false"
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-id="nublson"
      data-description="Support me on Buy me a coffee!"
      data-message=""
      data-color="#FFDD00"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
      title="support"
      id="buymeacoffee-script"
    />
  );
}

export default BuyMeACoffee;
