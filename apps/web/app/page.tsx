"use client"
import { NextPage } from "next";
import { useSmartAccount } from "../hooks/useSmartAccount";

const MainPage: NextPage = () => {
  const { loading, loginSmartAccount, config, sendTransaction } = useSmartAccount()
  console.log("Smart Account loading:", loading)
  console.log("Smart Account config:", config?.account.address)
  const testViem = async () => {
    await loginSmartAccount()
  }

  const transferEther = async () => {
    const hash = await sendTransaction([
      {
        to: "0x4fff0f708c768a46050f9b96c46c265729d1a62f",
        value: 1n,
      }
    ])

    console.log("Transaction hash:", hash)
  }

  if (loading || !config) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Main Page</h1>
      <p>{config.account.address}</p>
      <button className="btn" onClick={testViem}>Test Viem</button>
      <br />

      <button className="btn" onClick={transferEther}>Transfer ether</button>
    </div>
  )
}

export default MainPage;
