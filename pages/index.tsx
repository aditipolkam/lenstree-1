import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>LensTree</title>
        <meta name="description" content="Lenstree" />
        <link rel="icon" href="/lenstree.png" />
      </Head>

      <main className={styles.main}>
        <Link href={"/edit"}>Create or Edit</Link>
      </main>
    </div>
  )
}
