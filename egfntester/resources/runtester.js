#!/usr/bin/env node

var project = 'egfn';
var dependent_projects = 'egcore';

var 
	abrsample = require('./runtestermod');

abrsample.run(project, dependent_projects, project + 'tester' + 'm');


