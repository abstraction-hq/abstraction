"use client"
import { serializePublicKey } from "@openpass/onchain";
import { NextPage } from "next";
import { WebAuthnP256, P256, Signature } from "ox";

const TestPage: NextPage = () => {
  const testfunc = async () => {
    const res = await WebAuthnP256.sign({
      challenge: "0x1",
    })
    const { metadata, payload } = WebAuthnP256.getSignPayload({
      challenge: "0x1",
    })

    const publicKey = P256.recoverPublicKey({
      payload,
      signature: {
        r: res.signature.r,
        s: res.signature.s,
        yParity: 0,
      },
    })
    console.log(publicKey)

    const serializedPublicKey = serializePublicKey({
      x: publicKey.x,
      y: publicKey.y,
    })
    console.log(serializedPublicKey)

  }
  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={testfunc}>Test</button>
    </div>
  )
}

export default TestPage