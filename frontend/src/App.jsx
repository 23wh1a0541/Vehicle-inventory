import { useEffect, useState } from 'react'

import { api } from './api'

const emptyFilters = { make: '', model: '', category: '', min_price: '', max_price: '' }
const emptyVehicle = { make: '', model: '', category: '', price: '', quantity: '' }

function Alert({ message, kind = 'error' }) {
  if (!message) return null
  const colors = kind === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'
  return <p className={`rounded-xl border px-4 py-3 text-sm ${colors}`}>{message}</p>
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = mode === 'register' ? form : { email: form.email, password: form.password }
      const result = await api(`/api/auth/${mode}`, { method: 'POST', body: payload })
      onAuthenticated(result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-xl font-bold tracking-tight"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent">A</span> AUTOLINE</div>
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Inventory made human</p>
          <h1 className="max-w-lg text-5xl font-bold leading-tight">Find the road that fits your life.</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">Browse a focused collection of vehicles, compare options, and purchase with confidence.</p>
        </div>
        <p className="text-sm text-slate-400">A better way to manage dealership inventory.</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><span className="font-bold text-ink">AUTOLINE</span></div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Welcome</p>
          <h2 className="mt-2 text-3xl font-bold">{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
          <p className="mt-3 text-slate-600">{mode === 'login' ? 'Access the latest vehicle inventory.' : 'Join Autoline to explore available vehicles.'}</p>
          <form className="mt-8 space-y-5" onSubmit={submit}>
            {mode === 'register' && <Field label="Full name" value={form.name} onChange={(name) => setForm({ ...form, name })} placeholder="Asha Sharma" />}
            <Field label="Email address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} placeholder="you@example.com" />
            <Field label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} placeholder="At least 8 characters" />
            <Alert message={error} />
            <button disabled={loading} className="w-full rounded-xl bg-ink px-5 py-3.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">{mode === 'login' ? 'New to Autoline?' : 'Already have an account?'} <button className="font-semibold text-accent hover:underline" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
        </div>
      </section>
    </main>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, min = undefined, max = undefined, step = undefined }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100" type={type} min={min} max={max} step={step} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>
}

function VehicleForm({ initialValue, onSubmit, submitLabel, onCancel }) {
  const [form, setForm] = useState(initialValue)
  useEffect(() => setForm(initialValue), [initialValue])
  const update = (field, value) => setForm({ ...form, [field]: value })
  const submit = (event) => {
    event.preventDefault()
    onSubmit({ ...form, price: Number(form.price), quantity: Number(form.quantity) })
  }
  return <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
    <Field label="Make" value={form.make} onChange={(value) => update('make', value)} placeholder="Toyota" />
    <Field label="Model" value={form.model} onChange={(value) => update('model', value)} placeholder="Camry" />
    <Field label="Category" value={form.category} onChange={(value) => update('category', value)} placeholder="Sedan" />
    <Field label="Price (USD)" type="number" min="0.01" max="99999999.99" step="0.01" value={form.price} onChange={(value) => update('price', value)} placeholder="32000.00" />
    <Field label="Quantity" type="number" min="0" max="999999" step="1" value={form.quantity} onChange={(value) => update('quantity', value)} placeholder="1" />
    <div className="flex items-end gap-3"><button className="rounded-xl bg-ink px-4 py-3 font-semibold text-white hover:bg-slate-700">{submitLabel}</button>{onCancel && <button type="button" className="px-3 py-3 font-semibold text-slate-600 hover:text-ink" onClick={onCancel}>Cancel</button>}</div>
  </form>
}

function RestockForm({ onSubmit, onCancel }) {
  const [quantity, setQuantity] = useState('1')
  const submit = (event) => {
    event.preventDefault()
    onSubmit(Number(quantity))
  }

  return <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-3">
    <label className="block text-sm font-medium text-slate-700">Quantity to add<input required className="mt-2 block w-56 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
    <button className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800">Confirm restock</button>
    <button type="button" className="px-3 py-3 font-semibold text-slate-600 hover:text-ink" onClick={onCancel}>Cancel</button>
  </form>
}

