'use client'

import Link from 'next/link'

export default function VerificationLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Kisavi onboarding</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">Choose your verification request</h1>
          <p className="mt-3 text-gray-600">Submit your details to begin the real verification process before joining the Kisavi platform.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/verification/farmer" className="block rounded-3xl bg-white p-7 shadow-xl ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-4 text-5xl">🌾</div>
            <h2 className="text-2xl font-bold text-gray-900">Farmer verification</h2>
            <p className="mt-3 text-sm text-gray-600">Register as a farmer, submit Aadhaar and banking details, and send your verification request to the admin.</p>
            <div className="mt-6 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Apply as Farmer</div>
          </Link>

          <Link href="/verification/delivery" className="block rounded-3xl bg-white p-7 shadow-xl ring-1 ring-amber-100 transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-4 text-5xl">🛵</div>
            <h2 className="text-2xl font-bold text-gray-900">Delivery partner verification</h2>
            <p className="mt-3 text-sm text-gray-600">Apply as a delivery partner, upload your verification documents, and request onboarding for the Kisavi delivery team.</p>
            <div className="mt-6 inline-flex rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Apply as Delivery Partner</div>
          </Link>
        </div>
      </div>
    </main>
  )
}
