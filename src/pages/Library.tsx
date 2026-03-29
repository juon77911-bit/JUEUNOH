import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Target, Wrench, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Library() {
  const { data } = usePortfolio();
  const { projects, archive, config } = data;
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-64">
      {/* Background Grid & Pixels */}
      <div className="bg-grid" />
      <div className="bg-pixels" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors mb-16 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Projects List */}
        <section className="flex flex-col gap-24 mb-48">
          <motion.header 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-6"
          >
            <h1 
              className="font-bold tracking-[-0.05em] leading-none md:text-[80px] text-[40px] uppercase"
              style={{ color: 'var(--sub-color)' }}
            >
              Project Library
            </h1>
            <p className="text-xl text-white/40 max-w-2xl leading-relaxed">
              A comprehensive collection of data-driven HR initiatives, organizational design projects, and strategic architectural works.
            </p>
          </motion.header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:border-[var(--main-color)]/30 transition-all duration-500 cursor-pointer flex flex-col justify-between aspect-square"
              >
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{project.date}</span>
                  <h3 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-[var(--main-color)] transition-colors">{project.title}</h3>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-white/40 line-clamp-3 leading-relaxed">{project.problemStatement}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--main-color)' }}>
                    View Details
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--main-color)' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Professional Archive (Timeline) */}
        <section className="flex flex-col gap-24">
          <motion.header 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col gap-6"
          >
            <h2 
              className="font-bold tracking-[-0.05em] leading-none md:text-[64px] text-[32px] uppercase"
              style={{ color: 'var(--sub-color)' }}
            >
              Professional Archive
            </h2>
            <p className="text-lg text-white/40 max-w-2xl leading-relaxed">
              A chronological record of professional milestones and career evolution.
            </p>
          </motion.header>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />
            
            <div className="flex flex-col gap-16">
              {archive.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={itemVariants}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 rounded-full bg-black border-2 -translate-x-1/2 z-10 hidden md:block" style={{ borderColor: 'var(--main-color)' }} />
                  
                  <div className="md:w-1/2 flex flex-col gap-4 px-0 md:px-12">
                    <span className="text-4xl font-bold tracking-tighter" style={{ color: 'var(--main-color)' }}>{item.year}</span>
                    <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                    <p className="text-white/40 leading-relaxed pre-wrap">{item.description}</p>
                  </div>
                  <div className="md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Project Detail Modal (Same as Home) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 z-20 bg-zinc-900/80 backdrop-blur-md border-b border-white/5 p-6 md:p-8 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{selectedProject.date}</span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{selectedProject.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                <div className="flex flex-col gap-24 items-center">
                  <div className="grid md:grid-cols-2 gap-12 w-full max-w-[720px]">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sub-color)' }}>
                        <div className="pixel-grid">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="pixel-dot" />
                          ))}
                        </div>
                        <span>{config.projectLabels?.problem || 'Problem Statement'}</span>
                      </div>
                      <p className="text-lg text-white/80 leading-[1.8] pre-wrap">{selectedProject.problemStatement}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sub-color)' }}>
                        <div className="pixel-grid">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="pixel-dot" />
                          ))}
                        </div>
                        <span>{config.projectLabels?.insights || 'Key Insight'}</span>
                      </div>
                      <p className="text-lg text-white/80 leading-[1.8] italic pre-wrap">"{selectedProject.keyInsights}"</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12 w-full max-w-[720px]">
                    {selectedProject.metrics && (
                      <div className="flex flex-col gap-4 p-8 rounded-3xl border" style={{ backgroundColor: 'rgba(var(--main-color-rgb), 0.05)', borderColor: 'rgba(var(--main-color-rgb), 0.2)' }}>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sub-color)' }}>
                          <Target size={14} style={{ color: 'var(--sub-color)' }} />
                          <span>Performance Metric</span>
                        </div>
                        <div className="text-4xl font-bold tracking-tighter text-white">
                          {selectedProject.metrics}
                        </div>
                      </div>
                    )}
                    {selectedProject.tools && selectedProject.tools.length > 0 && (
                      <div className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sub-color)' }}>
                          <Wrench size={14} style={{ color: 'var(--sub-color)' }} />
                          <span>Tools Used</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tools.map((tool: string) => (
                            <span key={tool} className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-medium border border-white/5">{tool}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-6 w-full max-w-[720px]">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sub-color)' }}>
                      <div className="pixel-grid">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="pixel-dot" />
                        ))}
                      </div>
                      <span>{config.projectLabels?.approach || 'Strategic Approach'}</span>
                    </div>
                    <p className="text-xl text-white/80 leading-[1.8] font-light pre-wrap">{selectedProject.approach}</p>
                  </div>

                  <div className="flex flex-col gap-6 w-full max-w-[720px]">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sub-color)' }}>
                      <div className="pixel-grid">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="pixel-dot" />
                        ))}
                      </div>
                      <span>{config.projectLabels?.impact || 'Actions & Impact'}</span>
                    </div>
                    <p className="text-xl text-white/80 leading-[1.8] font-light pre-wrap">{selectedProject.actionsImpact}</p>
                  </div>

                  <div className="w-full max-w-[720px] p-10 rounded-[32px] bg-white/5 border border-white/10 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sub-color)' }}>
                      <div className="pixel-grid">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="pixel-dot" />
                        ))}
                      </div>
                      <span>{config.projectLabels?.contribution || 'My Contribution'}</span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight pre-wrap" style={{ color: 'var(--main-color)' }}>{selectedProject.contribution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
