import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import rocket from "../assets/rocket.png";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-sky-500 via-zinc-300 to-indigo-800 transition-all duration-500 bg-size-200 bg-pos-0 animate-bg">
      <Head>
        <title>LensTree</title>
        <meta name="description" content="Lenstree" />
        <link rel="icon" href="/lenstree.png" />
      </Head>

      <main className="flex flex-col justify-center items-center p-8 min-h-[100vh]">
        <div className="flex flex-col">
          <header className="text-center">
            <h1 className="font-Josefin text-6xl">LensTree</h1>
            <p className="font-Lato">
              A Link Aggregator that runs on any of your web3 identities.
            </p>
          </header>
        </div>
        <Link
          className="inline-block bg-red-400  mt-7 text-center rounded-lg px-8 py-4 text-xl "
          href={"/edit"}
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