function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('autoline-session') ?? 'null'))
  const [vehicles, setVehicles] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [restocking, setRestocking] = useState(null)

  const isAdmin = session?.user.role === 'admin'
  const authenticate = (result) => {
    const next = { token: result.access_token, user: result.user }
    localStorage.setItem('autoline-session', JSON.stringify(next))
    setError('')
    setNotice('')
    setEditing(null)
    setRestocking(null)
    setSession(next)
  }
  const signOut = () => {
    localStorage.removeItem('autoline-session')
    setError('')
    setNotice('')
    setEditing(null)
    setRestocking(null)
    setSession(null)
  }
  const loadVehicles = async (activeFilters = filters) => {
    if (!session) return
    setLoading(true); setError('')
    try {
      const parameters = new URLSearchParams(Object.entries(activeFilters).filter(([, value]) => value !== ''))
      const path = parameters.size ? `/api/vehicles/search?${parameters}` : '/api/vehicles'
      setVehicles(await api(path, { token: session.token }))
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }
  useEffect(() => { loadVehicles() }, [session]) // eslint-disable-line react-hooks/exhaustive-deps

  const purchase = async (vehicle) => {
    setError(''); setNotice('')
    try { await api(`/api/vehicles/${vehicle.id}/purchase`, { token: session.token, method: 'POST' }); setNotice(`${vehicle.make} ${vehicle.model} purchased successfully.`); loadVehicles() } catch (requestError) { setError(requestError.message) }
  }
  const saveVehicle = async (vehicle) => {
    setError(''); setNotice('')
    try {
      const path = editing ? `/api/vehicles/${editing.id}` : '/api/vehicles'
      await api(path, { token: session.token, method: editing ? 'PUT' : 'POST', body: vehicle })
      setEditing(null); setNotice(editing ? 'Vehicle updated successfully.' : 'Vehicle added to inventory.'); loadVehicles()
    } catch (requestError) { setError(requestError.message) }
  }
  const deleteVehicle = async (vehicle) => {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return
    try { await api(`/api/vehicles/${vehicle.id}`, { token: session.token, method: 'DELETE' }); setNotice('Vehicle removed from inventory.'); loadVehicles() } catch (requestError) { setError(requestError.message) }
  }
  const restockVehicle = async (quantity) => {
    if (!restocking) return
    if (!Number.isInteger(quantity) || quantity <= 0) { setError('Restock quantity must be a positive whole number.'); return }
    setError(''); setNotice('')
    try { await api(`/api/vehicles/${restocking.id}/restock`, { token: session.token, method: 'POST', body: { quantity } }); setRestocking(null); setNotice(`${restocking.make} ${restocking.model} restocked successfully.`); loadVehicles() } catch (requestError) { setError(requestError.message) }
  }

  if (!session) return <AuthScreen onAuthenticated={authenticate} />
  return <main className="min-h-screen"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><div className="flex items-center gap-3 font-bold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white">A</span> AUTOLINE <span className="hidden rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-accent sm:inline">Vehicle inventory</span></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${isAdmin ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{session.user.name} · {isAdmin ? 'Administrator' : 'Customer'}</span><button onClick={signOut} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">Sign out</button></div></div></header>
    <div className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Available now</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Find your next drive.</h1><p className="mt-3 text-slate-600">Explore our current inventory and filter it your way.</p></div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-3 md:grid-cols-5">{Object.entries(filters).map(([name, value]) => <input key={name} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-accent" placeholder={name.replace('_', ' ')} type={name.includes('price') ? 'number' : 'text'} value={value} onChange={(event) => setFilters({ ...filters, [name]: event.target.value })} />)}</div><div className="mt-4 flex gap-3"><button onClick={() => loadVehicles()} className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white">Search inventory</button><button onClick={() => { setFilters(emptyFilters); loadVehicles(emptyFilters) }} className="text-sm font-semibold text-slate-600 hover:text-ink">Clear filters</button></div></section>
      {isAdmin && <section className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/50 p-6"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Administrator tools</p>{restocking ? <><h2 className="mt-1 text-xl font-bold">Restock {restocking.make} {restocking.model}</h2><p className="mt-1 text-sm text-slate-600">Current stock: {restocking.quantity}. Enter the number of vehicles to add.</p><RestockForm onSubmit={restockVehicle} onCancel={() => setRestocking(null)} /></> : <><h2 className="mt-1 text-xl font-bold">{editing ? `Edit ${editing.make} ${editing.model}` : 'Add a vehicle'}</h2><div className="mt-4"><VehicleForm initialValue={editing ?? emptyVehicle} onSubmit={saveVehicle} submitLabel={editing ? 'Save changes' : 'Add vehicle'} onCancel={editing ? () => setEditing(null) : undefined} /></div></>}</section>}
      <div className="mt-8 space-y-4"><Alert message={error} /><Alert message={notice} kind="success" /></div>
      <section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{loading ? 'Loading inventory…' : `${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} found`}</h2></div>{!loading && vehicles.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">No vehicles match these filters.</div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{vehicles.map((vehicle) => <article key={vehicle.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex h-36 items-end bg-gradient-to-br from-slate-800 via-slate-700 to-slate-500 p-5"><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">{vehicle.category}</span></div><div className="p-5"><h3 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h3><p className="mt-2 text-2xl font-bold text-ink">${Number(vehicle.price).toLocaleString()}</p><p className={`mt-2 text-sm font-semibold ${vehicle.quantity ? 'text-emerald-700' : 'text-red-600'}`}>{vehicle.quantity ? `${vehicle.quantity} in stock` : 'Out of stock'}</p><div className="mt-5 flex flex-wrap gap-2"><button disabled={!vehicle.quantity} onClick={() => purchase(vehicle)} className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300">{vehicle.quantity ? 'Purchase' : 'Unavailable'}</button>{isAdmin && <><button onClick={() => { setRestocking(null); setEditing(vehicle) }} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">Edit</button><button onClick={() => { setEditing(null); setRestocking(vehicle) }} className="rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Restock</button><button onClick={() => deleteVehicle(vehicle)} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Delete</button></>}</div></div></article>)}</div>}</section>
    </div></main>
}

export default App
