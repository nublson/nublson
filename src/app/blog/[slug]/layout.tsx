import Script from "next/script";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script id="iFrame-height">
        {`window.onload = function() {
            const myIframes = document.querySelectorAll("iframe");
            myIframes.forEach(iFrame => {
              iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
              iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
            })
         }`}
      </Script>
    </>
  );
}
