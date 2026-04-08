'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Briefcase, 
  Layers, 
  FileText, 
  UserSearch, 
  MessageSquare, 
  ArrowRight,
  Home
} from 'lucide-react';
import Image from 'next/image';

// --- Types ---
type Tab = 'home' | 'intro' | 'projects' | 'skills' | 'experience' | 'contact' | 'chat';

// --- Components ---

const CursorTrail = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; age: number; color: string; size: number }[]>([]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const addPoint = (e: MouseEvent) => {
      const colors = ['#0071E3', '#5E5CE6', '#64D2FF', '#BF5AF2', '#FF375F', '#FFD60A', '#32D74B'];
      for (let i = 0; i < 3; i++) {
        points.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          age: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 15 + 5
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      points.current = points.current.filter(p => p.age < 100);
      
      points.current.forEach(p => {
        p.age += 1;
        const opacity = 1 - p.age / 100;
        const size = p.size * opacity;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(opacity * 200).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Add a slight glow
        ctx.shadowBlur = 15 * opacity;
        ctx.shadowColor = p.color;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', addPoint);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', addPoint);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [chatInput, setChatInput] = useState('');

  const tabs = [
    { id: 'intro', label: 'Me', icon: Smile },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Layers },
    { id: 'experience', label: 'Resume', icon: FileText },
    { id: 'contact', label: 'Contact', icon: UserSearch },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const isHome = activeTab === 'home';
  const showChatInput = activeTab === 'home' || activeTab === 'chat';

  return (
    <main className="relative h-screen w-screen flex flex-col items-center bg-white overflow-hidden selection:bg-[#0071E3] selection:text-white">
      {/* Background Text - Only on Home */}
      {isHome && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
          <div className="sm:block lg:text-[16rem] hidden select-none bg-linear-to-b from-neutral-400/10 to-transparent bg-clip-text text-[10rem] font-black leading-none text-transparent -mb-10">
            jobs
          </div>
        </div>
      )}

      {/* Cursor Trail - Only on Home */}
      <CursorTrail active={isHome} />

      {/* Header - Hidden on Home */}
      <AnimatePresence>
        {!isHome && (
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 bg-white/60 backdrop-blur-xl border-b border-neutral-100"
          >
            <div className="w-full max-w-[640px] flex items-center">
              <button 
                onClick={() => setActiveTab('home')}
                className="relative h-10 w-10 overflow-hidden rounded-full border border-neutral-200 active:scale-95 transition-transform bg-[#0071E3] flex items-center justify-center text-white font-bold text-xs"
              >
                SJ
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className={`w-full max-w-[640px] flex-1 overflow-y-auto no-scrollbar z-10 px-6 ${!isHome ? 'pt-24 pb-48' : 'flex items-center justify-center'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950">Suhyun Kang</h2>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950">Game Client Programmer</h1>
                <p className="text-neutral-500 mt-4 max-w-md mx-auto">
                  코드 한 줄의 성능 근거를 증명하는 개발자
                </p>
              </div>
              <div className="relative h-44 w-44 sm:h-60 sm:w-60 overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
                <div className="bg-[#0071E3] w-full h-full flex items-center justify-center text-white font-bold text-5xl">
                  KS
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold">소개</h1>
              <p className="text-lg text-neutral-600 leading-relaxed whitespace-pre-wrap">
                C++에 대한 깊은 이해와 엔진 내부 구조 분석 역량을 기반으로, 렌더링 파이프라인부터 게임플레이 시스템까지 전 레이어의 병목을 분석하고 해결하는 게임 프로그래머 강수현입니다. Direct3D 11 자체 엔진 개발을 통해 렌더링 파이프라인을 로우레벨에서 직접 설계·구현했고, 이 경험을 바탕으로 UE5에서 SkeletalMesh 런타임 절단 플러그인을 Fab 마켓플레이스에 상용 출시했습니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Game Client', 'C++', 'Unreal Engine 5', 'Direct3D 11', 'HLSL', 'Low-Level Graphics'].map((k) => (
                  <span key={k} className="px-3 py-1 bg-neutral-100 rounded-full text-sm font-medium text-neutral-600">
                    {k}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div 
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold">프로젝트</h1>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { 
                    type: 'UE5 Plugin', 
                    title: 'Slice SkeletalMesh', 
                    desc: '언리얼 SkeletalMesh 실시간 절단 플러그인 — Fab 마켓플레이스 상용 출시', 
                    tech: 'UE 5.6, C++, Perforce', 
                    link: 'https://www.fab.com/listings/YOUR_FAB_LINK' 
                  },
                  { 
                    type: 'Custom Engine', 
                    title: 'Direct3D 11 Game Engine', 
                    desc: 'Multi-Pass Deferred Rendering 파이프라인, Uber Shader, Shadow Map, GPU Particle 구현', 
                    tech: 'Direct3D 11, C++, HLSL, RenderDoc', 
                    link: 'https://github.com/agnesAqr' 
                  },
                  { 
                    type: 'UE5 Prototype', 
                    title: 'project:EXFIL', 
                    desc: 'Dedicated Server 기반 서바이벌 프로토타입 — GAS 통합, 리플리케이션, 그리드 인벤토리', 
                    tech: 'UE 5.6, C++, Rider', 
                    link: 'https://github.com/agnesAqr/project_EXFIL' 
                  },
                  { 
                    type: 'Mobile App', 
                    title: 'MIXNPOP', 
                    desc: '팝업스토어 체험 모바일 서비스앱 — Android/iOS 상용 출시', 
                    tech: 'Unity, C#, Android, iOS', 
                    link: 'https://github.com/agnesAqr' 
                  }
                ].map((p, i) => (
                  <div key={i} className="group p-6 rounded-3xl bg-neutral-50 border border-neutral-100 hover:border-[#0071E3] transition-colors">
                    <span className="text-xs font-bold text-[#0071E3] uppercase tracking-wider">{p.type}</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{p.title}</h3>
                    <p className="text-neutral-600 mb-4">{p.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400 font-mono">{p.tech}</span>
                      {p.link !== '#' && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#0071E3]">
                          <ArrowRight size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div 
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold">기술</h1>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">Language</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'C++', icon: 'cplusplus' },
                      { name: 'C#', icon: 'csharp' }
                    ].map((s) => (
                      <div key={s.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <Image src={`https://cdn.simpleicons.org/${s.icon}`} alt={s.name} width={16} height={16} referrerPolicy="no-referrer" />
                        <span className="font-medium">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">Engine & Renderer</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Unreal Engine 5', icon: 'unrealengine' },
                      { name: 'Unity', icon: 'unity' },
                      { name: 'Direct3D 11', icon: 'microsoft' }
                    ].map((s) => (
                      <div key={s.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <Image src={`https://cdn.simpleicons.org/${s.icon}`} alt={s.name} width={16} height={16} referrerPolicy="no-referrer" />
                        <span className="font-medium">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">Graphics & Shader</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
                      <span className="font-medium">HLSL</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">Gameplay & System</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Gameplay Ability System(GAS)', 'Dedicated Server Replication', 'MVVM Architecture'].map((s) => (
                      <div key={s} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="font-medium">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">Tools & Debugging</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Unreal Insights', 'NVIDIA Nsight Graphics', 'RenderDoc'].map((s) => (
                      <div key={s} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="font-medium">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">Version Control</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Git', icon: 'git' },
                      { name: 'Perforce', icon: 'perforce' }
                    ].map((s) => (
                      <div key={s.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <Image src={`https://cdn.simpleicons.org/${s.icon}`} alt={s.name} width={16} height={16} referrerPolicy="no-referrer" />
                        <span className="font-medium">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'experience' && (
            <motion.div 
              key="experience"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold">경험</h1>
              <div className="space-y-6">
                {[
                  { company: '크래프톤 정글 게임테크랩 1기', role: 'D3D11 자체 엔진 개발, UE5 SkeletalMesh 절단 플러그인 Fab 출시', period: '2025.3 - 2025.8' },
                  { company: 'Anipen', role: 'Unity 기반 모바일(iOS/Android) 앱 개발, AI NPC Behavior Tree 구현', period: '2023.1 - 2025.2' },
                  { company: '메타버스 아카데미 1기', role: 'Unity/C# 게임 및 XR 콘텐츠 개발, 최종 성과공유회 장려상', period: '2022.4 - 2022.12' }
                ].map((exp, i) => (
                  <div key={i} className="flex justify-between items-start border-l-2 border-neutral-100 pl-6 py-2">
                    <div>
                      <h3 className="font-bold text-lg">{exp.company}</h3>
                      <p className="text-neutral-500">{exp.role}</p>
                    </div>
                    <span className="text-sm text-neutral-400 whitespace-nowrap ml-4">{exp.period}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold">연락처</h1>
              <div className="grid grid-cols-1 gap-4">
                <a href="https://www.notion.so/sssuhyun" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors">
                  <FileText className="text-[#0071E3]" />
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 font-bold uppercase">WIKI (Portfolio)</span>
                    <span>Notion WIKI</span>
                  </div>
                </a>
                <a href="mailto:rkdtngus3579@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors">
                  <UserSearch className="text-[#0071E3]" />
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 font-bold uppercase">Email</span>
                    <span>rkdtngus3579@gmail.com</span>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="h-6 w-6 flex items-center justify-center text-[#0071E3]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 font-bold uppercase">Phone</span>
                    <span>010-4510-4260</span>
                  </div>
                </div>
                <a href="https://github.com/agnesAqr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors">
                  <Image src="https://cdn.simpleicons.org/github" alt="GitHub" width={24} height={24} referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 font-bold uppercase">GitHub</span>
                    <span>github.com/agnesAqr</span>
                  </div>
                </a>
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="p-4 rounded-full bg-neutral-50">
                <MessageSquare size={48} className="text-neutral-300" />
              </div>
              <h2 className="text-2xl font-bold">AI 채팅</h2>
              <p className="text-neutral-500">준비 중입니다. 곧 만나보실 수 있습니다.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Fixed Area */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center px-4 pb-8 pointer-events-none">
        <div className="w-full max-w-[640px] flex flex-col items-center space-y-4 pointer-events-auto">
          {/* Chat Input */}
          <AnimatePresence>
            {showChatInput && (
              <motion.form 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onSubmit={(e) => e.preventDefault()}
                className="w-full"
              >
                <div className="relative flex items-center bg-white/60 backdrop-blur-xl border border-neutral-200 rounded-full p-1.5 shadow-lg focus-within:border-[#0071E3] transition-all">
                  <input 
                    type="text" 
                    placeholder="무엇이든 물어보세요..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-neutral-800 placeholder:text-neutral-400"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="bg-[#0071E3] text-white p-2 rounded-full disabled:opacity-50 active:scale-95 transition-all"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Tab Bar */}
          <nav className="bg-white/70 backdrop-blur-2xl border border-neutral-100 rounded-full p-1.5 shadow-xl flex items-center justify-between w-full">
            {/* Home button (only if not on home) */}
            {!isHome && (
              <button 
                onClick={() => setActiveTab('home')}
                className="p-3 rounded-full text-neutral-400 hover:bg-neutral-50 transition-colors"
              >
                <Home size={22} />
              </button>
            )}
            
            <div className="flex-1 flex items-center justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as Tab)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#0071E3] text-white shadow-md' 
                        : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <Icon size={22} />
                    <span className={`text-sm font-medium hidden md:block ${isActive ? 'block' : 'hidden'}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </main>
  );
}
