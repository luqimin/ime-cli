import * as fs from 'fs-extra';
import { BaseClass } from '../base';
import Server from '../lib/server';
import Builder from '../lib/build';
import creatPack from '../util/packFactory';
import log from '../util/log';

class Watcher extends BaseClass<any> {
    protected async taskRunning() {
        const { clientPath, serverPath } = this.runtime;
        const pack = creatPack(this.runtime);

        if (!fs.pathExistsSync(clientPath!) || !fs.pathExistsSync(serverPath!)) {
            // 打包所需文件
            log.info('打包「dll」');
            await new Builder({ dllOnly: true }).run();
        }

        log.info('项目运行前需要打包「client、ssr」，请稍后...');
        await Promise.all([pack.watchClient(), pack.watchSSR()]);
        log.success('打包「client、ssr」结束');

        pack.watchServerStatic();
        pack.watchServer();
        new Server().run();
    }
}

export default Watcher;
