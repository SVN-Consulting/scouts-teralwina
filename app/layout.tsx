import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Footer, Navbar } from '@/components/navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';

const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Scouts Teralwina',
    template: '%s | Scouts Teralwina',
  },
  description:
    'Scouts Teralwina is a website for scouts in Teralwina, Belgium.',
  keywords: 'scouts, scouting, teralwina, belgium, scouts teralwina',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='nl'
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        roboto.variable,
      )}
      suppressHydrationWarning>
      <body className='min-h-full flex flex-col antialiased'>
        {/* <ClerkProvider> */}
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <main className='flex-1 overflow-y-auto'>
              <Navbar />
              {children}
            </main>
          </SidebarProvider>
          <Footer />
        </TooltipProvider>
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
