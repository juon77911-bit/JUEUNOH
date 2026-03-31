import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ArchiveItem, SiteConfig, ContentBlock } from '../types';
import { Plus, Trash2, Edit2, Save, X, LayoutDashboard, Briefcase, History, Settings, ChevronUp, ChevronDown, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const Admin = () => {
  const { 
    data, 
    user,
    isAuthReady,
    updateConfig, 
    addProject, 
    updateProject, 
    deleteProject, 
    reorderProjects,
    addArchiveItem, 
    updateArchiveItem, 
    deleteArchiveItem,
    reorderArchiveItems
  } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'config' | 'projects' | 'archive'>('config');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === data.config.adminPassword) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login failed:', err);
      setError('구글 로그인에 실패했습니다.');
    }
  };

  const isAdmin = user?.email === 'juon77911@gmail.com';

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-[32px] bg-zinc-900 border border-white/10 flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter">ADMIN LOGIN</h1>
            <p className="text-white/50 text-sm">관리자 페이지 접속을 위해 로그인하세요.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Password (6 digits)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors text-center tracking-[1em]"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="py-4 rounded-xl bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                비밀번호로 접속
              </button>
            </form>

            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className={`py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 border ${
                user ? 'bg-zinc-800 text-white border-white/5' : 'bg-white text-black hover:scale-[1.02]'
              }`}
            >
              <LogIn size={18} />
              {user ? '다른 구글 계정으로 로그인' : 'Google로 로그인 (데이터 저장용)'}
            </button>
            
            {user && (
              <div className="flex flex-col gap-1 items-center">
                <p className={`text-[10px] font-bold ${isAdmin ? 'text-green-400' : 'text-red-400'}`}>
                  {isAdmin ? '관리자 인증됨' : '관리자 권한 없음 (juon77911@gmail.com 필요)'}
                </p>
                <p className="text-[10px] text-white/40">{user.email}</p>
              </div>
            )}
            
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col gap-12">
      <header className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
            <LayoutDashboard size={32} style={{ color: data.config.accentColor }} />
            관리자 대시보드
          </h1>
          <p className="text-white/50">포트폴리오의 모든 내용을 실시간으로 관리하세요.</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {!user ? (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm"
            >
              <LogIn size={16} />
              Google로 인증 (데이터 저장 권한)
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-sm">
                <span className={isAdmin ? "text-green-400" : "text-red-400"}>
                  {isAdmin ? "인증됨 (관리자)" : "인증됨 (권한 없음)"}
                </span>
                <span className="text-white/30">|</span>
                <span className="text-white/50">{user.email}</span>
              </div>
              <button 
                onClick={() => signOut(auth)}
                className="text-xs text-white/30 hover:text-white/50 underline"
              >
                로그아웃
              </button>
            </div>
          )}
          {!isAdmin && user && (
            <p className="text-[10px] text-red-400/70 max-w-[200px] text-right">
              * juon77911@gmail.com 계정으로 로그인해야 데이터 저장이 가능합니다.
            </p>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'config' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
          }`}
        >
          사이트 설정
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'projects' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
          }`}
        >
          프로젝트 관리
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'archive' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
          }`}
        >
          아카이브 관리
        </button>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'config' && <ConfigEditor key="config" config={data.config} onSave={updateConfig} />}
          {activeTab === 'projects' && (
            <ProjectManager
              key="projects"
              projects={data.projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
              accentColor={data.config.accentColor}
              reorderProjects={reorderProjects}
            />
          )}
          {activeTab === 'archive' && (
            <ArchiveManager
              key="archive"
              archive={data.archive}
              onAdd={addArchiveItem}
              onUpdate={updateArchiveItem}
              onDelete={deleteArchiveItem}
              accentColor={data.config.accentColor}
              reorderArchiveItems={reorderArchiveItems}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ConfigEditor = ({ config, onSave }: { config: SiteConfig; onSave: (c: SiteConfig) => void; key?: string }) => {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('설정이 저장되었습니다.');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="grid gap-12 max-w-4xl"
    >
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold border-l-4 pl-4 border-white/20">기본 정보</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">포인트 컬러</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={formData.accentColor}
                onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              />
              <span className="text-sm font-mono text-white/60">{formData.accentColor}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">보조 컬러</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              />
              <span className="text-sm font-mono text-white/60">{formData.secondaryColor}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">슬로건</label>
          <input
            type="text"
            value={formData.slogan}
            onChange={e => setFormData({ ...formData, slogan: e.target.value })}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">관리자 비밀번호 (6자리)</label>
          <input
            type="password"
            maxLength={6}
            value={formData.adminPassword}
            onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold border-l-4 pl-4 border-white/20">폰트 크기 설정 (px)</h3>
        <div className="grid grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">슬로건</label>
            <input
              type="number"
              value={formData.fontSizes.slogan}
              onChange={e => setFormData({ ...formData, fontSizes: { ...formData.fontSizes, slogan: parseInt(e.target.value) } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">본문</label>
            <input
              type="number"
              value={formData.fontSizes.body}
              onChange={e => setFormData({ ...formData, fontSizes: { ...formData.fontSizes, body: parseInt(e.target.value) } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">헤더</label>
            <input
              type="number"
              value={formData.fontSizes.heading}
              onChange={e => setFormData({ ...formData, fontSizes: { ...formData.fontSizes, heading: parseInt(e.target.value) } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">프로젝트 줄 간격</label>
            <input
              type="number"
              step="0.1"
              value={formData.fontSizes.projectLineHeight || 1.7}
              onChange={e => setFormData({ ...formData, fontSizes: { ...formData.fontSizes, projectLineHeight: parseFloat(e.target.value) } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold border-l-4 pl-4 border-white/20">섹션 설명 문구</h3>
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">ABOUT 섹션 설명</label>
            <input
              type="text"
              value={formData.sectionDescriptions.about}
              onChange={e => setFormData({ ...formData, sectionDescriptions: { ...formData.sectionDescriptions, about: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">PROJECTS 섹션 설명</label>
            <input
              type="text"
              value={formData.sectionDescriptions.projects}
              onChange={e => setFormData({ ...formData, sectionDescriptions: { ...formData.sectionDescriptions, projects: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">ARCHIVE 섹션 설명</label>
            <input
              type="text"
              value={formData.sectionDescriptions.archive}
              onChange={e => setFormData({ ...formData, sectionDescriptions: { ...formData.sectionDescriptions, archive: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold border-l-4 pl-4 border-white/20">자기소개 상세</h3>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">자기소개 요약 (Identity)</label>
          <textarea
            rows={2}
            value={formData.identity}
            onChange={e => setFormData({ ...formData, identity: e.target.value })}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">상세 소개 (About)</label>
          <textarea
            rows={4}
            value={formData.about}
            onChange={e => setFormData({ ...formData, about: e.target.value })}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">자기소개 이미지 (최대 5장)</label>
          <div className="grid grid-cols-5 gap-4">
            {(formData.aboutImages || []).map((img, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group">
                <img src={img} alt="About" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, aboutImages: formData.aboutImages.filter((_, idx) => idx !== i) })}
                  className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {(formData.aboutImages || []).length < 5 && (
              <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 transition-colors flex flex-col items-center justify-center cursor-pointer gap-2">
                <Plus size={24} className="text-white/30" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Upload</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    Array.from(files).forEach((file: File) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({
                          ...prev,
                          aboutImages: [...(prev.aboutImages || []), reader.result as string].slice(0, 5)
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">보유 기술 (Skills - 콤마로 구분)</label>
          <input
            type="text"
            value={(formData.skills || []).join(', ')}
            onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">학력 (Education)</label>
            <textarea
              rows={5}
              placeholder="한 줄에 하나씩 입력하세요"
              value={(formData.education || []).join('\n')}
              onChange={e => setFormData({ ...formData, education: e.target.value.split('\n').filter(s => s.trim()) })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">경력 (Experience)</label>
            <textarea
              rows={5}
              placeholder="한 줄에 하나씩 입력하세요"
              value={(formData.experience || []).join('\n')}
              onChange={e => setFormData({ ...formData, experience: e.target.value.split('\n').filter(s => s.trim()) })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold border-l-4 pl-4 border-white/20">프로젝트 항목 레이블</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Problem Statement</label>
            <input
              type="text"
              value={formData.projectLabels.problem}
              onChange={e => setFormData({ ...formData, projectLabels: { ...formData.projectLabels, problem: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Approach</label>
            <input
              type="text"
              value={formData.projectLabels.approach}
              onChange={e => setFormData({ ...formData, projectLabels: { ...formData.projectLabels, approach: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Key Insights</label>
            <input
              type="text"
              value={formData.projectLabels.insights}
              onChange={e => setFormData({ ...formData, projectLabels: { ...formData.projectLabels, insights: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Actions & Impact</label>
            <input
              type="text"
              value={formData.projectLabels.impact}
              onChange={e => setFormData({ ...formData, projectLabels: { ...formData.projectLabels, impact: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Contribution</label>
            <input
              type="text"
              value={formData.projectLabels.contribution}
              onChange={e => setFormData({ ...formData, projectLabels: { ...formData.projectLabels, contribution: e.target.value } })}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="mt-4 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
      >
        <Save size={18} /> 설정 저장하기
      </button>
    </motion.form>
  );
};

const ProjectManager = ({ projects, onAdd, onUpdate, onDelete, accentColor, reorderProjects }: {
  projects: Project[];
  onAdd: (p: Project) => void;
  onUpdate: (p: Project) => void;
  onDelete: (id: string) => void;
  accentColor: string;
  reorderProjects: (start: number, end: number) => void;
  key?: string;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyProject: Project = {
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    subtitle: '',
    about: '',
    client: '',
    services: '',
    liveUrl: '',
    date: '',
    metrics: '',
    imageFilter: 'none',
    tools: [],
    images: ['https://picsum.photos/seed/new/1200/800'],
    contentBlocks: [
      { id: '1', type: 'text', title: 'Project Details', content: '', sectionId: 'details' },
      { id: '2', type: 'text', title: 'Things I Did', content: '', sectionId: 'things' }
    ],
    visibleSections: {
      details: true,
      things: true
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">프로젝트 리스트</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} /> 프로젝트 추가
        </button>
      </div>

      <div className="grid gap-6">
        {(projects || []).map((project, index) => (
          <div key={project.id} className="p-6 rounded-2xl bg-zinc-900 border border-white/10 flex justify-between items-center group">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white/30">{project.date}</span>
              <h3 className="text-xl font-bold">{project.title}</h3>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => index > 0 && reorderProjects(index, index - 1)}
                disabled={index === 0}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-20"
              >
                <ChevronUp size={18} />
              </button>
              <button
                onClick={() => index < projects.length - 1 && reorderProjects(index, index + 1)}
                disabled={index === projects.length - 1}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-20"
              >
                <ChevronDown size={18} />
              </button>
              <button
                onClick={() => setEditingId(project.id)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 relative"
            >
              <button
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="absolute top-8 right-8 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <ProjectForm
                project={isAdding ? emptyProject : projects.find(p => p.id === editingId)!}
                onSave={(p) => {
                  if (isAdding) onAdd(p);
                  else onUpdate(p);
                  setIsAdding(false);
                  setEditingId(null);
                }}
                accentColor={accentColor}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProjectForm = ({ project, onSave, accentColor }: { project: Project; onSave: (p: Project) => void; accentColor: string }) => {
  const [formData, setFormData] = useState<Project>(project);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, blockId?: string) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (blockId) {
          // Upload to specific block
          setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.map(b => 
              b.id === blockId ? { ...b, content: base64String } : b
            )
          }));
        } else {
          // Upload to main images
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, base64String].slice(0, 5)
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addBlock = (type: 'text' | 'image') => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type === 'text' ? 'New Section' : '',
      content: '',
      sectionId: `section-${Date.now()}`
    };
    setFormData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock],
      visibleSections: { ...prev.visibleSections, [newBlock.sectionId]: true }
    }));
  };

  const removeBlock = (id: string) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter(b => b.id !== id)
    }));
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const toggleVisibility = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [sectionId]: !prev.visibleSections[sectionId]
      }
    }));
  };

  const reorderBlocks = (startIndex: number, endIndex: number) => {
    const result = Array.from(formData.contentBlocks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setFormData({ ...formData, contentBlocks: result });
  };

  const applyTag = (textareaId: string, tag: string, blockId?: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    let startTag = '';
    let endTag = '';

    if (tag === 'bold') {
      startTag = '<strong>';
      endTag = '</strong>';
    } else if (tag === 'main') {
      startTag = '<span class="text-main">';
      endTag = '</span>';
    } else if (tag === 'sub') {
      startTag = '<span class="text-sub">';
      endTag = '</span>';
    }

    const newText = beforeText + startTag + selectedText + endTag + afterText;
    
    if (blockId) {
      setFormData(prev => ({
        ...prev,
        contentBlocks: prev.contentBlocks.map(b => 
          b.id === blockId ? { ...b, content: newText } : b
        )
      }));
    } else {
      // For main project description
      setFormData(prev => ({ ...prev, about: newText }));
    }

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  const Toolbar = ({ id, blockId }: { id: string; blockId?: string }) => (
    <div className="flex gap-2 mb-2">
      <button
        type="button"
        onClick={() => applyTag(id, 'bold', blockId)}
        className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-colors"
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => applyTag(id, 'main', blockId)}
        className="px-3 py-1 rounded bg-main/20 hover:bg-main/30 text-[10px] font-bold uppercase tracking-widest border border-main/30 text-main transition-colors"
      >
        Main Color
      </button>
      <button
        type="button"
        onClick={() => applyTag(id, 'sub', blockId)}
        className="px-3 py-1 rounded bg-sub/20 hover:bg-sub/30 text-[10px] font-bold uppercase tracking-widest border border-sub/30 text-sub transition-colors"
      >
        Sub Color
      </button>
    </div>
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="flex flex-col gap-12">
      {/* Basic Info Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">제목</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">부제목 (Subtitle)</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">날짜 (예: 2024.01 - 2024.12)</label>
            <input
              type="text"
              required
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">About the project</label>
            <Toolbar id="project-about" />
            <textarea
              id="project-about"
              rows={3}
              value={formData.about || ''}
              onChange={e => setFormData({ ...formData, about: e.target.value })}
              className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Metrics (예: 146%)</label>
              <input
                type="text"
                value={formData.metrics || ''}
                onChange={e => setFormData({ ...formData, metrics: e.target.value })}
                className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Image Filter</label>
              <select
                value={formData.imageFilter || 'none'}
                onChange={e => setFormData({ ...formData, imageFilter: e.target.value as any })}
                className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
              >
                <option value="none">None</option>
                <option value="grayscale">Grayscale</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Tools (콤마로 구분)</label>
            <input
              type="text"
              value={(formData.tools || []).join(', ')}
              onChange={e => setFormData({ ...formData, tools: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">메인 이미지 (최대 5장)</label>
            <div className="grid grid-cols-5 gap-2">
              {formData.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {formData.images.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-white/30 transition-colors flex flex-col items-center justify-center cursor-pointer gap-2">
                  <Plus size={20} className="text-white/30" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Blocks Section */}
      <div className="flex flex-col gap-8 pt-12 border-t border-white/10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold uppercase tracking-widest">세부 페이지 구성 (Content Blocks)</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => addBlock('text')}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Plus size={14} /> 텍스트 블록 추가
            </button>
            <button
              type="button"
              onClick={() => addBlock('image')}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Plus size={14} /> 이미지 블록 추가
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {formData.contentBlocks.map((block, index) => (
            <div key={block.id} className="p-6 rounded-2xl bg-black border border-white/10 flex flex-col gap-6 relative group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => index > 0 && reorderBlocks(index, index - 1)}
                      disabled={index === 0}
                      className="text-white/20 hover:text-white disabled:opacity-0"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => index < formData.contentBlocks.length - 1 && reorderBlocks(index, index + 1)}
                      disabled={index === formData.contentBlocks.length - 1}
                      className="text-white/20 hover:text-white disabled:opacity-0"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                    {block.type === 'text' ? 'Text Block' : 'Image Block'}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visibleSections[block.sectionId!] ?? true}
                      onChange={() => toggleVisibility(block.sectionId!)}
                      className="w-4 h-4 rounded border-white/10 bg-black text-main focus:ring-0"
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Visible</span>
                  </label>
                  {block.type === 'image' && block.content && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mainImage: block.content })}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                        formData.mainImage === block.content
                          ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                          : 'bg-white/5 text-white/30 border border-white/10'
                      }`}
                    >
                      {formData.mainImage === block.content ? 'Main Image' : 'Set as Main'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    className="text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {block.type === 'text' ? (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="섹션 제목 (선택 사항)"
                    value={block.title || ''}
                    onChange={e => updateBlock(block.id, { title: e.target.value })}
                    className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors font-bold"
                  />
                  <Toolbar id={`block-content-${block.id}`} blockId={block.id} />
                  <textarea
                    id={`block-content-${block.id}`}
                    placeholder="내용을 입력하세요"
                    rows={6}
                    value={block.content}
                    onChange={e => updateBlock(block.id, { content: e.target.value })}
                    className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {block.content ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                      <img src={block.content} alt="Block Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => updateBlock(block.id, { content: '' })}
                        className="absolute inset-0 bg-red-500/80 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 transition-colors flex flex-col items-center justify-center cursor-pointer gap-4">
                      <Plus size={32} className="text-white/30" />
                      <span className="text-sm font-bold uppercase tracking-widest text-white/20">Upload Image Block</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, block.id)} className="hidden" />
                    </label>
                  )}
                  <input
                    type="text"
                    placeholder="이미지 캡션 (선택 사항)"
                    value={block.title || ''}
                    onChange={e => updateBlock(block.id, { title: e.target.value })}
                    className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="px-8 py-5 rounded-full text-black font-bold hover:scale-105 transition-transform text-lg"
        style={{ backgroundColor: accentColor }}
      >
        프로젝트 저장하기
      </button>
    </form>
  );
};

