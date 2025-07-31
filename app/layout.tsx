import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-context"
import { AuthProvider } from "@/hooks/use-auth"
import { LanguageProvider } from "@/components/language/language-context"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/lib/query-client"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lồng Đèn Ông Vương",
  description: "Xưởng Lồng Đèn gia truyền, lồng đèn các loại",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
