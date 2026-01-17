import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

export const Block = () => {
  return (
    <>
      <Navbar hideFrom="md" />
      <Sidebar hideBelow="md" />
    </>
  )
}
