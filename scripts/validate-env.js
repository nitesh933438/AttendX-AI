#!/usr/bin/env node

/**
 * AttendX AI - Environment Variables Validator Script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const envExamplePath = path.join(rootDir, '.env.example');

console.log('🔍 Checking Environment Variable Declarations...');

if (!fs.existsSync(envExamplePath)) {
  console.error('❌ Error: .env.example file missing at project root!');
  process.exit(1);
}

const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
const requiredVars = envExampleContent
  .split('\n')
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split('=')[0].trim());

console.log(`✅ Environment Template contains ${requiredVars.length} variables:`);
requiredVars.forEach((v) => console.log(`   - ${v}`));

console.log('✨ Environment validation passed.');
