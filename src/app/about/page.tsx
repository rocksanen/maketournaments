import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-slate-500">
      <p>about page</p>
      <Link href="/">home</Link>
    </div>
  )
}
