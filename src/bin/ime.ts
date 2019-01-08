#!/usr/bin/env node

import * as program from 'commander';
import { localVersion } from '../util/version';
import defineEnv from '../util/defineEnv';

import watch from '../lib/watch';
import build from '../lib/build';

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
            watch();
        }
    );

program
    .command('build')
    .description('打包前端文件')
    .action(
        (): void => {
            // 设置环境变量
            defineEnv(program.env);
            build();
        }
    );
