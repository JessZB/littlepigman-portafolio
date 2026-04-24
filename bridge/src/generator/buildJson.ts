import db from '../db/metadata';
import fs from 'fs';
import path from 'path';
import { translations, TranslationKey } from '../i18n/index';

// Schema mimicking works.[lang].json from Portfolio
export interface WorksData {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  role: string;
  description: string;
  workDone: any[];
}

function translateCategory(cat: string, lang: 'es' | 'en'): string {
  const key = `cat.${cat}` as TranslationKey;
  const bundle = translations[lang] as any;
  return bundle[key] || cat;
}

export function generateWorksJson(artistId: string, lang: 'es' | 'en'): WorksData[] {
  const bridgeUrl = 'http://localhost:3001';
  const projects = db.prepare('SELECT * FROM projects WHERE artist_id = ? ORDER BY sort_order ASC').all(artistId) as any[];

  return projects.map(proj => {
    const sections = db.prepare('SELECT * FROM work_sections WHERE project_id = ? ORDER BY sort_order ASC').all(proj.id) as any[];
    
    const workDone = sections.map(sec => {
      const items = db.prepare('SELECT * FROM work_items WHERE section_id = ? ORDER BY sort_order ASC').all(sec.id) as any[];
      
      const mappedItems = items.map(item => ({
        title: lang === 'es' ? item.title_es : item.title_en,
        img: `${bridgeUrl}/api/file/${item.drive_file_id}?artistId=${artistId}`,
        desc: lang === 'es' ? item.description_es : item.description_en
      }));
      
      if (sec.type === 'asset-group') {
        return {
          type: 'asset-group',
          groupTitle: lang === 'es' ? sec.title_es : sec.title_en,
          description: lang === 'es' ? sec.description_es : sec.description_en,
          items: mappedItems
        };
      } else if (sec.type === 'gltf-model') {
        return {
          type: 'gltf-model',
          title: lang === 'es' ? sec.title_es : sec.title_en,
          description: lang === 'es' ? sec.description_es : sec.description_en,
          modelUrl: `${bridgeUrl}/api/file/${sec.model_drive_id}?artistId=${artistId}`
        };
      } else { 
        return {
          type: '3d-model',
          title: lang === 'es' ? sec.title_es : sec.title_en,
          description: lang === 'es' ? sec.description_es : sec.description_en,
          modelPlaceholderColor: 12146341,
          textures: mappedItems.map(i => ({ name: i.title, img: i.img }))
        };
      }
    });

    return {
      id: proj.id,
      title: lang === 'es' ? proj.title_es : proj.title_en,
      category: translateCategory(proj.category, lang),
      thumbnail: `${bridgeUrl}/api/file/${proj.thumbnail_drive_id}?artistId=${artistId}`,
      role: lang === 'es' ? proj.role_es : proj.role_en,
      description: lang === 'es' ? proj.description_es : proj.description_en,
      workDone
    };
  });
}
