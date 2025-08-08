import React from 'react'
import { render, screen } from '@testing-library/react'
import { UnderlineLink } from '../UnderlineLink'

describe('UnderlineLink', () => {
  it('renders children text', () => {
    render(<UnderlineLink>Link Text</UnderlineLink>)
    expect(screen.getByText('Link Text')).toBeInTheDocument()
  })
})