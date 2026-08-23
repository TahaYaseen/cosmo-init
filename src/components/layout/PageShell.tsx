import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/** Nav + footer wrapper applied to every storefront page. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
