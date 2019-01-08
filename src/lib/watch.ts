import * as fs from 'fs-extra';
import { Pack } from 'ime-pack';
import { BaseClass } from '../base';
import Server from '../lib/server';
import Builder from '../lib/build';

class Watcher extends BaseClass<any> {
    protected async taskRunning() {
        const { rootPath, clientPath, serverPath } = this.runtime;
        const pack = new Pack({ context: rootPath! });

        if (!fs.pathExistsSync(clientPath!) || !fs.pathExistsSync(serverPath!)) {
            // 打包所需文件
            await new Builder({ dllOnly: true }).run();
            await pack.watchClient();
            await pack.watchSSR();
        } else {
            pack.watchClient();
            pack.watchSSR();
        }

        pack.watchServerStatic();
        pack.watchServer();
        new Server().run();
    }
}

export default Watcher;
