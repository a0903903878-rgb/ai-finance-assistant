#!/usr/bin/env node
import { existsSync, chmodSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

if (!existsSync('.git') || !existsSync('.githooks/pre-commit')) {
  process.exit(0);
}

try {
  chmodSync('.githooks/pre-commit', 0o755);
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'ignore' });
} catch {
}
