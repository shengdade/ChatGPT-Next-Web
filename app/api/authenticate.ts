import { CognitoJwtVerifier } from "aws-jwt-verify";
import { NextRequest } from "next/server";
import { COGNITO_USER_POOL_CLIENT_ID, COGNITO_USER_POOL_ID } from "../aws";
import { getServerSideConfig } from "../config/server";

const serverConfig = getServerSideConfig();

const verifier = CognitoJwtVerifier.create({
  tokenUse: "id",
  userPoolId: COGNITO_USER_POOL_ID,
  clientId: COGNITO_USER_POOL_CLIENT_ID,
});

export async function authenticate(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ").at(-1) ?? "";

  if (!token) {
    console.error("[Authenticate] No token provided");
    return {
      error: true,
      msg: "unauthorized",
    };
  }

  try {
    const payload = await verifier.verify(token);
    // console.log("[Authenticate] Token is valid. Payload:", payload);
  } catch (error) {
    console.error("[Authenticate] Token not valid:", error);
    return {
      error: true,
      msg: "token not valid",
    };
  }

  const apiKey = serverConfig.apiKey;
  if (apiKey) {
    // Replace the Authorization header with OpenAI API key
    req.headers.set("Authorization", `Bearer ${apiKey}`);
  } else {
    console.error("[Authenticate] Admin did not provide an api key");
    return {
      error: true,
      msg: "admin did not provide an api key",
    };
  }

  return {
    error: false,
  };
}
