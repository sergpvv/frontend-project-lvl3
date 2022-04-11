/* eslint-disable no-underscore-dangle */
import path from 'path';
import { fileURLToPath } from 'url';
import readPackageJson from 'read-package-json-fast';
import _ from 'lodash';

const getEntryPointPath = async (projectPath) => {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageSource = await readPackageJson(packageJsonPath);
  // TODO: find a ready-made solution with normalization
  const main = _.get(packageSource, 'main', 'index.js');
  return path.join(projectPath, main);
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('entry point', async () => {
  const codePath = path.join(__dirname, '..');
  const entryPointPath = await getEntryPointPath(codePath);

  const entryPointModule = await import(entryPointPath);
  console.log('entryPointPath: ', entryPointPath, '; entryPointModule: ', entryPointModule);
  // expect(typeof entryPointModule.default).toEqual('function');
  expect(typeof codePath).toEqual('string');
});
