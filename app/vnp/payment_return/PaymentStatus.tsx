'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentStatus() {
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'success' | 'failed' | 'unknown'>('unknown')

    useEffect(() => {
        const responseCode = searchParams.get('vnp_ResponseCode')
        if (responseCode === '00') setStatus('success')
        else setStatus('failed')

        const txnRef = searchParams.get('vnp_TxnRef')
        if (txnRef) {
            const stored = localStorage.getItem('transactions')
            if (stored) {
                const list = JSON.parse(stored)
                const updated = list.map((t: any) =>
                    t.txnRef === txnRef ? { ...t, status: responseCode === '00' ? 'Success' : 'Failed' } : t
                )
                localStorage.setItem('transactions', JSON.stringify(updated))
            }
        }
    }, [searchParams])

    return (
        <div className="bg-white shadow-lg p-8 rounded-lg text-center max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">VNPay Payment Result</h1>
            {status === 'success' && (
                <p className="text-green-600 font-semibold text-lg">Payment Successful!</p>
            )}
            {status === 'failed' && (
                <p className="text-red-600 font-semibold text-lg">Payment Failed!</p>
            )}
            {status === 'unknown' && <p className="text-gray-600">Checking payment status...</p>}
            <Link href="/">
                <button className="mt-6 bg-amber-300 p-2 rounded-md">Back to home</button>
            </Link>
        </div>
    )
}
