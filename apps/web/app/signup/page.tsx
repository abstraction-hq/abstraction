"use client"
import { NextPage } from "next"
import useAccount from "../../hooks/useAccount"

const SignUpPage: NextPage = () => {
  const { test } = useAccount()
  const handleSignUp = async () => {
    test()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sign Up Page</h1>
      <p className="mb-2">This is a placeholder for the Sign Up functionality.</p>
      <input type="text" placeholder="Email" className="border p-2 mb-2 block w-full" />
      <input type="password" placeholder="Password" className="border p-2 mb-4 block w-full" />
      <button className="bg-green-500 text-white p-2 w-full" onClick={handleSignUp}>Sign In</button>
    </div>
  )
}

export default SignUpPage;
