import db from './src/db/metadata';
import { decrypt } from './src/auth/encrypt';
import { getDriveClient } from './src/auth/oauth';

async function listFiles() {
  console.log('Fetching artists from DB...');
  const artists = db.prepare('SELECT id, name, google_user_id, refresh_token FROM artists').all() as any[];
  
  if (artists.length === 0) {
    console.log('No artists found in the database. Did you login?');
    return;
  }

  for (const artist of artists) {
    console.log(`\nTesting Artist: ${artist.name} (ID: ${artist.google_user_id})`);
    try {
      const token = decrypt(artist.refresh_token);
      const drive = getDriveClient({ refresh_token: token });
      
      console.log('Checking permissions and fetching files...');
      const response = await drive.files.list({
        pageSize: 5,
        fields: 'files(id, name, mimeType)',
        q: "mimeType != 'application/vnd.google-apps.folder'" // No folders
      });
      
      const files = response.data.files;
      if(files === undefined){
        console.log('  -> No files found. The account is completely empty or the app lacks permissions to see them.');
      }
      if (!files || files.length === 0) {
        console.log('  -> No files found. The account is completely empty or the app lacks permissions to see them.');
      } else {
        console.log('  -> File found! 🟢');
        console.log(`  -> URL to test: http://localhost:3001/api/file/${files[0]?.id || 'unknown'}?artistId=${artist.google_user_id}`);
        console.log(`  -> File Name: ${files[0]?.name || 'unknown'} (Type: ${files[0]?.mimeType || 'unknown'})`);
      }
    } catch (e: any) {
      console.error('  -> Failed! Error:', e.message);
    }
  }
}

listFiles();
