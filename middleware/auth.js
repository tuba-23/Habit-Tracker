import * as jose from "jose";

const JWKS = jose.createRemoteJWKSet(
  new URL(`${process.env.HANKO_API_URI}/.well-known/jwks.json`)
);

export const isAuthenticated = async (req, res, next) => {
  let token = req.cookies?.hanko;
  if (!token) return res.status(401).send("Unauthorized");
  try { await jose.jwtVerify(token, JWKS); next(); }
  catch { return res.status(401).send("Invalid Token"); }
};
