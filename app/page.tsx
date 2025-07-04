'use client'

import { useEffect, useState } from "react";

type Transaction = {
  txnRef: string,
  amount: number,
  description: string,
  createdAt: string,
  status: string
}

export default function Home() {
  const [tab, setTab] = useState<'create' | 'history'>('create')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    description: '',
    bankCode: '',
    language: 'vn'
  })

  const [history, setHistory] = useState<Transaction[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const handlePay = async () => {
    const { amount, description, language, bankCode } = form
    if (!amount || isNaN(Number(amount))) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          orderInfo: description,
          language,
          bankCode,
        })
      })

      const data = await res.json()
      if (data.url) {
        // save transaction
        const txn: Transaction = {
          txnRef: data.url.split('vnp_TxnRef=')[1]?.split('&')[0] || Date.now().toString(),
          amount: Number(amount),
          description: description || '(no description)',
          createdAt: new Date().toISOString(),
          status: 'Pending',
        }
        const updated = [txn, ...history]
        setHistory(updated)
        localStorage.setItem('transactions', JSON.stringify(updated))
        window.location.href = data.url
      }
      else {
        alert('Failed to create payment URL')
      }

    } catch (error) {
      console.log('🚀 ~ handlePay ~ error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-blue-700">VNPay Payment Demo</h1>
        <div className="space-x-4">
          <button
            onClick={() => setTab('create')}
            className={`text-sm font-medium ${tab === 'create' ? 'text-blue-700 underline' : 'text-gray-600 hover:text-blue-500'
              }`}
          >
            New Payment
          </button>
          <button
            onClick={() => setTab('history')}
            className={`text-sm font-medium ${tab === 'history' ? 'text-blue-700 underline' : 'text-gray-600 hover:text-blue-500'
              }`}
          >
            Transaction History
          </button>
        </div>
      </div>

      {/* New Payment Tab */}
      {tab === 'create' && (
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Payment</h2>
            <div className="grid gap-4 max-w-md">
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Amount (VND)"
                className="border rounded p-2"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Payment Description"
                className="border rounded p-2"
              />
              <select
                value={form.bankCode}
                onChange={(e) => setForm({ ...form, bankCode: e.target.value })}
                className="border rounded p-2"
              >
                <option value="">Choose Bank (optional)</option>
                <option value="VNPAYQR">VNPAY QR</option>
                <option value="VCB">Vietcombank</option>
                <option value="BIDV">BIDV</option>
                <option value="NCB">Ngan hang NCB</option>
              </select>
              <button
                onClick={handlePay}
                disabled={loading}
                className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              >
                {loading ? 'Processing...' : 'Pay with VNPay'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Transaction History Tab */}
      {tab === 'history' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border">Txn Ref</th>
                    <th className="px-4 py-2 border">Amount (VND)</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Created At</th>
                    <th className="px-4 py-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{tx.txnRef}</td>
                      <td className="px-4 py-2 border">{tx.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 border">{tx.description}</td>
                      <td className="px-4 py-2 border">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2 border">{tx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
