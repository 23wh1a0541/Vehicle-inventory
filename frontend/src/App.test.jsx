import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

import App from './App'


function successfulResponse(data) {
  return { ok: true, status: 200, json: async () => data }
}


describe('Autoline dashboard', () => {
  afterEach(cleanup)

  beforeEach(() => {
    localStorage.clear()
    global.fetch = vi.fn()
  })

  it('allows a visitor to switch from sign in to registration', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }))

    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
  })

  it('shows management controls only for an authenticated administrator', async () => {
    localStorage.setItem(
      'autoline-session',
      JSON.stringify({ token: 'test-token', user: { id: 1, name: 'Inventory Admin', role: 'admin' } }),
    )
    global.fetch.mockResolvedValue(
      successfulResponse([
        {
          id: 1,
          make: 'Tesla',
          model: 'Model 3',
          category: 'Electric',
          price: '42490.00',
          quantity: 0,
        },
      ]),
    )

    render(<App />)

    expect(await screen.findByText('Administrator tools')).toBeInTheDocument()
    expect(screen.getByText('Inventory Admin · Administrator')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restock' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  })

  it('clears administrator feedback when the user signs out', async () => {
    localStorage.setItem(
      'autoline-session',
      JSON.stringify({ token: 'test-token', user: { id: 1, name: 'Inventory Admin', role: 'admin' } }),
    )
    const vehicle = {
      id: 1,
      make: 'Tesla',
      model: 'Model 3',
      category: 'Electric',
      price: '42490.00',
      quantity: 2,
    }
    global.fetch
      .mockResolvedValueOnce(successfulResponse([vehicle]))
      .mockResolvedValueOnce(successfulResponse({ ...vehicle, quantity: 3 }))
      .mockResolvedValueOnce(successfulResponse([{ ...vehicle, quantity: 3 }]))

    render(<App />)
    await screen.findByText('Tesla Model 3')
    fireEvent.click(screen.getByRole('button', { name: 'Restock' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm restock' }))
    expect(await screen.findByText('Tesla Model 3 restocked successfully.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(screen.getByRole('heading', { name: 'Sign in to your account' })).toBeInTheDocument()
    expect(screen.queryByText('Tesla Model 3 restocked successfully.')).not.toBeInTheDocument()
  })
})
