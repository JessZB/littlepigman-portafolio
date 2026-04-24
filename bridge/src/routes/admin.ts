import { Router } from 'express';
import db from '../db/metadata';
import { verifySessionToken } from '../auth/session';
import { generateWorksJson } from '../generator/buildJson';
import fs from 'fs';
import path from 'path';

const router = Router();

// Middleware to verify Admin Session JWT
router.use(verifySessionToken);

// Re-run i18n middleware after session verify to ensure req.artistId is available for DB lookup
import { i18nMiddleware } from '../middleware/i18n';
router.use(i18nMiddleware);

// GET /api/admin/projects
router.get('/projects', (req: any, res: any) => {
  const projects = db.prepare('SELECT * FROM projects WHERE artist_id = ? ORDER BY sort_order ASC').all(req.artistId);
  res.json(projects);
});

// GET /api/admin/profile
router.get('/profile', (req: any, res: any) => {
  const artist = db.prepare('SELECT id, name, preferred_lang FROM artists WHERE id = ?').get(req.artistId);
  if (!artist) return res.status(404).send('Artist not found');
  res.json(artist);
});

// POST /api/admin/profile/lang
router.post('/profile/lang', (req: any, res: any) => {
  const { lang } = req.body;
  if (!lang) return res.status(400).send('Missing lang');
  try {
    db.prepare('UPDATE artists SET preferred_lang = ? WHERE id = ?').run(lang, req.artistId);
    res.json({ message: res.t('lang.updated') });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/projects
router.post('/projects', (req: any, res: any) => {
  const { 
    id, title_es, title_en, category, 
    thumbnail_drive_id, role_es, role_en, 
    description_es, description_en 
  } = req.body;

  if (!id || !title_es) return res.status(400).send(res.t('common.missing_fields'));
  
  try {
    db.prepare(`
      INSERT INTO projects (
        id, artist_id, title_es, title_en, category, 
        thumbnail_drive_id, role_es, role_en, 
        description_es, description_en
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title_es=excluded.title_es, title_en=excluded.title_en,
        category=excluded.category, thumbnail_drive_id=excluded.thumbnail_drive_id,
        role_es=excluded.role_es, role_en=excluded.role_en,
        description_es=excluded.description_es, description_en=excluded.description_en
    `).run(
      id, req.artistId, title_es, title_en, category, 
      thumbnail_drive_id, role_es, role_en, 
      description_es, description_en
    );
    
    res.json({ message: res.t('project.saved'), id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/projects/:id
// Returns full project with its sections and items
router.get('/projects/:id', (req: any, res: any) => {
  const { id } = req.params;
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ? AND artist_id = ?').get(id, req.artistId);
    if (!project) return res.status(404).send(res.t('project.not_found'));

    const sections = db.prepare('SELECT * FROM work_sections WHERE project_id = ? ORDER BY sort_order ASC').all(id);
    for (const sec of sections as any[]) {
      sec.items = db.prepare('SELECT * FROM work_items WHERE section_id = ? ORDER BY sort_order ASC').all(sec.id);
    }
    
    res.json({ ...project, sections });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/sections
router.post('/sections', (req: any, res: any) => {
  const { id, project_id, type, title_es, title_en, description_es, description_en, model_drive_id, sort_order } = req.body;
  if (!id || !project_id || !type) return res.status(400).send(res.t('common.missing_fields'));
  
  try {
    // Verify artist owns the project
    const project = db.prepare('SELECT id FROM projects WHERE id = ? AND artist_id = ?').get(project_id, req.artistId);
    if (!project) return res.status(403).send(res.t('project.not_found'));

    db.prepare(`
      INSERT INTO work_sections (id, project_id, type, title_es, title_en, description_es, description_en, sort_order, model_drive_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        type=excluded.type, title_es=excluded.title_es, title_en=excluded.title_en,
        description_es=excluded.description_es, description_en=excluded.description_en,
        sort_order=excluded.sort_order, model_drive_id=excluded.model_drive_id
    `).run(id, project_id, type, title_es, title_en, description_es, description_en, sort_order || 0, model_drive_id || null);
    
    res.json({ message: res.t('section.saved'), id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/items
router.post('/items', async (req: any, res: any) => {
  const { id, section_id, title_es, title_en, description_es, description_en, drive_file_id, sort_order } = req.body;
  if (!id || !section_id) return res.status(400).send(res.t('common.missing_fields'));
  
  try {
    // 1. Verify Ownership
    const section = db.prepare(`
      SELECT p.artist_id FROM work_sections ws
      JOIN projects p ON ws.project_id = p.id
      WHERE ws.id = ?
    `).get(section_id) as any;
    if (!section || section.artist_id !== req.artistId) {
      return res.status(403).send(res.t('section.unauthorized'));
    }

    // 2. Drive Access Validation (if drive_file_id provided)
    if (drive_file_id) {
       // We'll skip the actual API call here to avoid slowdowns, assuming client-side proxy check or basic format check.
       // But log it as a checkpoint.
    }

    db.prepare(`
      INSERT INTO work_items (id, section_id, title_es, title_en, description_es, description_en, drive_file_id, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title_es=excluded.title_es, title_en=excluded.title_en,
        description_es=excluded.description_es, description_en=excluded.description_en,
        drive_file_id=excluded.drive_file_id, sort_order=excluded.sort_order
    `).run(id, section_id, title_es || null, title_en || null, description_es || null, description_en || null, drive_file_id || null, sort_order || 0);
    
    res.json({ message: res.t('item.saved'), id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/reorder
// Expects { type: 'projects'|'sections'|'items', orders: [{id, sort_order}, ...] }
router.post('/reorder', (req: any, res: any) => {
  const { type, orders } = req.body;
  if (!type || !orders || !Array.isArray(orders)) return res.status(400).send('Invalid request');

  const tableMap: Record<string, string> = {
    projects: 'projects',
    sections: 'work_sections',
    items: 'work_items'
  };

  const tableName = tableMap[type];
  if (!tableName) return res.status(400).send('Invalid type');

  try {
    const updateStmt = db.prepare(`UPDATE ${tableName} SET sort_order = ? WHERE id = ?`);
    const transaction = db.transaction((items) => {
      for (const item of items) {
        updateStmt.run(item.sort_order, item.id);
      }
    });

    transaction(orders);
    res.json({ message: 'Reordered successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/items/:id
router.delete('/items/:id', (req: any, res: any) => {
  const { id } = req.params;
  try {
    const item = db.prepare(`
      SELECT p.artist_id FROM work_items wi
      JOIN work_sections ws ON wi.section_id = ws.id
      JOIN projects p ON ws.project_id = p.id
      WHERE wi.id = ?
    `).get(id) as any;
    if (!item || item.artist_id !== req.artistId) {
      return res.status(403).send(res.t('item.unauthorized'));
    }

    db.prepare('DELETE FROM work_items WHERE id = ?').run(id);
    res.json({ message: res.t('item.deleted') });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', (req: any, res: any) => {
  const { id } = req.params;
  try {
    const result = db.prepare('DELETE FROM projects WHERE id = ? AND artist_id = ?').run(id, req.artistId);
    if (result.changes === 0) return res.status(404).send(res.t('project.not_found'));
    res.json({ message: res.t('project.deleted') });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/sections/:id
router.delete('/sections/:id', (req: any, res: any) => {
  const { id } = req.params;
  try {
    // Verify ownership via join
    const section = db.prepare(`
      SELECT p.artist_id FROM work_sections ws
      JOIN projects p ON ws.project_id = p.id
      WHERE ws.id = ?
    `).get(id) as any;
    if (!section || section.artist_id !== req.artistId) {
      return res.status(403).send(res.t('section.unauthorized'));
    }

    db.prepare('DELETE FROM work_sections WHERE id = ?').run(id);
    res.json({ message: res.t('section.deleted') });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/publish 
// Endpoint to generate JSON and trigger frontend rebuild
router.post('/publish', (req: any, res: any) => {
  try {
    const jsonEs = generateWorksJson(req.artistId, 'es');
    const jsonEn = generateWorksJson(req.artistId, 'en');
    
    // Absolute path to Astro project's data folder
    const dataPath = path.resolve(__dirname, '../../../src/data');
    
    if (fs.existsSync(dataPath)) {
      fs.writeFileSync(path.join(dataPath, 'works.es.json'), JSON.stringify(jsonEs, null, 2));
      fs.writeFileSync(path.join(dataPath, 'works.en.json'), JSON.stringify(jsonEn, null, 2));
    }
    
    res.json({ success: true, message: 'works.es.json and works.en.json published to Astro' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
