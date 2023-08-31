import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-green-300">
      <p>next js app</p>
      <Link href="/about">about</Link>
    </div>
  )
}
