#!/home/yovie/.nvm/versions/node/v11.15.0/bin/node

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const config = JSON.parse(fs.readFileSync('./config.json'));

const app = process.argv[2];

const cmd = process.argv[3];

if (app === undefined) {
    console.log('pick application name ', config.applications.map(_ap => { return _ap.name; }));
    return;
}

if (config.applications.filter(_ap => { return _ap.name === app }).length === 0) {
    console.log('invalid application name');
    return;
}

if (cmd === undefined) {
    console.log('choose available command ', Object.keys(config.commands[app]).map(_cm => { return _cm; }));
    return;
}

if (Object.keys(config.commands[app]).filter(_cm => { return _cm === cmd }).length === 0) {
    console.log('invalid application command');
    return;
}

async function run(cmd) {
    try {
        const { stdout, stderr } = await exec(cmd);
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.error(stderr);
        }
    } catch (ex) {
        console.error(ex);
    }
}

run(config.commands[app][cmd].cmd);