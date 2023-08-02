import Image from 'next/image'
import Header from './components/Header'

export default function Home() {
  return (
    <main className="flex flex-row">
      <div className="border-r-[1px] border-r-zinc-700 w-[620px] h-screen bg-[#111B21]">
        <Header/>
      </div>
      <div className='w-full h-screen bg-[#0B141A]'></div>
    </main>
  )
}
