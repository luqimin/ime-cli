import * as fs from 'fs-extra';
import { BaseClass } from '../base';
import Server from '../lib/server';
import Builder from '../lib/build';
import creatPack from '../util/packFactory';

class Watcher extends BaseClass<any> {
    protected async taskRunning() {
        const { clientPath, serverPath } = this.runtime;
        const pack = creatPack(this.runtime);

        if (!fs.pathExistsSync(clientPath!) || !fs.pathExistsSync(serverPath!)) {
            // 打包所需文件
            await new Builder({ dllOnly: true }).run();
        }

        await Promise.all([pack.watchClient(), pack.watchSSR()]);

        pack.watchServerStatic();
        pack.watchServer();
        new Server().run();
    }
}

export default Watcher;
