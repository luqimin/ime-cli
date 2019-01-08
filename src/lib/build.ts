import { Pack } from 'ime-pack';

const pack = new Pack({ context: __dirname });

export default async () => {
    await pack.compileClientDll();
    await pack.compileClient();
    await pack.compileSSR();
    await pack.compileServerStatic();
    await pack.compileServer();
};
