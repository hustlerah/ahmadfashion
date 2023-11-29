import Hero from '@/components/Hero'
import React from 'react'
import Shop from './shop'
import Head from 'next/head'
import About from './about'
import Contact from './contact'

function Home() {
  return (
    <>
    <Head>
    <link rel="shortcut icon" href="/img/logo.png" type="image" />
    <title>Male Fashion-A Website By Ahmad</title>
    <meta name="description" content="Male Fashion-A Website By Ahmad" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name='keyword' content='Male Fashion,Ahmad Rizvi,Male Fashion by ahmad rizvi'/>
    </Head>
    <Hero/>
    <Shop/>
    <About/>
    <Contact/>
    </>
  )
}

export default Home
