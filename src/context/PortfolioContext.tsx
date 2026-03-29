import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Project, ArchiveItem, SiteConfig } from '../types';
import { initialData } from '../constants';

interface PortfolioContextType {
  data: PortfolioData;
  updateConfig: (config: SiteConfig) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  addArchiveItem: (item: ArchiveItem) => void;
  updateArchiveItem: (item: ArchiveItem) => void;
  deleteArchiveItem: (id: string) => void;
  reorderArchiveItems: (startIndex: number, endIndex: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Migrate projects if needed
      const migratedProjects = (parsed.projects || []).map((p: any) => {
        if (!p.contentBlocks) {
          const blocks: any[] = [];
          if (p.problemStatement) blocks.push({ id: 'prob', type: 'text', title: 'Problem Statement', content: p.problemStatement, sectionId: 'problem' });
          if (p.approach) blocks.push({ id: 'appr', type: 'text', title: 'Approach', content: p.approach, sectionId: 'approach' });
          if (p.keyInsights) blocks.push({ id: 'ins', type: 'text', title: 'Key Insights', content: p.keyInsights, sectionId: 'insights' });
          if (p.actionsImpact) blocks.push({ id: 'act', type: 'text', title: 'Actions & Impact', content: p.actionsImpact, sectionId: 'actions' });
          if (p.contribution) blocks.push({ id: 'cont', type: 'text', title: 'Contribution', content: p.contribution, sectionId: 'contribution' });
          if (p.thingsIDid) blocks.push({ id: 'things', type: 'text', title: 'Things I Did', content: p.thingsIDid, sectionId: 'things' });
          
          (p.images || []).forEach((img: string, idx: number) => {
            blocks.push({ id: `img-${idx}`, type: 'image', title: `Project Image ${idx + 1}`, content: img, sectionId: `image-${idx}` });
          });

          return {
            ...p,
            contentBlocks: blocks,
            visibleSections: blocks.reduce((acc, b) => ({ ...acc, [b.id]: true }), {}),
            subtitle: p.subtitle || '',
            client: p.client || '',
            services: p.services || '',
            liveUrl: p.liveUrl || '',
            metrics: p.metrics || '',
            imageFilter: p.imageFilter || 'none',
            tools: p.tools || []
          };
        }
        return p;
      });

      // Migrate archive if needed
      const migratedArchive = (parsed.archive || []).map((a: any) => {
        if (!a.details) {
          return {
            ...a,
            category: a.category || 'Experience',
            details: a.description ? a.description.split('\n').filter((s: string) => s.trim()) : []
          };
        }
        return a;
      });

      // Merge with initialData to ensure new fields are present
      return {
        ...initialData,
        ...parsed,
        projects: migratedProjects,
        archive: migratedArchive,
        config: {
          ...initialData.config,
          ...parsed.config,
          fontSizes: {
            ...initialData.config.fontSizes,
            ...(parsed.config?.fontSizes || {})
          },
          projectLabels: {
            ...initialData.config.projectLabels,
            ...(parsed.config?.projectLabels || {})
          },
          sectionDescriptions: {
            ...initialData.config.sectionDescriptions,
            ...(parsed.config?.sectionDescriptions || {})
          }
        }
      };
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', data.config.accentColor);
    document.documentElement.style.setProperty('--sub-color', data.config.secondaryColor || '#00E5FF');
  }, [data.config.accentColor, data.config.secondaryColor]);

  const updateConfig = (config: SiteConfig) => {
    setData(prev => ({ ...prev, config }));
  };

  const addProject = (project: Project) => {
    setData(prev => ({ ...prev, projects: [...prev.projects, project] }));
  };

  const updateProject = (project: Project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === project.id ? project : p)
    }));
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const reorderProjects = (startIndex: number, endIndex: number) => {
    setData(prev => {
      const result = Array.from(prev.projects);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, projects: result };
    });
  };

  const addArchiveItem = (item: ArchiveItem) => {
    setData(prev => ({ ...prev, archive: [...prev.archive, item] }));
  };

  const updateArchiveItem = (item: ArchiveItem) => {
    setData(prev => ({
      ...prev,
      archive: prev.archive.map(a => a.id === item.id ? item : a)
    }));
  };

  const deleteArchiveItem = (id: string) => {
    setData(prev => ({
      ...prev,
      archive: prev.archive.filter(a => a.id !== id)
    }));
  };

  const reorderArchiveItems = (startIndex: number, endIndex: number) => {
    setData(prev => {
      const result = Array.from(prev.archive);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, archive: result };
    });
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      updateConfig,
      addProject,
      updateProject,
      deleteProject,
      reorderProjects,
      addArchiveItem,
      updateArchiveItem,
      deleteArchiveItem,
      reorderArchiveItems
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};
