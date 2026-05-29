import { spawn } from 'node:child_process';

const command = process.argv[2] === 'build' ? 'build' : 'dev';
const args = process.argv.slice(3);
const bin = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(bin, ['astro', command, ...args], {
  stdio: 'inherit',
  env: { ...process.env, DEMO_MODE: '1' },
});

child.on('exit', code => process.exit(code ?? 0));
