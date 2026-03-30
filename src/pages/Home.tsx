import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Calendar, ChevronRight, History, Code, Target, Wrench, X, ArrowDown } from 'lucide-react';
import { Project } from '../types';

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
  const [currentAboutImage, setCurrentAboutImage] = useState(0);

  // Rolling images for About Me section
  const aboutImages = config.aboutImages && config.aboutImages.length > 0 
    ? config.aboutImages 
    : [
        "https://picsum.photos/seed/about1/800/1000",
        "https://picsum.photos/seed/about2/800/1000",
        "https://picsum.photos/seed/about3/800/1000",
        "https://picsum.photos/seed/about4/800/1000"
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAboutImage((prev) => (prev + 1) % aboutImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [aboutImages.length]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { scrollY } = useScroll();
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest > 50) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }
    });
  }, [scrollY]);

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
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">Portfolio</span>
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

          {/* Scroll To Dig Button */}
          <AnimatePresence>
            {showScrollHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
              >
                <motion.button
                  onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="relative flex flex-col items-center">
                    {/* Vertical Line Decoration */}
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-main to-main/20 mb-4 shadow-[0_0_15px_var(--main-color)]" />
                    
                    <span className="text-[12px] font-black uppercase tracking-[0.5em] text-main group-hover:text-white group-hover:drop-shadow-[0_0_15px_var(--main-color)] transition-all duration-300">
                      More Information
                    </span>
                    
                    <motion.div 
                      className="mt-3 text-main group-hover:text-white group-hover:translate-y-2 transition-all duration-300 drop-shadow-[0_0_8px_var(--main-color)]"
                    >
                      <ArrowDown size={20} strokeWidth={2} />
                    </motion.div>

                    {/* Subtle Circular Border */}
                    <div className="absolute -inset-8 border border-main/20 rounded-full scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 shadow-[inset_0_0_20px_rgba(0,200,255,0.1)]" />
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Identity Section (Expanded) */}
      <div className="section-divider" />
      <section id="identity" className="px-6 max-w-[1200px] mx-auto w-full relative z-10 flex flex-col gap-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col md:flex-row gap-10 lg:gap-12 items-start"
        >
          <motion.div
            variants={itemVariants}
            className="relative shrink-0 overflow-hidden mx-auto md:mx-0 md:-mt-12 -mt-6"
            style={{
              width: 'var(--about-img-w)',
              height: 'var(--about-img-h)',
              '--about-img-w': '300px',
              '--about-img-h': '180px',
            } as any}
          >
            <style dangerouslySetInnerHTML={{ __html: `
              @media (min-width: 768px) {
                #identity .shrink-0 {
                  width: 500px !important;
                  height: 300px !important;
                }
              }
            `}} />
            <AnimatePresence mode="wait">
              <motion.img
                key={currentAboutImage}
                src={aboutImages[currentAboutImage]}
                alt="Profile"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="object-contain w-full h-full"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            {/* Overlays removed for pure transparency */}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex-1 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <h2 
                  className="font-black tracking-[-0.05em] leading-none uppercase text-main"
                  style={{ 
                    fontSize: config.fontSizes?.heading ? `${config.fontSizes.heading - 4}px` : '44px'
                  }}
                >
                  About Me
                </h2>
                <div className="flex flex-col gap-4">
                  <p className="text-white/40 text-lg leading-[1.8] pre-wrap">{config.sectionDescriptions?.about}</p>
                  <p 
                    className="text-[#DEDEDE] leading-[1.8] font-normal pre-wrap"
                    style={{ fontSize: config.fontSizes?.body ? `${config.fontSizes.body + 2}px` : '18px' }}
                  >
                    {config.about}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          className="flex flex-col gap-0 rounded-[32px] bg-white/[0.1] border border-white/10 overflow-hidden backdrop-blur-sm shadow-2xl w-full"
        >
          <div className="grid md:grid-cols-3 gap-0">
            <div className="flex flex-col gap-4 p-8 border-b md:border-b-0 md:border-r border-white/10">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                <Briefcase size={14} />
                <span className="font-black">Experience</span>
              </div>
              <ul className="flex flex-col gap-3">
                {(config.experience || []).map((exp, i) => (
                  <li key={i} className="text-[17px] leading-[1.8] text-[#DEDEDE] flex items-center gap-3 font-medium">
                    <span className="w-1 h-1 rounded-full bg-sub/40" />
                    {exp}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 p-8 border-b md:border-b-0 md:border-r border-white/10">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                <History size={14} />
                <span className="font-black">Education</span>
              </div>
              <ul className="flex flex-col gap-3">
                {(config.education || []).map((edu, i) => (
                  <li key={i} className="text-[17px] leading-[1.8] text-[#DEDEDE] flex items-center gap-3 font-medium">
                    <span className="w-1 h-1 rounded-full bg-sub/40" />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 p-8">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                <Code size={14} />
                <span className="font-black">Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(config.skills || []).map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[13px] font-bold text-[#DEDEDE]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
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
            <Link key={project.id} to={`/project/${project.id}`} className="h-full">
              <motion.article
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="group flex flex-col gap-8 cursor-pointer p-6 md:p-8 rounded-[40px] bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all h-full"
              >
                <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] shrink-0">
                  <img
                    src={project.mainImage || project.images[0]}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                      project.imageFilter === 'grayscale' ? 'grayscale' : 
                      project.imageFilter === 'dark' ? 'brightness-50' : ''
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                <div className="flex flex-col gap-6 flex-1 justify-between">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-sub transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="text-white/40 leading-[1.8] line-clamp-3 pre-wrap" style={{ fontSize: config.fontSizes?.body ? `${config.fontSizes.body}px` : undefined, wordBreak: 'keep-all' }}>
                      {(project.subtitle || project.about || '').split('\n').map((line, i) => {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith('*')) {
                          return (
                            <div key={i} className="flex gap-2 items-start mb-1">
                              <span className="mt-2 w-1 h-1 bg-sub shrink-0" />
                              <span>{trimmedLine.substring(1).trim()}</span>
                            </div>
                          );
                        }
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group/btn w-fit">
                    <span className="border-b border-white/20 group-hover/btn:border-white transition-all">VIEW MORE</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </section>

      {/* Archive Section */}
      <div className="section-divider" />
      <section id="archive" className="max-w-5xl mx-auto px-6 py-24 flex flex-col gap-16 w-full relative z-10">
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

        <div className="flex flex-col gap-16 relative">
          {(archive || []).map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
              className="group grid md:grid-cols-12 gap-8 py-12 border-b border-white/5 hover:bg-white/[0.02] transition-all px-8 -mx-8 rounded-[32px]"
            >
              {/* Year Column */}
              <div className="md:col-span-2">
                <span className="text-4xl font-bold tracking-tighter text-white/10 group-hover:text-main transition-colors duration-500">
                  {item.year}
                </span>
              </div>

              {/* Title & Category Column */}
              <div className="md:col-span-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-white/50 transition-colors">
                  {item.category}
                </span>
                <h3 className="text-2xl font-bold tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Details Column */}
              <div className="md:col-span-6">
                <ul className="flex flex-col gap-4">
                  {(item.details || []).map((detail, i) => (
                    <li key={i} className="flex items-start gap-4 text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-main transition-colors shrink-0" />
                      <span className="text-lg font-light">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Project Detail Modal Removed */}
    </div>
  );
};

export default Home;
