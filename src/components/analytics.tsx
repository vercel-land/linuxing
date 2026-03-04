import Script from "next/script";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { cache } from "react";

const getSettings = cache(async () => {
  return await db.select().from(settings);
});

export async function Analytics() {
  const allSettings = await getSettings();
  const gaId = allSettings.find((s) => s.key === "google_analytics_id")?.value;
  const plausibleDomain = allSettings.find((s) => s.key === "plausible_domain")?.value;

  return (
    <>
      {gaId && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
