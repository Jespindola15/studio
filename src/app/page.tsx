import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import ValueProp from '@/components/sections/value-prop';
import Services from '@/components/sections/services';
import Portfolio from '@/components/sections/portfolio';
import Process from '@/components/sections/process';
import About from '@/components/sections/about';
import Cta from '@/components/sections/cta';
import { QuoteRequestDialog } from '@/components/quote-request-dialog';
import IdealFor from '@/components/sections/ideal-for';

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-dvh bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <Hero />
          <ValueProp />
          <Services />
          <IdealFor />
          <Portfolio />
          <Process />
          <About />
          <Cta />
        </main>
        <Footer />
      </div>
      <QuoteRequestDialog />
    </>
  );
}
