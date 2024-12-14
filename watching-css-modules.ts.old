import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import selectorParse from 'postcss-selector-parser';
import prettier from 'prettier';
import { Plugin, ResolvedConfig } from 'vite';

function isDir(dir: string): boolean {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

function isCSSSelectorValid(selector: string): boolean {
  try {
    selectorParse().processSync(selector);
    return true;
  } catch (error) {
    console.error(`Invalid CSS selector: ${selector}. ${error}`);
    return false;
  }
}

const changingFilePath = (config: ResolvedConfig, file: string): string =>
  path.join(config.build.outDir, path.relative(config.publicDir, file));

const removeDupStrFromArray = (arr: string[]): string[] => {
  const uniqueArray: string[] = [];

  for (const str of arr) {
    if (!uniqueArray.includes(str)) {
      uniqueArray.push(str);
    }
  }

  return uniqueArray;
};

const typeDeclaration = async (classArray: string[]): Promise<string> => {
  const data = `declare const styles: {${classArray
    .map((el) => `readonly '${el}': string;`)
    .join('')}};export default styles;`;
  const formattedData = await prettier.format(data, {
    parser: 'typescript',
  });
  return formattedData;
};

function createUniquesClassName(fullPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const css = fs.readFileSync(fullPath, 'utf8');
    const classNames: string[] = [];
    postcss()
      .process(css, { from: fullPath, to: fullPath.replace('.css', '.d.css') })
      .then(async (result) => {
        result.root.walkRules((rule) => {
          if (!isCSSSelectorValid(rule.selector)) return;
          selectorParse((selectors) => {
            selectors.walkClasses((selector) => {
              classNames.push(selector.value);
            });
          }).processSync(rule.selector);
        });

        const uniquesClassName = removeDupStrFromArray(classNames);
        resolve(uniquesClassName);
      })
      .catch(reject);
  });
}

async function createDeclarationFile(fullPath: string): Promise<void> {
  const uniquesClassName = await createUniquesClassName(fullPath);

  if (uniquesClassName.length > 0) {
    const declarationPath = fullPath.replace('.module.css', '.module.css.d.ts');
    const formattedDeclaration = await typeDeclaration(uniquesClassName);

    try {
      fs.writeFileSync(declarationPath, formattedDeclaration);
    } catch (err) {
      console.log('Error writing file:', err);
    }
  }
}

function getCssModulesFiles(pathDir: string): void {
  const directory = pathDir;

  if (isDir(directory)) {
    fs.readdirSync(directory).forEach(async (dir) => {
      const fullPath = path.join(directory, dir);
      if (isDir(fullPath)) return getCssModulesFiles(fullPath);
      if (!fullPath.endsWith('.module.css')) return;

      try {
        await createDeclarationFile(fullPath);
      } catch (e) {
        console.log(e);
      }
    });
  } else {
    if (!directory.endsWith('.module.css')) return;
    createDeclarationFile(directory);
  }
}

export function CssModuleTypes(): Plugin {
  return {
    name: 'css-modules-types',
    apply: 'serve',
    async configureServer() {
      const directory = path.join(__dirname, './src');
      await getCssModulesFiles(directory);
    },
    // HMR
    async handleHotUpdate({ server: { config }, file }) {
      if (file.endsWith('module.css')) {
        fs.readFile(changingFilePath(config, file), 'utf8', (err, css) => {
          if (err) {
            console.log(`Error reading CSS file: ${err}`);
            return;
          }
          postcss()
            .process(css, {
              from: changingFilePath(config, file),
            })
            .then(async (result) => {
              const classNames: string[] = [];
              try {
                result.root.walkRules((rule) => {
                  if (!isCSSSelectorValid(rule.selector)) return;
                  selectorParse((selectors) => {
                    selectors.walkClasses((selector) => {
                      classNames.push(selector.value);
                    });
                  }).processSync(rule.selector);
                });

                const uniquesClassName = removeDupStrFromArray(classNames);

                if (uniquesClassName.length > 0) {
                  const newDestPath = changingFilePath(config, file).replace(
                    '.module.css',
                    '.module.css.d.ts',
                  );
                  fs.writeFile(newDestPath, await typeDeclaration(uniquesClassName), (error) =>
                    console.log('Error writing declaration file:', error),
                  );
                }
              } catch (error) {
                console.log(`Error in ${result.opts.from}:`, error);
              }
            })
            .catch((err) => console.log(`Error processing CSS file:`, err));
        });
      }
    },
  };
}
