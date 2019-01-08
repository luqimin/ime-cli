/**
 * 获取项目根目录路径
 */

import * as path from 'path';
import * as fs from 'fs-extra';

import { readFile } from '../../util/readFile';
import { configNames } from '../../config/const';

/**
 * IME配置项
 */
export interface IMEConfig {
    /**
     * 是否开启调试模式
     */
    debug?: boolean;

    /**
     * 版本号，生产环境编译时，静态文件名将会携带版本号
     */
    version?: string;

    /**
     * less modifyVars配置
     */
    lessModifyVars?: { [key: string]: string };

    /**
     * nodemon配置
     */
    nodemon?: {
        script?: string;
        watch?: string[];
        ignore?: string[];
        verbose?: boolean;
        env?: { [key: string]: string };
        ext?: string;
        stdout?: boolean;
    };
}

export interface Root {
    rootPath?: string;
    clientPath?: string;
    serverPath?: string;
    clientSourcePath?: string;
    serverSourcePath?: string;
    config?: IMEConfig;
}

/**
 * 获取配置文件
 * @param curPath - 目录
 */
const getConfig = (curPath: string): IMEConfig | undefined => {
    let projectConfig: IMEConfig | undefined;
    const currentFiles: string[] = fs.readdirSync(curPath);

    for (const file of currentFiles) {
        if (configNames.includes(file)) {
            projectConfig = readFile(path.resolve(curPath, file));
            return projectConfig;
        }
    }
    return projectConfig;
};

export const getRootConfig = (): Root | null => {
    const rootPath: string = process.cwd();
    const config = getConfig(rootPath);

    if (!config) {
        throw new Error('找不到ime配置文件');
    }

    const root: Root = {
        rootPath,
        config,
        clientPath: path.join(rootPath, 'build/client'),
        serverPath: path.join(rootPath, 'build/server'),
        clientSourcePath: path.join(rootPath, 'server'),
        serverSourcePath: path.join(rootPath, 'server'),
    };

    return root;
};
