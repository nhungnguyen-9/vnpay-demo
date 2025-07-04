import { Suspense } from 'react'
import PaymentStatus from './PaymentStatus'

export default function PaymentReturnPage() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <Suspense fallback={<p>Loading payment result...</p>}>
                <PaymentStatus />
            </Suspense>
        </main>
    )
}
