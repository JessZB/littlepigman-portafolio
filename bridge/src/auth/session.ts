import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
const EXPIRES_IN = '8h';

export function createSessionToken(artistId: string) {
  return jwt.sign({ artistId }, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifySessionToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { artistId: string };
    req.artistId = decoded.artistId;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
