#!/usr/bin/env node

console.log('');
console.log('[' + process.title + ' (' + process.platform + ')]');
console.log('');

var 
	fs = require('fs'),
	util = require('util'),
	wrench = require('wrench');
	
function quoted(str) {
	return "'" + str + "'";
}
function dquoted(str) {
	return '"' + str + '"';
}

function copycommonfiles(src, dst) {
	var srcdir = __dirname + '/_commonfiles/project/' + src;
	var dstdir = dst;
	wrench.copyDirSyncRecursive(srcdir, dstdir, {preserve:true});
	console.log('  copied ' + quoted(srcdir) + ' to ' + quoted(dstdir));
}

function processproj(project) {
	var proj = project;
	console.log('Copied project files for ' + quoted(proj));
	copycommonfiles('both', proj);
	copycommonfiles('libs', proj);
	proj = project + 'tester';
	console.log('Copied project files for ' + quoted(proj));
	copycommonfiles('both', proj);
	copycommonfiles('exes', proj);
}

processproj('egcore');
processproj('egfn');
