import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const appUrl = process.env.APP_URL || 'http://localhost:3000';
const ogImagePath = '/avatar.png';

export const metadata: Metadata = {
  title: '강수현 (Suhyun) | 게임 클라이언트 엔지니어',
  description: '게임 클라이언트 프로그래머 강수현의 포트폴리오. 렌더링부터 게임플레이 시스템까지 성능과 구조를 함께 설계합니다.',
  metadataBase: new URL(appUrl),
  openGraph: {
    title: '강수현 (Suhyun) | 게임 클라이언트 엔지니어',
    description: '게임 클라이언트 프로그래머 강수현의 포트폴리오. 렌더링부터 게임플레이 시스템까지 성능과 구조를 함께 설계합니다.',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: ogImagePath,
        width: 1024,
        height: 1024,
        alt: '강수현 프로필 이미지',
      },
    ],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-white text-neutral-950 overflow-hidden h-screen w-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
