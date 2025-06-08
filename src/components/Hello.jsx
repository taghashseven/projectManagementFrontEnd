import { useState } from 'react'

export default function HelloButton() {
  const [clicked, setClicked] = useState(false)

  return (
    <div>
      <button onClick={() => setClicked(true)}>Click me</button>
      {clicked && <p>Hello!</p>}
    </div>
  )
}
