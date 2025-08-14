import {exec, spawn} from 'child_process';
import * as prompt from '@clack/prompts';
import kleur from 'kleur';
import fs from 'fs';
import {rimrafSync} from 'rimraf';
import path from 'path';

const execAndForward = (command, options = {}) => {
    spawn(command, {shell: true, stdio: 'inherit', ...options});
}

let cwd = process.argv[2] || '.';

prompt.intro(`Welcome to GlobalForce!`);

if (cwd === '.') {
    const dir = await prompt.text({
        message: 'Where should we create your project?',
        placeholder: '  (hit Enter to use current directory)'
    });

    if (prompt.isCancel(dir)) process.exit(1);

    if (dir) {
        cwd = /** @type {string} */ (dir);
    }
}

if (fs.existsSync(cwd)) {
    const force = await prompt.confirm({
        message: kleur.bold().red().underline(`Directory "${cwd}" already exists, and will be deleted. Continue?`),
        initialValue: false
    });

    if (force !== true) {
        process.exit(1);
    }

    rimrafSync(cwd);
}

const cli = 'contract-flow';


    const framework = await prompt.select({
        message: 'What frontend framework would you like to use?',
        options: [
            {
                label: 'SvelteKit',
                value: 'svelte'
            },
            {
                label: 'Next.js (React)',
                value: 'react'
            },
            {
                label: 'Nuxt.js (Vue)',
                value: 'vue'
            }
        ]
    });

    if (prompt.isCancel(framework)) process.exit(1);

    // create cwd/contracts
    fs.mkdirSync(path.join(cwd, 'contracts'), {recursive: true});
    fs.mkdirSync(path.join(cwd, 'ui'), {recursive: true});
    fs.writeFileSync(path.join(cwd, 'README.md'), fs.readFileSync(path.join(__dirname, 'README_START.md'), 'utf-8'));
    prompt.outro(`Setting up your project in ${kleur.bold(cwd)}...`);

    if(framework === 'svelte') {
        execAndForward(`npx sv create ./ui`, {cwd});
    } else if(framework === 'react') {
        execAndForward(`npx create-next-app@latest ./ui`, {cwd});
    } else if(framework === 'vue') {
        execAndForward(`npx nuxi@latest init ./ui`, {cwd: path.join(cwd, 'ui')});
    }

    execAndForward(`npx ${cli} create .`, {cwd: path.join(cwd, 'contracts')});



