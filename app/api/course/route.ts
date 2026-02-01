import { NextResponse } from "next/server";

const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for signing

// We've created some helper functions for Node to make your signing-life easier
const Mux = require("@mux/mux-node");
const mux = new Mux({
  tokenId: process.env.MUX_ACCESS_TOKEN, // Enter your Mux access token here
  tokenSecret: process.env.MUX_SECRET_KEY, // Enter your Mux secret key here
});

async function createTokens() {
  console.log("[COURSE_TOKEN] Creating tokens");
  const signing_key_secret = process.env.MUX_SIGNING_SECRET;
  const signing_key = process.env.MUX_SIGNING_KEY;

  if (!signing_key_secret) throw new Error("Missing secret!");
  if (!signing_key) throw new Error("Missing key!");

  console.log("signing_key_secret", signing_key_secret);
  console.log("signing_key", signing_key);

  const decodedSigningKeySecret = Buffer.from(
    signing_key_secret,
    "base64",
  ).toString("ascii");
  console.log("decodedSigningKeySecret", decodedSigningKeySecret);
  const jwtExpiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1 day from now
  console.log("jwtExpiration", jwtExpiration);

  const playbackId = "0002ftXmVTti824sYSFrxcQb9CSugN1ShtIuOLwys1JPI"; // Enter your signed playback id here
  const vToken = jwt.sign(
    {
      sub: playbackId,
      aud: "v",
      exp: jwtExpiration, // E.g 60, "2 days", "10h", "7d", numeric value interpreted as seconds
      kid: signing_key, // Enter your signing key id here
    },
    decodedSigningKeySecret,
    { algorithm: "RS256" },
  ); // Enter your signing key secret here)

  console.log("video token----", vToken);

  // Set some base options we can use for a few different signing types
  // Type can be either video, thumbnail, gif, or storyboard
  let baseOptions = {
    keyId: signing_key, // Enter your signing key id here
    keySecret: decodedSigningKeySecret,
    expiration: jwtExpiration, // E.g 60, "2 days", "10h", "7d", numeric value interpreted as seconds
  };

  const token = await mux.jwt.signPlaybackId(playbackId, {
    ...baseOptions,
    type: "video",
  });
  console.log("video token", token);

  // Then, use this token in a URL like this:
  // https://image.mux.com/${playbackId}/animated.gif?token=${gifToken}

  // A final example, if you wanted to sign a thumbnail url with a playback restriction
  const thumbnailToken = await mux.jwt.signPlaybackId(playbackId, {
    ...baseOptions,
    type: "thumbnail",
    // params: { playback_restriction_id: YOUR_PLAYBACK_RESTRICTION_ID },
  });
  console.log("thumbnail token", thumbnailToken);

  // When used in a URL, it should look like this:
  // https://image.mux.com/${playbackId}/thumbnail.png?token=${thumbnailToken}
  console.log("[COURSE_TOKEN] Tokens created");
  return { videoToken: token, thumbnailToken, playbackId };
}

export async function GET(request: Request) {
  console.log("[COURSE_TOKEN] Request received", {
    method: request.method,
    url: request.url,
  });
  const { videoToken, thumbnailToken, playbackId } = await createTokens();
  console.log("[COURSE_TOKEN] Response ready", { playbackId });
  return NextResponse.json({
    message: "Hello from the auth API route!",
    method: request.method,
    url: request.url,
    data: {
      p: videoToken,
      t: thumbnailToken,
      playbackId: playbackId,
    },
  });
}
