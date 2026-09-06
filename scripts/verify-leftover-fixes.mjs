import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const read = (relativePath) => readFileSync(join(root, relativePath), 'utf8');

test('sets httpOnly session cookies', () => {
  const source = read('src/services/auth/cookieOptions.ts');
  assert.match(source, /httpOnly: true/);
  assert.match(source, /sameSite: 'lax'/);
});

test('refreshes with the current Bearer access token', () => {
  const source = read('src/services/root/handleToken/index.ts');
  assert.match(source, /Authorization: `Bearer \$\{accessToken\}`/);
  assert.match(source, /access_token/);
  assert.doesNotMatch(source, /refreshToken/);
});

test('protects profile, create, and liberation routes', () => {
  const source = read('src/proxy.ts');
  assert.match(source, /pathname\.startsWith\('\/profile'\)/);
  assert.match(source, /pathname\.startsWith\('\/create'\)/);
  assert.match(source, /pathname\.includes\('\/liberation'\)/);
});

test('does not allow arbitrary remote image hosts', () => {
  const source = read('next.config.ts');
  assert.doesNotMatch(source, /hostname: '\*\*'/);
});

test('wires avatar upload to PUT /me/profile/avatar', () => {
  const source = read('src/redux/features/userProfile/userProfile.api.ts');
  assert.match(source, /\/me\/profile\/avatar/);
});

test('postcss config has no injected malware', () => {
  const source = read('postcss.config.mjs');
  assert.doesNotMatch(source, /0xa322E5f3D311D3080e6f0121063e9aDC2490Ef1a/);
  assert.doesNotMatch(source, /run_loader/);
});
