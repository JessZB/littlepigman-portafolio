import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * setup-agents.js
 * Universal linker for Antigravity Agents.
 * Supports Windows (Junctions) and Unix (Symlinks).
 */

const PROJECT_NAME = 'littlepigman-portafolio'; 
const TARGET = path.join('_shared_agents', PROJECT_NAME);
const LINK = '.agents';

console.log(`\n🚀 Setting up Antigravity Agents for: ${PROJECT_NAME}`);
console.log('---------------------------------------------------');

// 1. Ensure git submodule is initialized
try {
    console.log('📦 Syncing Git submodules...');
    execSync('git submodule update --init --recursive', { stdio: 'inherit' });
} catch (e) {
    console.warn('⚠️  Could not update submodules. Ensure you have git installed and internet access.');
}

// 2. Clean up existing link or folder
if (fs.existsSync(LINK)) {
    const stats = fs.lstatSync(LINK);
    if (stats.isSymbolicLink() || stats.isDirectory()) {
        console.log(`🧹 Removing existing ${LINK}...`);
        fs.rmSync(LINK, { recursive: true, force: true });
    }
}

// 3. Create the cross-platform link
try {
    // On Windows, 'junction' allows linking directories without Admin privileges.
    // On Unix (Mac/Linux), 'dir' creates a standard symbolic link.
    const type = process.platform === 'win32' ? 'junction' : 'dir';
    
    if (!fs.existsSync(TARGET)) {
        throw new Error(`Target directory not found: ${TARGET}. Did the submodule clone correctly?`);
    }

    fs.symlinkSync(TARGET, LINK, type);
    console.log(`✅ Success! Agents linked as [${type}].`);
    console.log(`📍 Found at: ${path.resolve(LINK)}\n`);
} catch (e) {
    console.error(`❌ Failed to create link: ${e.message}`);
    console.log('\n💡 Tip: Try running this script with Node.js directly.');
    process.exit(1);
}
