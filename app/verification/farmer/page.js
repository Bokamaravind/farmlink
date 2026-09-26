'use client'

import { useState } from 'react'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  region: '',
  aadhaarNumber: '',
  aadhaarDocument: '',
  farmAreaPhoto: '',
  photo: '',
  bankName: '',
  bankAccountNumber: '',
  ifscCode: '',
  bankDocument: '',
  notes: '',
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function FarmerVerificationPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleFileUpload = async (field, file) => {
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    updateField(field, dataUrl)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const response = await fetch('/api/verification/farmers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setMessage(data?.error || 'Unable to submit the request right now.')
      return
    }

    setMessage('Your verification request has been submitted to Kisavi admin for review.')
    setForm(initialForm)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 md:p-8">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🌾</div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Kisavi farmer onboarding</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Farmer verification request</h1>
          <p className="mt-2 text-sm text-gray-600">Submit your personal details, Aadhaar, photo and banking information for approval. Our admin team will review and decide whether to add you to the farmer panel.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Full name</label>
            <input className="input" required value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Balu Patil" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Phone number</label>
            <input className="input" required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="9876543210" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="farmer@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Region / area</label>
            <input className="input" required value={form.region} onChange={(e) => updateField('region', e.target.value)} placeholder="Lankelapalem" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Full address</label>
            <textarea className="input min-h-[100px]" required value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Village, mandal, district, state" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Aadhaar number</label>
            <input className="input" required value={form.aadhaarNumber} onChange={(e) => updateField('aadhaarNumber', e.target.value)} placeholder="123456789012" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Aadhaar document photo</label>
            <input className="input" required type="file" accept="image/*" capture="environment" onChange={(e) => handleFileUpload('aadhaarDocument', e.target.files?.[0])} />
            {form.aadhaarDocument && <img src={form.aadhaarDocument} alt="Aadhaar document" className="mt-2 h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200" />}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Farm area photo</label>
            <input className="input" required type="file" accept="image/*" capture="environment" onChange={(e) => handleFileUpload('farmAreaPhoto', e.target.files?.[0])} />
            {form.farmAreaPhoto && <img src={form.farmAreaPhoto} alt="Farm area" className="mt-2 h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200" />}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Profile photo</label>
            <input className="input" required type="file" accept="image/*" capture="user" onChange={(e) => handleFileUpload('photo', e.target.files?.[0])} />
            {form.photo && <img src={form.photo} alt="Profile" className="mt-2 h-20 w-20 rounded-full object-cover ring-1 ring-gray-200" />}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Bank name</label>
            <input className="input" required value={form.bankName} onChange={(e) => updateField('bankName', e.target.value)} placeholder="State Bank of India" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Bank account number</label>
            <input className="input" required value={form.bankAccountNumber} onChange={(e) => updateField('bankAccountNumber', e.target.value)} placeholder="123456789012" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">IFSC code</label>
            <input className="input" required value={form.ifscCode} onChange={(e) => updateField('ifscCode', e.target.value)} placeholder="SBIN0001234" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Bank document photo</label>
            <input className="input" type="file" accept="image/*" capture="environment" onChange={(e) => handleFileUpload('bankDocument', e.target.files?.[0])} />
            {form.bankDocument && <img src={form.bankDocument} alt="Bank document" className="mt-2 h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200" />}
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Additional notes</label>
            <textarea className="input min-h-[100px]" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Share any extra details for verification" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="btn-brand w-full disabled:opacity-60">
              {loading ? 'Sending request...' : 'Send verification request'}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
