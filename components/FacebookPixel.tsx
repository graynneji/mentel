// // components/FacebookPixel.tsx
// "use client";

// import Script from "next/script";

// export default function FacebookPixel() {
//   return (
//     <Script id="fb-pixel" strategy="afterInteractive">
//       {`
//         !function(f,b,e,v,n,t,s){
//           if(f.fbq)return;
//           n=f.fbq=function(){
//             n.callMethod
//               ? n.callMethod.apply(n,arguments)
//               : n.queue.push(arguments)
//           };
//           if(!f._fbq)f._fbq=n;
//           n.push=n;
//           n.loaded=!0;
//           n.version='2.0';
//           n.queue=[];
//           t=b.createElement(e);
//           t.async=!0;
//           t.src=v;
//           s=b.getElementsByTagName(e)[0];
//           s.parentNode.insertBefore(t,s);
//         }(window,document,'script',
//         'https://connect.facebook.net/en_US/fbevents.js');

//         fbq('init', '1701195157569863');
//         fbq("track", "pageView");
//       `}
//     </Script>
//   );
// }

// components/FacebookPixel.tsx
"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Set in .env: NEXT_PUBLIC_FB_PIXEL_ID=1701195157569863
// Falls back to the existing pixel id so nothing breaks if the env var
// isn't set yet.
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "1701195157569863";

export default function FacebookPixel() {
  const pathname = usePathname();

  // Meta Pixel's base script only fires PageView once, on initial script
  // load. Since this is a Next.js app-router SPA, client-side navigations
  // between routes don't reload the script — so without this, every route
  // after the first is invisible to the pixel (breaking Meta's audience/
  // retargeting data for anyone who navigates deeper into the site).
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname]);

  return (
    <Script id="fb-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){
          if(f.fbq)return;
          n=f.fbq=function(){
            n.callMethod
              ? n.callMethod.apply(n,arguments)
              : n.queue.push(arguments)
          };
          if(!f._fbq)f._fbq=n;
          n.push=n;
          n.loaded=!0;
          n.version='2.0';
          n.queue=[];
          t=b.createElement(e);
          t.async=!0;
          t.src=v;
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s);
        }(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', '${FB_PIXEL_ID}');
        fbq("track", "PageView");
      `}
    </Script>
  );
}
