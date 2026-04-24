import { translations, Lang, TranslationKey } from '../i18n';
import db from '../db/metadata';

export function i18nMiddleware(req: any, res: any, next: any) {
  // 1. Detect language
  // Order: User preference in DB > Accept-Language Header > Default (es)
  let lang: Lang = 'es';

  if (req.artistId) {
    const artist = db.prepare('SELECT preferred_lang FROM artists WHERE id = ?').get(req.artistId) as any;
    if (artist && artist.preferred_lang) {
      lang = artist.preferred_lang as Lang;
    }
  } else {
    const acceptLang = req.headers['accept-language'];
    if (acceptLang && acceptLang.startsWith('en')) {
      lang = 'en';
    }
  }

  // 2. Attach translation function
  res.t = (key: TranslationKey) => {
    return translations[lang][key] || key;
  };

  next();
}
