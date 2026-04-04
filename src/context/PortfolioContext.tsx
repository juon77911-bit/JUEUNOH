import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Project, ArchiveItem, SiteConfig } from '../types';
import { initialData } from '../constants';
import { db, auth } from '../firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  collection, 
  query, 
  orderBy, 
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { OperationType, handleFirestoreError } from '../firebase';

interface PortfolioContextType {
  data: PortfolioData;
  user: User | null;
  isAuthReady: boolean;
  updateConfig: (config: SiteConfig) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (startIndex: number, endIndex: number) => Promise<void>;
  addArchiveItem: (item: ArchiveItem) => Promise<void>;
  updateArchiveItem: (item: ArchiveItem) => Promise<void>;
  deleteArchiveItem: (id: string) => Promise<void>;
  reorderArchiveItems: (startIndex: number, endIndex: number) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore listeners
  useEffect(() => {
    // Listen to config
    const unsubConfig = onSnapshot(doc(db, 'settings', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setData(prev => ({
          ...prev,
          config: {
            ...initialData.config,
            ...docSnap.data() as SiteConfig,
            fontSizes: {
              ...initialData.config.fontSizes,
              ...(docSnap.data() as SiteConfig).fontSizes || {}
            },
            projectLabels: {
              ...initialData.config.projectLabels,
              ...(docSnap.data() as SiteConfig).projectLabels || {}
            },
            sectionDescriptions: {
              ...initialData.config.sectionDescriptions,
              ...(docSnap.data() as SiteConfig).sectionDescriptions || {}
            }
          }
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/config');
    });

    // Listen to projects
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('order', 'asc')), (querySnap) => {
      const projects: Project[] = [];
      querySnap.forEach((doc) => {
        projects.push(doc.data() as Project);
      });
      if (projects.length > 0) {
        setData(prev => ({ ...prev, projects }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    // Listen to archive
    const unsubArchive = onSnapshot(query(collection(db, 'archive'), orderBy('order', 'asc')), (querySnap) => {
      const archive: ArchiveItem[] = [];
      querySnap.forEach((doc) => {
        archive.push(doc.data() as ArchiveItem);
      });
      if (archive.length > 0) {
        setData(prev => ({ ...prev, archive }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'archive');
    });

    return () => {
      unsubConfig();
      unsubProjects();
      unsubArchive();
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', data.config.accentColor);
    document.documentElement.style.setProperty('--sub-color', data.config.secondaryColor || '#00E5FF');
  }, [data.config.accentColor, data.config.secondaryColor]);

  const updateConfig = async (config: SiteConfig) => {
    const path = 'settings/config';
    try {
      await setDoc(doc(db, 'settings', 'config'), config);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const addProject = async (project: Project) => {
    const path = `projects/${project.id}`;
    try {
      const newProject = { ...project, order: data.projects.length };
      await setDoc(doc(db, 'projects', project.id), newProject);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const updateProject = async (project: Project) => {
    const path = `projects/${project.id}`;
    try {
      await setDoc(doc(db, 'projects', project.id), project);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteProject = async (id: string) => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const reorderProjects = async (startIndex: number, endIndex: number) => {
    const result = Array.from(data.projects);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Update order field for all projects
    const updatedProjects = result.map((p: Project, index) => ({ ...p, order: index }));
    
    try {
      const batch = writeBatch(db);
      updatedProjects.forEach((p: Project) => {
        batch.set(doc(db, 'projects', p.id), p);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects (batch reorder)');
    }
  };

  const addArchiveItem = async (item: ArchiveItem) => {
    const path = `archive/${item.id}`;
    try {
      const newItem = { ...item, order: data.archive.length };
      await setDoc(doc(db, 'archive', item.id), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const updateArchiveItem = async (item: ArchiveItem) => {
    const path = `archive/${item.id}`;
    try {
      await setDoc(doc(db, 'archive', item.id), item);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteArchiveItem = async (id: string) => {
    const path = `archive/${id}`;
    try {
      await deleteDoc(doc(db, 'archive', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const reorderArchiveItems = async (startIndex: number, endIndex: number) => {
    const result = Array.from(data.archive);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Update order field for all items
    const updatedArchive = result.map((item: ArchiveItem, index) => ({ ...item, order: index }));
    
    try {
      const batch = writeBatch(db);
      updatedArchive.forEach((a: ArchiveItem) => {
        batch.set(doc(db, 'archive', a.id), a);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'archive (batch reorder)');
    }
  };

  return (
    <PortfolioContext.Provider value={{
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
