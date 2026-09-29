// lib/geolocation.ts

import { headers } from "next/headers";

export async function getAudience() {
  const headersList = await headers();

  const country = headersList.get("x-vercel-ip-country");

  //   return country === "NG" ? "local" : "global";
  console.log(country);
  return {
    headers: headersList,
    // country: "US",
    country: country,
  };
}
