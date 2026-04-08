import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: '강수현 (Suhyun) | 게임 클라이언트 엔지니어',
  description: '코드 한 줄의 가치를 정량적 데이터로 증명하며, 엔진의 깊은 곳을 파고드는 개발자',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-white text-neutral-950 overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}
