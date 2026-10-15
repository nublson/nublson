"use client";

import { Typography } from "@/components/typography";
import { saveToPurl } from "@/lib/purl/client";
import { completeConnect, PurlConnectError } from "@/lib/purl/oauth";
import { setResult, type PurlResult } from "@/lib/purl/storage";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const SAVE_FAILED_MESSAGE =
  "Couldn't save to Purl. Check your connection and try again.";

export default function PurlCallbackPage() {
  const router = useRouter();
  // The pending record is single-use, so a repeated effect run (Strict Mode)
  // must not call completeConnect twice.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void (async () => {
      let returnPath = "/";
      let result: PurlResult;
      try {
        const connected = await completeConnect(
          new URLSearchParams(window.location.search),
        );
        returnPath = connected.returnPath;
        const outcome = await saveToPurl(connected.url);
        result =
          outcome.status === "saved" || outcome.status === "limit"
            ? { status: outcome.status }
            : {
                status: "error",
                message:
                  outcome.status === "error"
                    ? outcome.message
                    : SAVE_FAILED_MESSAGE,
              };
      } catch (e) {
        if (e instanceof PurlConnectError) returnPath = e.returnPath;
        result = {
          status: "error",
          message: e instanceof Error ? e.message : SAVE_FAILED_MESSAGE,
        };
      }
      setResult(result);
      router.replace(returnPath);
    })();
  }, [router]);

  return (
    <section className="article-layout">
      <Typography size="regular" component="p" role="status">
        Connecting to Purl…
      </Typography>
    </section>
  );
}
