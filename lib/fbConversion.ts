// lib/fbConversion.ts
import bizSdk from "facebook-nodejs-business-sdk";

const { ServerEvent, EventRequest, UserData, CustomData, FacebookAdsApi } =
  bizSdk;

const access_token = process.env.FB_CAPI_ACCESS_TOKEN!;
const pixel_id = process.env.FB_PIXEL_ID!;

FacebookAdsApi.init(access_token);

type SendEventParams = {
  eventName: string; // "Purchase", "Lead", "InitiateCheckout", etc.
  eventId: string; // MUST match the client-side eventID for dedup
  eventSourceUrl?: string;
  email?: string; // raw email — SDK hashes it for you
  phone?: string; // raw phone — SDK hashes it for you
  fbp?: string; // from _fbp cookie
  fbc?: string; // from _fbc cookie
  clientIp?: string;
  userAgent?: string;
  value?: number;
  currency?: string;
};

export async function sendFbConversionEvent(params: SendEventParams) {
  const userData = new UserData();

  if (params.email) userData.setEmails([params.email]);
  if (params.phone) userData.setPhones([params.phone]);
  if (params.fbp) userData.setFbp(params.fbp);
  if (params.fbc) userData.setFbc(params.fbc);
  if (params.clientIp) userData.setClientIpAddress(params.clientIp);
  if (params.userAgent) userData.setClientUserAgent(params.userAgent);

  const customData = new CustomData();
  if (params.value !== undefined) customData.setValue(params.value);
  if (params.currency) customData.setCurrency(params.currency);

  const serverEvent = new ServerEvent()
    .setEventName(params.eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setEventId(params.eventId)
    .setUserData(userData)
    .setCustomData(customData)
    .setActionSource("website")
    .setEventSourceUrl(params.eventSourceUrl ?? "");

  const eventRequest = new EventRequest(access_token, pixel_id).setEvents([
    serverEvent,
  ]);

  const response = await eventRequest.execute();
  return response;
}
