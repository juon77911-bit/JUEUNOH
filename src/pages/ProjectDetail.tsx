import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';
import { ArrowLeft, Quote, ExternalLink } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = usePortfolio();
  const { projects } = data;
  const navigate = useNavigate();

  const projectIndex = projects.findIndex(p => p.id === id);
  const project = projects[projectIndex];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link to="/" className="px-6 py-3 rounded-full bg-white text-black font-bold">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Background elements */}
      <div className="bg-grid fixed inset-0 pointer-events-none opacity-20" />
      <div className="bg-noise fixed inset-0 pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-16"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Back to Projects</span>
        </button>

        {/* Hero Section: Split Layout */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-32 mb-24">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/60 leading-relaxed">
              {project.subtitle || project.description || project.problemStatement.substring(0, 150) + "..."}
            </p>
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-fit px-8 py-4 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all font-bold text-sm uppercase tracking-widest flex items-center gap-3"
              >
                Live Preview
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">About the project</h2>
              <p className="text-lg font-light text-white/50 leading-relaxed">
                {project.about || project.approach || "Detailed information about this project and its objectives."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Date:</span>
                <span className="text-sm font-medium">{project.date}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Client:</span>
                <span className="text-sm font-medium">{project.client || "Confidential"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Services:</span>
                <span className="text-sm font-medium">{project.services || (project.tools ? project.tools.join(', ') : "Strategy & Design")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="mb-32 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
          <img 
            src={project.images[0]} 
            alt={project.title} 
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Project Content Blocks */}
        <div className="max-w-4xl mx-auto mb-32 flex flex-col gap-24">
          {project.contentBlocks?.map((block) => {
            const isVisible = project.visibleSections?.[block.sectionId] ?? true;
            if (!isVisible) return null;

            if (block.type === 'text') {
              return (
                <div key={block.id} className="flex flex-col gap-8">
                  {block.title && <h2 className="text-3xl font-bold">{block.title}</h2>}
                  <div className="text-xl font-light text-white/60 leading-relaxed whitespace-pre-wrap">
                    {block.content}
                  </div>
                </div>
              );
            }

            if (block.type === 'image') {
              return (
                <div key={block.id} className="rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
                  <img 
                    src={block.content} 
                    alt={block.title || project.title} 
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Bottom Navigation */}
        {prevProject && (
          <div className="pt-32 border-t border-white/10">
            <Link 
              to={`/project/${prevProject.id}`}
              className="group flex items-center gap-8 p-8 rounded-[40px] hover:bg-white/5 transition-all w-fit"
            >
              <div className="w-32 h-24 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={prevProject.images[0]} 
                  alt={prevProject.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                  <ArrowLeft size={12} />
                  Previous Post
                </span>
                <h3 className="text-2xl font-bold group-hover:text-main transition-colors">
                  {prevProject.title}
                </h3>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
