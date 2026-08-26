import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import App from './App'


function successfulResponse(data) {
  return { ok: true, status: 200, json: async () => data }
}


describe('Autoline dashboard', () => {
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
})