const ArchiveManager = ({ archive, onAdd, onUpdate, onDelete, accentColor, reorderArchiveItems }: {
  archive: ArchiveItem[];
  onAdd: (a: ArchiveItem) => void;
  onUpdate: (a: ArchiveItem) => void;
  onDelete: (id: string) => void;
  accentColor: string;
  reorderArchiveItems: (start: number, end: number) => void;
  key?: string;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [detailsValue, setDetailsValue] = useState('');

  const emptyItem: ArchiveItem = {
    id: Math.random().toString(36).substr(2, 9),
    year: '',
    category: '',
    title: '',
    details: []
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">아카이브 리스트</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} /> 항목 추가
        </button>
      </div>

      <div className="grid gap-4">
        {(archive || []).map((item, index) => (
          <div key={item.id} className="p-6 rounded-2xl bg-zinc-900 border border-white/10 flex justify-between items-center group">
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold w-16" style={{ color: accentColor }}>{item.year}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{item.category}</span>
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => index > 0 && reorderArchiveItems(index, index - 1)}
                disabled={index === 0}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-20"
              >
                <ChevronUp size={18} />
              </button>
              <button
                onClick={() => index < archive.length - 1 && reorderArchiveItems(index, index + 1)}
                disabled={index === archive.length - 1}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-20"
              >
                <ChevronDown size={18} />
              </button>
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setDetailsValue(item.details.join('\n'));
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-lg p-8 md:p-12 relative"
            >
              <button
                onClick={() => { 
                  setIsAdding(false); 
                  setEditingId(null);
                  setDetailsValue('');
                }}
                className="absolute top-8 right-8 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as any;
                  const newItem: ArchiveItem = {
                    id: isAdding ? Math.random().toString(36).substr(2, 9) : editingId!,
                    year: form.year.value,
                    category: form.category.value,
                    title: form.title.value,
                    details: detailsValue.split('\n').filter(d => d.trim())
                  };
                  if (isAdding) onAdd(newItem);
                  else onUpdate(newItem);
                  setIsAdding(false);
                  setEditingId(null);
                  setDetailsValue('');
                }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-2xl font-bold tracking-tight mb-4">아카이브 항목 {isAdding ? '추가' : '수정'}</h3>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">연도</label>
                  <input
                    name="year"
                    type="text"
                    required
                    defaultValue={isAdding ? '' : archive.find(a => a.id === editingId)?.year}
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">카테고리</label>
                  <input
                    name="category"
                    type="text"
                    required
                    defaultValue={isAdding ? '' : archive.find(a => a.id === editingId)?.category}
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">제목</label>
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={isAdding ? '' : archive.find(a => a.id === editingId)?.title}
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">상세 설명 (한 줄에 하나씩)</label>
                  <textarea
                    rows={5}
                    required
                    value={detailsValue}
                    onChange={(e) => setDetailsValue(e.target.value)}
                    placeholder="상세 내용을 입력하세요 (엔터로 구분)"
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 px-8 py-4 rounded-full text-black font-bold hover:scale-105 transition-transform"
                  style={{ backgroundColor: accentColor }}
                >
                  항목 저장하기
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Admin;
