import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '강수현 포트폴리오',
    short_name: 'Suhyun Portfolio',
    description:
      '게임 클라이언트 프로그래머 강수현의 포트폴리오. 렌더링부터 게임플레이 시스템까지 성능과 구조를 함께 설계합니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0071E3',
    icons: [
      {
        src: '/avatar.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/avatar.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
