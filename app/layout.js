import { Sora, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata = {
  title: 'FarmLink — Fresh From the Farm',
  description: 'Order fresh vegetables directly from local farmers. No middlemen, better prices.',
  manifest: '/manifest.json',
  // themeColor and viewport moved/removed to avoid unsupported metadata warnings
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${jetbrains.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
