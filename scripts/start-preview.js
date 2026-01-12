import { spawn } from 'child_process';

const port = process.env.PORT || 4173;

const preview = spawn(
  'npm',
  ['run', 'preview', '--', '--host', '0.0.0.0', '--port', String(port)],
  {
    stdio: 'inherit',
    env: process.env,
  },
);

preview.on('close', (code) => {
  process.exit(code ?? 0);
});

preview.on('error', (error) => {
  console.error('Failed to start preview server:', error);
  process.exit(1);
});
