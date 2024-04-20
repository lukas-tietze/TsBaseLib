import { existsSync } from 'fs';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import yargs, { Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';

const rootDir = resolve(__dirname, '../..');
const templateDir = resolve(rootDir, '_template');

if (!existsSync(templateDir)) {
  throw new Error(`Vorlage ${templateDir} konnte nicht gefunden werden`);
}

async function copyFileIfNotExists(src: string, target: string): Promise<boolean> {
  if (!existsSync(target)) {
    await copyFile(src, target);

    return true;
  }

  return false;
}

async function updateStaticFiles(targetDir: string) {
  await copyFile(resolve(templateDir, 'LICENSE'), resolve(targetDir, 'LICENSE'));

  for (const file of ['.gitignore', 'jest.config.ts', 'README.md', 'tsconfig.json', 'tsconfig.test.json']) {
    await copyFileIfNotExists(resolve(templateDir, file), resolve(targetDir, file));
  }
}

function mergePackageJson(src: any, target: any): object {
  return {
    ...target,

    private: src.private,
    preview: src.preview,
    main: src.main,
    types: src.types,
    files: src.files,
    exports: src.exports,
    scripts: {
      ...target.scripts,
      ...src.scripts,
    },
    author: src.author,
    license: src.license,
    devDependencies: {
      ...target.devDependencies,
      ...src.devDependencies,
    },
    publishConfig: src.publishConfig,
    tshy: src.tshy,
    type: src.type,
  };
}

async function updatePackageJson(targetDir: string) {
  const srcPath = resolve(templateDir, 'package.json');
  const targetPath = resolve(targetDir, 'package.json');

  if (!copyFileIfNotExists(srcPath, targetPath)) {
    return;
  }

  const srcJson = JSON.parse(await readFile(srcPath, { encoding: 'utf-8' }));
  const targetJson = JSON.parse(await readFile(srcPath, { encoding: 'utf-8' }));

  const resultJson = mergePackageJson(srcJson, targetJson);

  await writeFile(targetPath, JSON.stringify(resultJson, undefined, 2) + '\n', { encoding: 'utf-8' });
}

async function run(argv: Arguments) {
  const projectName = String(argv['project']);
  const projectPath = resolve(rootDir, projectName);

  console.log(`Aktualisiere statische Dateien für Projekt ${projectName} unter ${projectPath} Vorlage ${templateDir}`);

  if (!existsSync(projectPath)) {
    throw new Error(`Projektverzeichnis ${projectPath} konnte nicht gefunden werden`);
  }

  await updateStaticFiles(projectPath);
  await updatePackageJson(projectPath);
}

yargs(hideBin(process.argv))
  .command(
    '* <project>',
    'updates common files used in each project or creates them',
    (yargs) =>
      yargs.positional('project', {
        describe: 'project to apply to',
        demandOption: true,
        type: 'string',
      }),
    run
  )
  .strictCommands()
  .strictOptions()
  .parseAsync();
