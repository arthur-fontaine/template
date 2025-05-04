import fs from 'node:fs';
import { execSync } from 'node:child_process';

import { featureGenerator } from "./feature.mjs";
import { initGenerator } from './init.mjs';

export default function (plop) {
  plop.setGenerator('feature', featureGenerator(plop));
  plop.setGenerator('init', initGenerator(plop));

  plop.setActionType('addFolder', (answers, config) => {
    const { path, base } = config.data;
    
    const paths = Array.isArray(path) ? path : [path];
    const basePath = base ? plop.renderString(base, answers) : '.';
    
    const folderPaths = paths.map((p) => `${basePath}/${plop.renderString(p, answers)}`);
    folderPaths.forEach((folderPath) => fs.mkdirSync(folderPath, { recursive: true }));

    return folderPaths.join(', ');
  });

  plop.setActionType('run', (answers, config) => {
    const { command } = config.data;
    execSync(plop.renderString(command, answers), { stdio: 'inherit' });
  });
};
