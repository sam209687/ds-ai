import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container">
        <Header />
        <Footer />
      </div>
    </Suspense>
  );
}
