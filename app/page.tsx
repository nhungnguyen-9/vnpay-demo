'use client'

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert('Enter a valid amount!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), currency })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating payment link');
      }
    } catch (error) {
      console.log('🚀 ~ handlePay ~ error:', error);
      alert('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">VNPay Payment Demo</h1>

        <input
          type="number"
          placeholder="Enter amount"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        >
          <option value="VND">VND</option>
          <option value="USD">USD</option>
        </select>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Processing...' : 'Pay with VNPay'}
        </button>
      </div>
    </main>
  );
}
