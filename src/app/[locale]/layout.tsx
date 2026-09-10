import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { notFound } from "next/navigation";

import { SmoothAnchor } from "@/components/motion/smooth-anchor";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { getDictionary, hasLocale, locales } from "@/content";

import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: {
      default: dict.meta.title,
      template: `%s | Versa Capital`,
    },
    description: dict.meta.description,
    metadataBase: new URL("https://versa.codesurmesure.ca"),
    icons: { icon: "/favicon.png" },
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${poppins.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the document as scripted before first paint so entrances can
          start hidden without a flash of unstyled content.

          The timer is the safety net: entrance styles are scoped to .js, so
          if hydration never happens the page would sit at opacity 0 forever.
          useReveal sets reveal-ready as soon as it mounts; if that has not
          happened shortly after load, we drop .js and the content simply
          appears unanimated.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('reveal-ready')){d.classList.remove('js')}},2500)})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <SmoothAnchor />
        <Header dict={dict} />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
