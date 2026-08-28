import { useEffect } from 'react';
import { Subject } from '../types';

export function useDocumentMetadata(currentView: string, selectedSubject: Subject | null) {
  useEffect(() => {
    let title = 'Cambridge Compass | Free O-Level & IGCSE Resources';
    let description = 'A precision archive of O Level academic resources and syllabus navigation.';

    if (currentView === 'resources' && selectedSubject) {
      title = `${selectedSubject.name} Notes & Past Papers | Cambridge Compass`;
      description = `Access free ${selectedSubject.name} O-Level & IGCSE revision notes, past papers, books, and syllabus resources on Cambridge Compass.`;
    } else if (currentView === 'resources') {
      title = 'Subject Resource Archives | Cambridge Compass';
      description = 'Browse syllabus-aligned notes, books, practice materials, and resources for Cambridge O-Level subjects.';
    } else if (currentView === 'about') {
      title = 'About | Cambridge Compass';
      description = 'Learn about Cambridge Compass and our mission to provide precision academic resources for students.';
    } else if (currentView === 'whats-new') {
      title = "What's New | Cambridge Compass";
      description = "Check out the latest updates, resource additions, and feature releases on Cambridge Compass.";
    } else if (currentView === 'request') {
      title = 'Request Resources | Cambridge Compass';
      description = 'Request specific O-Level or IGCSE notes, past papers, or syllabus materials from Cambridge Compass.';
    }

    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [currentView, selectedSubject]);
}
