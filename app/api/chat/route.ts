import {NextRequest, NextResponse} from 'next/server';

export const runtime = 'nodejs';

const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

const rateLimitStore = new Map<string, number[]>();

type ChatRequestBody = {
  message?: string;
};

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip: string): {allowed: boolean; retryAfterMs: number} {
  const now = Date.now();
  const recent = (rateLimitStore.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0];
    const retryAfterMs = Math.max(0, RATE_LIMIT_WINDOW_MS - (now - oldest));
    rateLimitStore.set(ip, recent);
    return {allowed: false, retryAfterMs};
  }

  recent.push(now);
  rateLimitStore.set(ip, recent);
  return {allowed: true, retryAfterMs: 0};
}

function buildSystemPrompt(): string {
  const intro = [
    '이름: 강수현 (Suhyun Kang)',
    '직무: 게임 클라이언트 프로그래머',
    '핵심 소개: 코드 한 줄의 성능 근거를 증명하는 개발자',
    '강점: C++, 렌더링 파이프라인/엔진 내부 구조 분석, 병목 분석 및 최적화',
  ];

  const projects = [
    'Slice SkeletalMesh (UE5 Plugin): 언리얼 SkeletalMesh 실시간 절단 플러그인, Fab 마켓플레이스 상용 출시',
    'Direct3D 11 Game Engine: Multi-Pass Deferred Rendering, Uber Shader, Shadow Map, GPU Particle 구현',
    'project:EXFIL (UE5 Prototype): Dedicated Server 기반, GAS 통합, 리플리케이션, 그리드 인벤토리',
    'MIXNPOP (Mobile App): Unity 기반 Android/iOS 상용 출시',
  ];

  const skills = [
    'Language: C++, C#',
    'Engine/Renderer: Unreal Engine 5, Unity, Direct3D 11',
    'Graphics/Shader: HLSL',
    'Gameplay/System: GAS, Dedicated Server Replication, MVVM',
    'Tools: Unreal Insights, NVIDIA Nsight Graphics, RenderDoc',
    'Version Control: Git, Perforce',
  ];

  const experience = [
    '크래프톤 정글 게임테크랩 1기 (2025.3-2025.8): D3D11 자체 엔진 개발, UE5 플러그인 Fab 출시',
    'Anipen (2023.1-2025.2): Unity 기반 모바일 앱 개발, AI NPC Behavior Tree 구현',
    '메타버스 아카데미 1기 (2022.4-2022.12): Unity/C# 게임 및 XR 콘텐츠 개발, 장려상 수상',
  ];

  const contact = [
    '이메일: rkdtngus3579@gmail.com',
    'GitHub: https://github.com/agnesAqr',
    '포트폴리오 노션: https://www.notion.so/sssuhyun',
    '전화: 010-4510-4260',
  ];

  return [
    '당신은 AI 어시스턴트가 아니라, "강수현(성구)의 AI 버전"입니다.',
    '반드시 1인칭("저는", "제가")으로 대답하세요.',
    '실제 대화처럼 친근하고 자연스러운 한국어로 답하세요.',
    '질문이 제 경력/기술/프로젝트와 직접 관련이 없으면 정중하게 연결 지어 답하거나, 답변 범위를 부드럽게 좁혀주세요.',
    '채용/협업/면접 관련 질문에는 적극적으로 답하고 연락처를 안내하세요.',
    '사실과 다르게 과장하지 말고, 아래 프로필 정보를 근거로 답변하세요.',
    '',
    '[소개]',
    ...intro,
    '',
    '[프로젝트]',
    ...projects,
    '',
    '[기술]',
    ...skills,
    '',
    '[경험]',
    ...experience,
    '',
    '[연락처]',
    ...contact,
  ].join('\n');
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        errorCode: 'API_KEY_INVALID',
        message: 'API 설정을 확인해주세요.',
      },
      {status: 500},
    );
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        errorCode: 'RATE_LIMIT_EXCEEDED',
        message: '잠시 후 다시 물어봐주세요!',
        retryAfterMs: limit.retryAfterMs,
      },
      {status: 429},
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({message: '잘못된 요청 형식입니다.'}, {status: 400});
  }

  const userMessage = body.message?.trim();
  if (!userMessage) {
    return NextResponse.json({message: '메시지를 입력해주세요.'}, {status: 400});
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        system_instruction: {
          parts: [{text: buildSystemPrompt()}],
        },
        contents: [
          {
            role: 'user',
            parts: [{text: userMessage}],
          },
        ],
      }),
    });

    if (geminiRes.status === 429) {
      return NextResponse.json(
        {
          errorCode: 'API_QUOTA_EXCEEDED',
          message: '오늘 API 사용량을 초과했어요. 내일 다시 시도해주세요!',
        },
        {status: 429},
      );
    }

    if (geminiRes.status === 401 || geminiRes.status === 403) {
      return NextResponse.json(
        {
          errorCode: 'API_KEY_INVALID',
          message: 'API 설정을 확인해주세요.',
        },
        {status: 500},
      );
    }

    if (!geminiRes.ok) {
      return NextResponse.json(
        {
          errorCode: 'SERVER_ERROR',
          message: '일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
        },
        {status: 500},
      );
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p: {text?: string}) => p.text || '')
      .join('')
      .trim();

    if (!text) {
      return NextResponse.json(
        {
          errorCode: 'SERVER_ERROR',
          message: '일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
        },
        {status: 500},
      );
    }

    return NextResponse.json({message: text});
  } catch {
    return NextResponse.json(
      {
        errorCode: 'SERVER_ERROR',
        message: '일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
      },
      {status: 500},
    );
  }
}
