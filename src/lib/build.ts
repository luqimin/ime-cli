import { BaseClass } from '../base';
import creatPack from '../util/packFactory';

interface Params {
    dllOnly: boolean;
}

class Builder extends BaseClass<Params> {
    constructor(params?: Params) {
        super(params);
    }

    protected async taskRunning() {
        const pack = creatPack(this.runtime);

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
