"use client"
import { client, parsers } from "@passwordless-id/webauthn";
import { NextPage } from "next";
import { useState } from "react";

const LoginPage: NextPage = () => {
  const [passkeyName, setPasskeyName] = useState("My Passkey");

  const handleLogin = async () => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const regData  = await client.authenticate(
      {
        challenge: randomString,
      }
    );
    const parsedData = parsers.parseRegistration(regData);

    let passkey = getXYCoordinates(parsedData.credential.publicKey);
  }

  return (
    <div>
      <input type="text" placeholder="Username" className="border p-2 mb-2 block w-full" />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
