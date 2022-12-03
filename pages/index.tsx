import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import rocket from "../assets/rocket.png";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>LensTree</title>
        <meta name="description" content="Lenstree" />
        <link rel="icon" href="/lenstree.png" />
      </Head>

      <main className={styles.main}>
      <div className="header-container">
          <header>
            <div className="left">
              <p className="title">LensTree</p>
              <p className="subtitle">Verify your digital identites</p>
            </div>
            <div className="right">
       
          <Image src={rocket} alt={"Rocket"} width={500} height={500}/>
        
            </div>
          </header>
        </div>
        <Link href={"/edit"}>Create or Edit</Link>
      </main>
    </div>
  )
}
