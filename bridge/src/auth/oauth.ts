import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly', 'openid', 'email', 'profile'],
    prompt: 'consent'
  });
}

export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function getDriveClient(tokens: any) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials(tokens);
  return google.drive({ version: 'v3', auth: client });
}
