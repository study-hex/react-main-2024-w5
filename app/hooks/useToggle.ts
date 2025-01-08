import { useState } from 'react'

export function useToggle(defaultState?: boolean) {
  const [open, setOpen] = useState<boolean>(defaultState ?? false)

  const toggle = () => setOpen(prevState => !prevState)

  const toggleOpen = () => setOpen(true)
  const toggleClose = () => setOpen(false)

  return { open, toggle, toggleOpen, toggleClose }
}
