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
      
      // Merge with initialData to ensure new fields are present
      return {
        ...initialData,
        ...parsed,
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
