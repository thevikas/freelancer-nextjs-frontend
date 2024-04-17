module.exports = function (shipit) {
    require('shipit-deploy')(shipit);
    require('shipit-shared')(shipit);

    const appName = 'freelancer-materio';

    //import production from .shipit.local.js
    const production = require('./.shipit.local.json');

    shipit.initConfig({
        default: {
            workspace: '/tmp/freelancer-nextjs-frontend',
            repositoryUrl: 'https://github.com/thevikas/freelancer-nextjs-frontend.git',
            ignores: ['.git', 'node_modules'],
            rsync: ['--del'],
            keepReleases: 3,
            shallowClone: true,
            shared: {
                overwrite: true,
                dirs: [
                    '.cache',
                ],
                files: [
                    '.env.local'
                ]
            },
        },
        production
    });

    // Task to install dependencies
    shipit.blTask('install_dependencies', async () => {
        await shipit.remote(`cd ${shipit.releasePath} && npm install`);
    });

    // Task to build the project
    shipit.blTask('build', async () => {
        await shipit.remote(`cd ${shipit.releasePath} && npm run build`);
    });

    // Task to export the project
    shipit.blTask('export', async () => {
        await shipit.remote(`cd ${shipit.releasePath} && npm run export`);
    });

    // Task to restart the server (this can be adapted based on your server setup)
    /*shipit.blTask('restart_server', async () => {
        await shipit.remote('pm2 restart all'); // Using PM2 as an example
    });*/

    // Listen to the 'updated' event and run tasks
    shipit.on('updated', async () => {
        await shipit.start('install_dependencies', 'build', 'export');
    });

    shipit.on('published', async () => {
        //await shipit.start('restart_server');
    });
};
