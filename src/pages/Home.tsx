import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Calendar, ChevronRight, History, Code, Target, Wrench, Database, Layers } from 'lucide-react';
import { Project, ArchiveItem } from '../types';

const Counter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
};

const Home = () => {
  const { data } = usePortfolio();
  const { config, projects, archive } = data;
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Group archive items by category
  const groupedArchive = (archive || []).reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ArchiveItem[]>);

  // Sort categories and items within them
  const archiveCategories = Object.keys(groupedArchive).sort();
  archiveCategories.forEach(cat => {
    groupedArchive[cat].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 50;
    const moveY = (clientY - window.innerHeight / 2) / 50;
    setGridOffset({ x: -moveX, y: -moveY });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div 
      className="flex flex-col gap-48 pb-48 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ 
        '--grid-x': `${gridOffset.x}px`, 
        '--grid-y': `${gridOffset.y}px` 
      } as any}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left bg-main"
        style={{ scaleX }}
      />

      {/* Tracing Data Flow - Subtle Animated Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: ['-100%', '100%'],
            opacity: [0, 0.2, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute left-1/4 w-px h-64 bg-gradient-to-b from-transparent via-sub to-transparent"
        />
        <motion.div
          animate={{ 
            y: ['100%', '-100%'],
            opacity: [0, 0.1, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "linear",
            delay: 2
          }}
          className="absolute right-1/3 w-px h-96 bg-gradient-to-b from-transparent via-blue-500 to-transparent"
        />
      </div>

      {/* Sophisticated Background */}
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/[0.02] blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/[0.01] blur-[150px]" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[150px] opacity-10"
          style={{ background: `radial-gradient(circle, var(--main-color) 0%, transparent 70%)` }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-10 items-center text-center"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <span className="w-12 h-px bg-white/20" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">HR Strategy & Operations Portfolio</span>
            <span className="w-12 h-px bg-white/20" />
          </motion.div>
          
              <div className="flex flex-col gap-12 items-center">
            <motion.h1 
              variants={itemVariants}
              className="font-bold tracking-[-0.05em] leading-[0.85] max-w-6xl md:text-[160px] text-[32px]"
              style={{ fontSize: config.fontSizes?.slogan ? `${config.fontSizes.slogan}px` : undefined }}
            >
              {config.slogan.split(' ').map((word, i) => (
                <span key={i} className="inline-block mx-3">
                  {word === 'HR' || word === '전략가' || word === 'About' || word === 'Me' ? (
                    <span style={{ letterSpacing: '0.02em' }} className="italic font-serif text-main">{word}</span>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 flex items-center gap-6"
            >
              <div className="w-px h-12 bg-sub/50 shadow-[0_0_15px_var(--sub-color)]" />
              <p 
                className="font-medium tracking-tight max-w-3xl leading-[1.8] text-sub opacity-90 drop-shadow-[0_0_12px_var(--sub-color)] md:text-[20px] text-[16px]"
              >
                {config.identity}
              </p>
              <div className="w-px h-12 bg-sub/50 shadow-[0_0_15px_var(--sub-color)]" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Identity Section (Expanded) */}
      <div className="section-divider" />
      <section id="identity" className="px-6 max-w-7xl mx-auto w-full flex flex-col gap-32 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-12 gap-16 items-start"
        >
          <motion.div
            variants={itemVariants}
            className="md:col-span-5 relative aspect-[4/5] rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl"
          >
            <img
              src="https://picsum.photos/seed/profile/800/1000"
              alt="Profile"
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-3xl font-bold tracking-tighter mb-1">{config.name}</h3>
              <p className="text-sm font-medium tracking-widest uppercase opacity-50">Senior HR Strategist</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-7 flex flex-col gap-16 py-10"
          >
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-10">
                <h2 
                  className="font-bold tracking-[-0.05em] leading-none md:text-[64px] text-[20px] uppercase text-main"
                  style={{ 
                    fontSize: config.fontSizes?.heading ? `${config.fontSizes.heading}px` : undefined
                  }}
                >
                  About Me
                </h2>
                <div className="flex flex-col gap-8">
                  <p className="text-white/40 text-lg leading-[1.8] pre-wrap">{config.sectionDescriptions?.about}</p>
                  <p 
                    className="text-white/80 leading-[1.8] font-light max-w-[720px] pre-wrap"
                    style={{ fontSize: config.fontSizes?.body ? `${config.fontSizes.body}px` : undefined }}
                  >
                    {config.about}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-white/30">
                    <Briefcase size={14} />
                    <span>Experience</span>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {(config.experience || []).map((exp, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-center gap-3">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-white/30">
                    <History size={14} />
                    <span>Education</span>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {(config.education || []).map((edu, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-center gap-3">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-white/30">
                  <Code size={14} />
                  <span>Skills</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(config.skills || []).map((skill, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <div className="section-divider" />
      <section id="projects" className="max-w-7xl mx-auto px-6 py-24 flex flex-col gap-24 w-full relative z-10">
        <motion.header 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col gap-6 items-center text-center"
        >
          <div className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sub animate-pulse" />
            Selected Works
          </div>
          <h2 
            className="font-bold tracking-[-0.03em] leading-tight md:text-[56px] text-[32px] max-w-3xl"
          >
            {config.sectionDescriptions?.projects || 'Check out some of our awesome projects with creative ideas.'}
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {(projects || []).map((project) => (
            <motion.article
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="group flex flex-col gap-8"
            >
              <Link 
                to={`/project/${project.id}`}
                className="relative aspect-[16/10] rounded-[32px] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                    project.imageFilter === 'grayscale' ? 'grayscale' : 
                    project.imageFilter === 'dark' ? 'brightness-50' : ''
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </Link>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-sub transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-white/40 leading-[1.8] line-clamp-2 pre-wrap" style={{ fontSize: config.fontSizes?.body ? `${config.fontSizes.body}px` : undefined }}>
                    {project.problemStatement}
                  </p>
                </div>

                <Link
                  to={`/project/${project.id}`}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group/btn w-fit"
                >
                  <span className="border-b border-white/20 group-hover/btn:border-white transition-all">VIEW MORE</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Archive Section */}
      <div className="section-divider" />
      <section id="archive" className="max-w-5xl mx-auto px-6 py-24 flex flex-col gap-32 w-full relative z-10">
        <motion.header 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col gap-10"
        >
          <h2 
            className="font-bold tracking-[-0.05em] leading-none md:text-[64px] text-[20px] uppercase text-main"
            style={{ 
              fontSize: config.fontSizes?.heading ? `${config.fontSizes.heading}px` : undefined
            }}
          >
            Career Archive
          </h2>
          <p className="text-white/40 text-lg leading-[1.8] pre-wrap max-w-3xl">{config.sectionDescriptions?.archive}</p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archiveCategories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              transition={{ delay: catIndex * 0.1 }}
              className="group relative bg-zinc-900/40 border border-white/5 rounded-[32px] p-8 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden"
            >
              {/* Hover background effect: Pixel-like gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-main/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-main/10 flex items-center justify-center text-main border border-main/20">
                    <Database size={24} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight uppercase text-main">{category}</h3>
                </div>

                <div className="flex flex-col divide-y divide-white/10">
                  {groupedArchive[category].map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 group/item">
                      <div className="flex flex-col gap-4 mb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-lg font-bold group-hover/item:text-white transition-colors leading-tight">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-sub/40 text-sub/80 shrink-0">
                              {item.category || category}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-white/20 uppercase tracking-widest shrink-0 mt-1">
                            {item.year}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {(item.details || []).map((detail, i) => (
                          <li key={i} className="text-sm text-white/40 leading-relaxed whitespace-pre-wrap font-light">
                            {detail.trim().startsWith('*') 
                              ? `• ${detail.trim().substring(1).trim()}` 
                              : detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Project Detail Modal removed */}
    </div>
  );
};

export default Home;
