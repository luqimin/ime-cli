import { Pack } from 'ime-pack';
import { BaseClass } from '../base';

interface Params {
    dllOnly: boolean;
}

class Builder extends BaseClass<Params> {
    constructor(params?: Params) {
        super(params);
    }

    protected async taskRunning() {
        const { rootPath } = this.runtime;
        const pack = new Pack({ context: rootPath! });

        await pack.compileClientDll();

        if (this.params && this.params!.dllOnly) {
            return;
        }

        await pack.compileClient();
        await pack.compileSSR();
        await pack.compileServerStatic();
        await pack.compileServer();
    }
}

export default Builder;
