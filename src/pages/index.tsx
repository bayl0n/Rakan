import { SignedIn, SignedOut, useClerk, UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

export default function Home() {
  
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  
  return (
    <>
      <Head>
        <title>Rakan</title>
        <meta name="description" content="Rakan app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome to <span className="text-[hsl(280,100%,70%)]">Rakan</span>App
          </h1>
          <SignedIn>
            <section className="flex gap-4 items-center">
              <p className="text-3xl font-bold text-white sm:text-[3rem]" >{ user?.firstName }</p>
              <UserButton afterSignOutUrl="/"/>
            </section>
          </SignedIn>
          <SignedOut>
            <button onClick={() => openSignIn()} className="p-4 rounded-md bg-gray-600 text-white hover:bg-gray-400">Sign In</button>
          </SignedOut>
        </div>
      </main>
    </>
  );
}
