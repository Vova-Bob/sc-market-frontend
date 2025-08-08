import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BackArrow } from '../BackArrow'

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (_: string, fallback?: string) => fallback || '' }),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('BackArrow', () => {
  it('renders and triggers navigate(-1) on click', () => {
    render(
      <MemoryRouter>
        <BackArrow />
      </MemoryRouter>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})