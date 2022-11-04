import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Main from './components/Main'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home(props) {
  const router = useRouter()
  const [render, setRender] = useState(false)
  function moveMain() {
    router.push('/components/Main')
  }
  // setTimeout(() => {
  //   moveMain()
  // },1)
  return (
    <div className={styles.container}>
      <Head>
        <title>TML</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main}`}>
          <Main data = {props} render = {{render, setRender}} /> 
          {/* <div className='border p-2 bg-slate-400 cursor-pointer text-white' onClick={moveMain}>
            Nevter
          </div> */}
      </main>

    </div>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  const response = await fetch('http://localhost:3000/api/db')
  const db = await response.json()

  const res1 = await fetch('http://localhost:3000/api/trade')
  const trade = await res1.json()

  return {
      props: {
        db: db,
        trade: trade
      }
  }
}
