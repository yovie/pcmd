const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const homedir = require('os').homedir();

const config = JSON.parse(fs.readFileSync(homedir + '/pcmd.json'));

const app = process.argv[2];

const cmd = process.argv[3];

if (app === undefined) {
	console.log('pick service name ', config.services.map(_ap => { return _ap.name; }));
	return;
}

if (config.services.filter(_ap => { return _ap.name === app }).length === 0) {
	console.log('invalid service name');
	return;
}

if (cmd === undefined) {
	console.log('choose available command ', Object.keys(config.commands[app]).map(_cm => { return _cm; }));
	return;
}

if (Object.keys(config.commands[app]).filter(_cm => { return _cm === cmd }).length === 0) {
	console.log('invalid service command');
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
		// console.error(ex);
	}
}

function runRequired(services, command) {
	for (let svc of services) {
		if (config.commands[svc] === undefined) {
			console.log('invalid service name');
		} else {
			console.log('run', svc);
			if (config.commands[svc][command].cmd !== undefined) {
				run(config.commands[svc][command].cmd);
			}
		}
	}
}

// run required service
if (config.commands[app][cmd].require !== undefined && Array.isArray(config.commands[app][cmd].require)) {
	runRequired(config.commands[app][cmd].require, cmd);
}

// run main service
if (config.commands[app][cmd].cmd !== undefined && typeof config.commands[app][cmd].cmd === 'string') {
	console.log('run', app);
	run(config.commands[app][cmd].cmd);
}
