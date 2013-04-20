#!/usr/bin/env node

var project = 'egcore';
var dependent_projects = '';

var 
	abrsample = require('./runtestermod');

abrsample.run(project, dependent_projects, project + 'tester' + 'm');
