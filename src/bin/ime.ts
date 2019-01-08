#!/usr/bin/env node

import * as program from 'commander';
import chalk from 'chalk';
import { localVersion } from '../util/version';
import defineEnv from '../util/defineEnv';

import Watcher from '../lib/watch';
import Builder from '../lib/build';

program
    .version(localVersion)
    .option('-e, --env [env]', '设置 NODE_ENV 环境变量 production/development, 可简写首字母')
    .option('--verbose', 'ime将打印更多信息');

program
    .command('start')
    .description('开启本地服务')
    .action(
        (): void => {
            // 设置环境变量
            defineEnv(program.env);
            program.verbose && (process.env.IME_LOGLEVEL = 'verbose');
            new Watcher().run();
        }
    );

program
    .command('build')
    .description('打包前端文件')
    .action(
        (): void => {
            // 设置环境变量
            defineEnv(program.env);
            new Builder().run();
        }
    );

program.on('--help', () => {
    console.log('\n  IME 命令说明:');

    console.log('\n    $ i start');
    console.log(chalk.gray('    # 开启本地开发模式'));

    console.log('\n    $ i build');
    console.log(chalk.gray('    # 打包所有文件'));

    console.log('\n');
});

// 命令敲错则直接显示帮助信息
(function activeHelp() {
    program.parse(process.argv);
    if (program.args.length < 1) {
        return program.help();
    }
})();
