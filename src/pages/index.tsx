import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Drawing App</title>
        <meta name="description" content="Create and share drawings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Draw<span className="text-[hsl(280,100%,70%)]">Fold</span>
          </h1>
          {sessionData ? (
            <DrawingCreator />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-white">
                Sign in to start creating drawings!
              </p>
              <AuthShowcase />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function DrawingCreator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createDrawing = api.drawing.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setContent("");
      // You might want to refetch the latest drawing here
    },
  });

  const { data: latestDrawing } = api.drawing.getLatest.useQuery();

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Drawing Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border-2 border-white/10 bg-white/5 p-2 text-white"
      />
      <textarea
        placeholder="Drawing Content (e.g., SVG data)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="h-32 w-64 rounded-md border-2 border-white/10 bg-white/5 p-2 text-white"
      />
      <button
        onClick={() => createDrawing.mutate({ title, content })}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      >
        Create Drawing
      </button>
      {latestDrawing && (
        <div className="mt-4 text-white">
          <h2 className="text-2xl font-bold">Your Latest Drawing</h2>
          <p>Title: {latestDrawing.title}</p>
          <p>Created at: {latestDrawing.createdAt.toLocaleString()}</p>
        </div>
      )}
      <AuthShowcase />
    </div>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
