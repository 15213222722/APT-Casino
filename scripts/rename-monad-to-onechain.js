#!/usr/bin/env node

/**
 * Rename Monad to One Chain Script
 * Replaces all references of "Monad" with "One Chain" and "MON" with "OCT"
 * across the entire codebase
 */

const fs = require('fs');
const path = require('path');

// Directories to search
const searchDirs = [
  'src',
  'public',
  'scripts',
  'move-contracts',
  'docs',
  'onedocs'
];

// File extensions to process
const fileExtensions = [
  '.js', '.jsx', '.ts', '.tsx',
  '.json', '.md', '.txt',
  '.css', '.scss', '.html',
  '.move', '.toml'
];

// Files to skip
const skipFiles = [
  'node_modules',
  '.next',
  '.git',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env.local',
  'rename-monad-to-onechain.js' // Skip this script itself
];

// Replacement patterns
const replacements = [
  // Monad variations
  { from: /Monad Testnet/g, to: 'One Chain Testnet' },
  { from: /Monad testnet/g, to: 'One Chain testnet' },
  { from: /MONAD_TESTNET/g, to: 'ONECHAIN_TESTNET' },
  { from: /monad-testnet/g, to: 'onechain-testnet' },
  { from: /monad_testnet/g, to: 'onechain_testnet' },
  { from: /MonadTestnet/g, to: 'OneChainTestnet' },
  { from: /monadTestnet/g, to: 'oneChainTestnet' },
  
  // Monad (general)
  { from: /\bMonad\b/g, to: 'One Chain' },
  { from: /\bmonad\b/g, to: 'onechain' },
  { from: /\bMONAD\b/g, to: 'ONECHAIN' },
  
  // MON token
  { from: /\bMON\b/g, to: 'OCT' },
  { from: /\bmon\b/g, to: 'oct' },
  
  // Monad Explorer
  { from: /monadexplorer/g, to: 'onescan' },
  { from: /MonadExplorer/g, to: 'OneScan' },
  { from: /Monad Explorer/g, to: 'One Chain Explorer' },
  
  // Monad RPC
  { from: /testnet-rpc\.monad\.xyz/g, to: 'rpc-testnet.onelabs.cc' },
  
  // Comments and documentation
  { from: /Monad network/g, to: 'One Chain network' },
  { from: /Monad blockchain/g, to: 'One Chain blockchain' },
  { from: /on Monad/g, to: 'on One Chain' },
  { from: /to Monad/g, to: 'to One Chain' },
  { from: /from Monad/g, to: 'from One Chain' },
];

let filesProcessed = 0;
let filesModified = 0;
let totalReplacements = 0;

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  // Check if in skip list
  for (const skip of skipFiles) {
    if (filePath.includes(skip)) {
      return false;
    }
  }
  
  // Check file extension
  const ext = path.extname(filePath);
  return fileExtensions.includes(ext);
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    filesProcessed++;
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileReplacements = 0;
    
    // Apply all replacements
    for (const { from, to } of replacements) {
      const matches = content.match(from);
      if (matches) {
        fileReplacements += matches.length;
        content = content.replace(from, to);
      }
    }
    
    // Write back if modified
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      totalReplacements += fileReplacements;
      console.log(`✓ Modified: ${filePath} (${fileReplacements} replacements)`);
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip certain directories
        if (!skipFiles.includes(entry.name)) {
          processDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        if (shouldProcessFile(fullPath)) {
          processFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`✗ Error reading directory ${dirPath}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('========================================');
  console.log('Rename Monad to One Chain');
  console.log('========================================');
  console.log('');
  console.log('This script will replace:');
  console.log('  • "Monad" → "One Chain"');
  console.log('  • "MON" → "OCT"');
  console.log('  • monad-testnet → onechain-testnet');
  console.log('  • monadexplorer → onescan');
  console.log('');
  console.log('Processing files...');
  console.log('');
  
  const startTime = Date.now();
  
  // Process each search directory
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      console.log(`📁 Processing directory: ${dir}`);
      processDirectory(dir);
    }
  }
  
  // Also process root files
  const rootFiles = ['.env', 'README.md', 'package.json'];
  for (const file of rootFiles) {
    if (fs.existsSync(file) && shouldProcessFile(file)) {
      processFile(file);
    }
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('');
  console.log('========================================');
  console.log('✅ Renaming Complete!');
  console.log('========================================');
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total replacements: ${totalReplacements}`);
  console.log(`Duration: ${duration}s`);
  console.log('');
  console.log('⚠️  Important: Review the changes before committing!');
  console.log('');
}

// Run the script
main();
