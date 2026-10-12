import { Suspense } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-[1600px] px-[15px] md:px-[50px]"><Suspense fallback={<div className="py-24 text-center text-black/40">Loading…</div>}>{children}</Suspense>
      </main>
      <Footer />
    </>
  );
}
