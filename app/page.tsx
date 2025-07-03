'use client'

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert('Enter the amount money suitable!')
      return
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">VNPay Payment Demo</h1>
        <input
          type="number"
          placeholder="Enter money"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'In progress' : 'Pay with VNPay'}
        </button>
      </div>
    </main>
  );
}
