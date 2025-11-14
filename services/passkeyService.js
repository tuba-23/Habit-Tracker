// services/passkeyService.js

import { tenant } from "@teamhanko/passkeys-sdk";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.HANKO_TENANT_ID || !process.env.HANKO_API_KEY) {
  throw new Error("Missing HANKO_TENANT_ID or HANKO_API_KEY environment variables");
}

const passkeyClient = tenant({
  tenantId: process.env.HANKO_TENANT_ID,
  apiKey: process.env.HANKO_API_KEY
});

export async function startPasskeyRegistration(userId, username) {
  const createOptions = await passkeyClient.registration.initialize({
    userId: userId.toString(),
    username
  });
  return createOptions;
}

export async function finishPasskeyRegistration(credential) {
  const result = await passkeyClient.registration.finalize(credential);
  return {
    token: result.token,
    user: {
      id: result.userId,
      username: result.username
    }
  };
}

export async function startPasskeyLogin() {
  const loginOptions = await passkeyClient.login.initialize();
  return loginOptions;
}

export async function finishPasskeyLogin(assertion) {
  const result = await passkeyClient.login.finalize(assertion);
  return {
    token: result.token,
    user: {
      id: result.userId,
      username: result.username
    }
  };
}
