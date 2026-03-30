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
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const serverData = await response.json();
          // Merge with initialData to ensure new fields are present
          setData({
            ...initialData,
            ...serverData,
            config: {
              ...initialData.config,
              ...serverData.config,
              fontSizes: {
                ...initialData.config.fontSizes,
                ...(serverData.config?.fontSizes || {})
              },
              projectLabels: {
                ...initialData.config.projectLabels,
                ...(serverData.config?.projectLabels || {})
              },
              sectionDescriptions: {
                ...initialData.config.sectionDescriptions,
                ...(serverData.config?.sectionDescriptions || {})
              }
            }
          });
        } else if (response.status === 404) {
          // If data.json doesn't exist yet, save initialData to create it
          await fetch('/api/portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialData)
          });
        }
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Save data to server whenever it changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      try {
        await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error('Failed to save portfolio data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000); // Debounce save
    return () => clearTimeout(timeoutId);
  }, [data, isLoaded]);

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
