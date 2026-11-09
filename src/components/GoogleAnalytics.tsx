'use client';

import Cookies from 'js-cookie';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const COOKIE_PREFERENCES_KEY = 'cookie_preferences';
const ANALYTICS_EVENT = 'cookie-preferences-updated';

function hasAnalyticsConsent() {
  const rawPreferences = Cookies.get(COOKIE_PREFERENCES_KEY);

  if (!rawPreferences) {
    return false;
  }

  try {
    return JSON.parse(rawPreferences).analytics === true;
  } catch {
    return false;
  }
}

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const updateConsent = () => setEnabled(hasAnalyticsConsent());
    updateConsent();
    window.addEventListener(ANALYTICS_EVENT, updateConsent);

    return () => window.removeEventListener(ANALYTICS_EVENT, updateConsent);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6F0RMM5CY2"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6F0RMM5CY2');
        `}
      </Script>
    </>
  );
}
