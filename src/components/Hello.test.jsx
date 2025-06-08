import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HelloButton from './Hello'

test('renders Hello! after clicking the button', async () => {
  render(<HelloButton />)
  await userEvent.click(screen.getByText('Click me'))
  expect(screen.getByText('Hello!')).toBeInTheDocument()
})
