#!/usr/bin/env node

var path = require('path');

var DEFAULT_ROOTLOCATION = path.resolve('../..');
var BUILD_ROOT = path.resolve('../../../../../_commonfiles');
var DEBUG = false;
var EOLN = '\n';

var 
	fs = require('fs'),
	childproc = require('child_process');

var arg_ = '';

module.exports = {
	run: function(project, dependent_projects, exename) {
		localmain(DEFAULT_ROOTLOCATION, project, dependent_projects, exename);
	}
};

function localmain(defrootlocation, project, dependent_projects, exename) {
	print('');

    if (!processArgs()) return false;
	print('');
	
	var rootlocation = determineRootLocation(defrootlocation);
	if (process.platform === 'win32') {
		setenvwin(rootlocation, project, dependent_projects);
	} else if (process.platform === 'darwin') {
		setenvosx(rootlocation, project, dependent_projects);
	} else {
		setenvnix(rootlocation, project, dependent_projects);
	}
	
	var cmd = dquoted('./' + exename);
	cmd += ' ' + arg_;
	execCmd(cmd);
}

function determineRootLocation(defrootlocation) {
	// We're going to assume everything is co-located with egcore.
	if (process.platform === 'win32') {
		if (!fs.existsSync(defrootlocation + '/egcore'))
			return ''; 
	} else if (process.platform === 'darwin') {
		if (!fs.existsSync(defrootlocation + '/lib/libegcore.dylib'))
			return ''; 
	} else {
		if (!fs.existsSync(defrootlocation + '/lib/libegcore.so'))
			return ''; 
	}
	return defrootlocation;
}

function getwinlocation(project) {
	var libname = 'lib' + project + '.dll';
	var location = DEFAULT_ROOTLOCATION + '/' + project + '/lib';
	if (fs.existsSync(location + '/' + libname)) {
		return location;
	}
	location = process.env.PROGRAMFILES + '/' + project + '/lib';
	if (fs.existsSync(location + '/' + libname)) {
		return location;
	}
	location = process.env.PROGRAMFILES + ' (x86)/' + project + '/lib';
	if (fs.existsSync(location + '/' + libname)) {
		return location;
	}
	quit(-1, 'Can"t find windows DLL ' + libname);
	return '';
}

function setenvwin(rootlocation, project, dependent_projects) {
	// soooo painful
	//print('PATH=' + process.env.PATH); print('');
	process.env['PATH'] = getwinlocation(project) + ';' + process.env.PATH;
	if (dependent_projects.trim().length > 0) {
		var projects = dependent_projects.split(',');
		for (var i = 0; i < projects.length; ++i)
			if (projects[i].trim().length > 0)
				process.env['PATH'] = getwinlocation(projects[i].trim()) + ';' + process.env.PATH;
	}
	print('PATH=' + process.env.PATH);
}

function setenvosx(rootlocation, project, dependent_projects) {
	// Non-windows platforms are soooo, soooo, soooo much easier
	if (process.env.DYLD_LIBRARY_PATH === null)
		process.env['DYLD_LIBRARY_PATH'] = rootlocation + '/lib';
	else
		process.env['DYLD_LIBRARY_PATH'] = process.env.DYLD_LIBRARY_PATH + ':' + rootlocation + '/lib';
	print('DYLD_LIBRARY_PATH=' + process.env.DYLD_LIBRARY_PATH);
}

function setenvnix(rootlocation, project, dependent_projects) {
	// Non-windows platforms are soooo, soooo, soooo much easier
	if (process.env.LD_LIBRARY_PATH === null)
		process.env['LD_LIBRARY_PATH'] = rootlocation + '/lib';
	else
		process.env['LD_LIBRARY_PATH'] = process.env.LD_LIBRARY_PATH + ':' + rootlocation + '/lib';
	print('LD_LIBRARY_PATH=' + process.env.LD_LIBRARY_PATH);
}

function quoted(str) {
	return "'" + str + "'";
}
function dquoted(str) {
	return '"' + str + '"';
}

function eoln(count)
{
	var s = '';
	for (var i = 0; i < count; i++)
		s += EOLN;
	return s;
}

function usage(msg, help) {
	print(msg);
	quit(-1, help);
}

function quit(code, msg) {
	if (msg != '') {
		print('');
		fs.writeSync(2, msg + ' (code=' + code + ')');
	}
	process.exit(code);
}

function print(msg) {
	console.log(msg);
}

function execCmd(cmd) {
	print('');
	if (DEBUG) {
		cmd = 'echo ' + cmd;
	} else {
		print(cmd);
	}
	var child = childproc.exec(cmd, { stdio: 'inherit' });
	child.stdout.on('data', function(data) {
		process.stdout.write(data);
	});
	child.stderr.on('data', function (data) {
		process.stderr.write(data);
	});
	child.on('exit', function(code) { 
		print('');
		console.log('"' + cmd + '" child process exited with code ' + code);
		if (code != 0) quit(code, '');
	});		
}

function processArgs() {
var optimist;
	if (process.env.NODE_PATH === null)
		optimist = require(BUILD_ROOT + '/node_modules/optimist');
	else
		optimist = require('optimist');

	var  usagenote1 = '';
	if (process.platform === 'win32') {
		usagenote1 = '  (windows) ' + process.env.PROGRAMFILES;
	} else {
		usagenote1 = '  (Linux) default package/install locations (or as determined by LD_LIBRARY_PATH)';
	}
		
var argv = optimist
	.usage('' +
		eoln(1) + 'Run the program with the environment set up appropriately for the platform' +
		eoln(1) + '(e.g. PATH on Windows; LD_LIBRARY_PATH on Linux; DYLD_LIBRARY_PATH on OS X).' +
		
		eoln(2) + 'This assumes all the dependent files are rooted at one of the following:' +
		eoln(1) + '  relative to this file at ' + DEFAULT_ROOTLOCATION +
		eoln(1) + usagenote1 + '.' +
		
		eoln(2) + 'To pass arguments directly to the underlying executable use -- as a seperator.' +
		eoln(1) + 'For example, " -- arg1 arg2 etc"' +
		
		eoln(1) + '.' +
		''
		)
	.argv;

	if (argv.h) return usage('', optimist.help());

	argv._.forEach(function (arg) { 
		arg_ += ' ' + arg;
  });
	
	print('(use -h for usage)');
	print('');
	print('arg_=' + arg_);

	return true;
}
