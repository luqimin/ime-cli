/**
 * egg-ts-helper
 */
import * as spawn from 'cross-spawn';

import { BaseClass } from '../base';

class ETS extends BaseClass<any> {
    protected taskRunning() {
        const { config, rootPath } = this.runtime;

        if (config && config.ets && config.ets.enable !== false) {
            const ets = spawn('npx', ['ets', '-w', '-c', './server'], { cwd: rootPath });
            ets.stdout &&
                ets.stdout.on('data', (data) => {
                    console.log(data + '');
                });
        }
    }
}

export default ETS;
