/**
 * repl日志封装
 */
import chalk from 'chalk';
import { getRootConfig } from '../base';
import getTime from './time';

export const prefix = (): string => {
    return chalk.magenta(`[${getTime()}]`) + chalk.blue('[ime] ');
};

const logger = {
    info(text: string): void {
        console.log(prefix() + chalk.cyan(text));
    },
    success(text: string): void {
        console.log(prefix() + chalk.greenBright(text));
    },
    warn(text: string): void {
        console.log(prefix() + chalk.yellow(text));
    },
    error(text: string): void {
        console.log(prefix() + chalk.red(text));
    },
    async debug(text: string): Promise<void> {
        const { config = {} } = getRootConfig()!;
        config.debug &&
            console.log(
                prefix() + chalk.bgCyanBright.bold('[调试]') + ` ${text}`
            );
    },
};

export default logger;
