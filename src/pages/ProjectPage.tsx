import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, ExternalLink, ChevronRight } from 'lucide-react';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = usePortfolio();
  const project = data.projects.find(p => p.id === id);
  const projectIndex = data.projects.findIndex(p => p.id === id);
  const nextProject = projectIndex < data.projects.length - 1 ? data.projects[projectIndex + 1] : data.projects[0];

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
        <p className="text-white/50">프로젝트를 찾을 수 없습니다.</p>
        <Link to="/" className="px-6 py-2 rounded-full bg-white text-black font-bold">홈으로 돌아가기</Link>
      </div>
    );
  }

  const renderText = (text: string) => {
    if (!text) return null;
    const lineHeight = data.config.fontSizes.projectLineHeight || 1.7;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmedLine = line.trim();
      
      // Handle list items
      if (trimmedLine.startsWith('*')) {
        return (
          <div key={i} className="flex gap-4 items-start mb-4">
            <span className="mt-2.5 w-2 h-2 bg-[#00E5FF] shrink-0" />
            <span 
              className="text-[#DEDEDE] text-[17px]"
              style={{ lineHeight }}
              dangerouslySetInnerHTML={{ __html: trimmedLine.substring(1).trim() }}
            />
          </div>
        );
      }

      // Handle empty lines (spacing)
      if (trimmedLine === '') {
        return <div key={i} className="h-4" />;
      }

      // Regular paragraphs
      return (
        <p 
          key={i} 
          className={`text-[#DEDEDE] text-[17px] ${i < lines.length - 1 ? 'mb-4' : ''}`}
          style={{ lineHeight }}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00E5FF] selection:text-black font-sans relative overflow-hidden select-none">
      {/* Background Effects */}
      <div className="bg-grid opacity-30 fixed inset-0" />
      <div className="bg-noise opacity-10 fixed inset-0" />
      
      {/* Spotlight Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 229, 255, 0.08), transparent 100%)`
        }}
      />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#00E5FF] z-[110] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-[#00E5FF]/30 px-6 py-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="flex flex-col gap-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] hover:text-white transition-colors group w-fit"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return to Index
            </button>
            <div className="flex flex-col gap-6">
              <h1 
                className="font-black tracking-tighter leading-none text-white"
                style={{ fontSize: data.config.fontSizes.projectTitleTop ? `${data.config.fontSizes.projectTitleTop}px` : '72px' }}
              >
                {project.title}
              </h1>
              <div className="flex flex-col gap-2">
                <div 
                  className="text-sm md:text-[16px] text-[#A0A0A0] leading-[1.8] max-w-2xl font-medium pre-wrap"
                  dangerouslySetInnerHTML={{ __html: project.about || project.description || project.subtitle || '' }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 md:gap-16 pb-1">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">Date</span>
              <span className="text-sm font-medium text-[#DEDEDE]">{project.date}</span>
            </div>
            {project.tools && project.tools.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">Tools</span>
                <div className="flex flex-wrap gap-2 max-w-[200px]">
                  {project.tools.map((tool, i) => (
                    <span key={i} className="text-sm font-medium text-[#DEDEDE]">{tool}{i < project.tools!.length - 1 ? ',' : ''}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-[450px] pb-48 px-6 max-w-5xl mx-auto flex flex-col gap-48 relative z-20">
        {/* Content Blocks */}
        <div className="flex flex-col gap-64">
          {project.contentBlocks.map((block, index) => {
            if (project.visibleSections[block.sectionId!] === false) return null;

            return (
              <motion.section
                key={block.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="w-full flex flex-col gap-16"
              >
                {block.type === 'text' ? (
                  <div className="flex flex-col gap-12">
                    {block.title && (
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-[3px] bg-[#00E5FF]" />
                        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-white">{block.title}</h2>
                      </div>
                    )}
                    <div className="text-[17px] text-[#DEDEDE] leading-relaxed font-normal pre-wrap" style={{ wordBreak: 'keep-all' }}>
                      {renderText(block.content)}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    <div className="rounded-[20px] overflow-hidden border border-white/10 shadow-2xl group bg-zinc-900/50">
                      <img 
                        src={block.content} 
                        alt={block.title || project.title} 
                        className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {block.title && (
                      <p className="text-center text-[11px] font-bold text-white/30 tracking-[0.4em] uppercase mt-2">{block.title}</p>
                    )}
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="px-6 py-32 border-t border-white/5 relative z-20">
        <div className="max-w-5xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-12 block text-center">Up Next</span>
          
          <Link 
            to={`/project/${nextProject.id}`}
            className="group block relative p-12 md:p-20 rounded-[40px] border border-white/10 bg-zinc-900/20 overflow-hidden transition-all duration-700 hover:border-[#00E5FF]/40 hover:bg-zinc-900/40"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-[#00E5FF]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-[#00E5FF]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex flex-col gap-6 text-center md:text-left">
                <h3 
                  className="font-black tracking-tighter leading-none group-hover:text-[#00E5FF] transition-colors duration-500"
                  style={{ fontSize: data.config.fontSizes.projectTitleBottom ? `${data.config.fontSizes.projectTitleBottom}px` : '72px' }}
                >
                  {nextProject.title}
                </h3>
                <p className="text-lg md:text-xl text-white/40 font-medium max-w-md">
                  {nextProject.subtitle || (nextProject.description ? nextProject.description.substring(0, 100) + '...' : '')}
                </p>
              </div>
              
              <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#00E5FF] group-hover:bg-[#00E5FF] group-hover:text-black transition-all duration-700 shrink-0 shadow-[0_0_20px_rgba(0,229,255,0)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                <ChevronRight size={40} />
              </div>
            </div>
          </Link>

        </div>
      </footer>
    </div>
  );
};

export default ProjectPage;
