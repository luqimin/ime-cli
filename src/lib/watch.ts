import { Pack } from 'ime-pack';
import Server from '../lib/server';

const pack = new Pack({ context: __dirname });

export default () => {
    pack.watchClient();
    pack.watchSSR();
    pack.watchServerStatic();
    pack.watchServer();
    new Server().run();
};
