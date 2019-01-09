import { Pack } from 'ime-pack';
import { Runtime } from '../base/BaseClass';

export default (runtime: Runtime) => {
    return new Pack(
        {
            context: runtime.rootPath!,
            clientPath: runtime.clientPath,
            clientSourcePath: runtime.clientSourcePath,
            serverPath: runtime.serverPath,
            serverSourcePath: runtime.serverSourcePath,
        },
        runtime.config
    );
};
