/**
 * node服务端任务
 */
import * as path from 'path';
import * as nodemon from 'nodemon';
import * as extend from 'extend';
import { debounce } from 'lodash';

import { BaseClass } from '../base';
import log from '../util/log';

class NodemonServer extends BaseClass<any> {
    protected taskRunning() {
        const { serverPath = '' } = this.runtime;

        // 获取node工程入口路径
        const entryPath: string = path.join(serverPath, 'index.js');

        // 合并nodemon配置
        let nodemonConfig = {};
        nodemonConfig = extend(
            true,
            nodemonConfig,
            {
                script: entryPath,
                watch: serverPath,
                ignore: ['test/*', 'public/*', 'log/*'],
                verbose: true,
                env: {
                    NODE_ENV: 'development',
                    DEBUG: 'sinba,log*',
                },
                ext: 'js,json,ejs',
            },
            this.config && this.config.nodemon
        );

        // 启动nodemon
        nodemon(nodemonConfig);

        const restartLog = debounce(() => {
            log.warn('「server」重启中...');
        });

        nodemon
            .on('start', () => {
                log.success('「server」已开启');
            })
            .on('quit', () => {
                log.info('「server」已关闭');
                process.exit();
            })
            .on('restart', restartLog);
    }
}

export default NodemonServer;
