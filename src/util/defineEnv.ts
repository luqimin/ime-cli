export default (env: string) => {
    switch (env) {
        case 'd':
        case 'development':
            process.env.NODE_ENV = 'development';
            break;
        case 'p':
        case 'production':
            process.env.NODE_ENV = 'production';
            break;
        default:
            process.env.NODE_ENV = 'development';
            break;
    }
};
