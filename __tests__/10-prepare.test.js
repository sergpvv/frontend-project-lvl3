/* eslint-disable no-underscore-dangle */
import path from 'path';
import { fileURLToPath } from 'url';
import { getEntryPointPath } from './helpers/utils.js';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('entry point', async () => {
  const codePath = path.join(__dirname, '..', 'code');
  const entryPointPath = await getEntryPointPath(codePath);

  const enryPointModule = await import(entryPointPath);
  expect(typeof enryPointModule.default).toEqual('function');
});

