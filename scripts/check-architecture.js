#!/usr/bin/env node

/**
 * AttendX AI - Architecture Verification Script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredPaths = [
  'src/types/index.ts',
  'src/lib/constants.ts',
  'src/lib/logger.ts',
  'src/lib/env.ts',
  'src/services/apiClient.ts',
  'src/components/common/ErrorBoundary.tsx',
  'src/components/common/Modal.tsx',
  'src/components/common/DataTable.tsx',
  'src/hooks/useAttendance.ts',
  'database/migrations/001_init_schema.sql',
  'docs/ARCHITECTURE.md',
  'docs/FOLDER_STRUCTURE.md',
  'docs/DEVELOPER_GUIDE.md',
  'docs/GIT_CONVENTIONS.md',
  'README.md',
  '.env.example'
];

console.log('🏗️ Validating AttendX AI Architectural Integrity...');

let missing = 0;
requiredPaths.forEach((relPath) => {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing architectural file: ${relPath}`);
    missing++;
  } else {
    console.log(`✅ ${relPath}`);
  }
});

if (missing > 0) {
  console.error(`\n❌ Architecture check failed: ${missing} missing files.`);
  process.exit(1);
}

console.log('\n🎉 Architecture validation completely successful!');
