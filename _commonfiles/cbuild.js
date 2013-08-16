//#!/usr/bin/env node
// Just use 'node cbuild' to run this.

/*
    Not particularly nice JS, but it works....
    Need to get rid of sync file methods.
    This whole script should be redone using promises.
    Has been JSLinted.
*/

var VERSION = 'v1';

var path = require('path');

//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//var guid =
//    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//        'use strict';
//        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
//        return v.toString(16);
//    });

var gProcessSystem = process.platform + '.' + process.arch;
var FULLTITLE = path.basename(process.argv[1], '.js') + ' (' + VERSION + ' ' + gProcessSystem + ')' + ' (' + 'njs=' + process.version + '/' + 'v8=' + process.versions.v8 + ')';

var DEBUG = false;
var EOLN = '\n';

var
    fs = require('fs'),
    childproc = require('child_process'),
    optimist = require('optimist'),
    wrench = require('wrench'),
    util = require('util');

var argConfigDef = 'debug';

var argConfig = '';
var argDoc = 'y';  //  set to 'n' to skip doxygen processing
var argTestsOnly = false; // if true, then assuming files are built, just run the tests
var arg_v = '';

var gCmdConfig = '';
var gLog = '';
var gRootDir = path.resolve('..');
var gRootOutDir = '';
var gRootBldDir = '';
var gRootInsDir = '';
var gPath_Delim = ':';

if (process.platform === 'win32') {
    gPath_Delim = ';';
}

if (process.env.NODE_PATH === null) {
    process.env.NODE_PATH = '';
}
//noinspection JSLint

process.env.NODE_PATH = process.env.NODE_PATH + gPath_Delim + path.join(__dirname, 'node_modules');

var gStartTime = new Date();

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
function quoted(str) {
    'use strict';
    return "'" + str + "'";
}
function dquoted(str) {
    'use strict';
    return '"' + str + '"';
}
function eoln(count) {
    'use strict';
    var s = '', i;
    for (i = 0; i < count; i += 1) {
        s += EOLN;
    }
    return s;
}
function print(msg) {
    'use strict';
    console.log(msg);
}
function log(msg) {
    'use strict';
    if (gLog !== '') {
        fs.appendFileSync(gLog, msg + EOLN);
    }
}

function printDuration(code) {
    'use strict';
    var etime = new Date(),
        duration = (etime.getTime() - gStartTime.getTime()) / 1000,
        s = EOLN + 'Duration = ' + duration;
    if (code !== 0) {
        fs.writeSync(2, s);
    } else {
        print(s);
    }
}

function quit(code, msg) {
    'use strict';
    if (msg !== undefined && msg !== '') {
        print('');
        fs.writeSync(2, msg);
    }
    printDuration(code);
    log(msg);
    log('exit code=' + code);
    print('');
    process.exit(code);
}

//function list(val) {
//    'use strict';
//    return val.split(',');
//}
//function parseBool(str) {
//    'use strict';
//    return (/^y|yes|t|true|1$/i).test(str);
//}

function usage(msg, help) {
    'use strict';
    print(msg);
    quit(-1, help);
}
////////////////////////////////////////////////////////////////////////////////////////
function copycommonfiles(src, dstdir) {
    'use strict';
    var srcdir = gRootDir + '/_commonfiles/project/' + src;
    wrench.copyDirSyncRecursive(srcdir, dstdir, {preserve: true});
    print('copied ' + quoted(srcdir) + ' to ' + quoted(dstdir));
}

function copyfile(src, dst) {
    'use strict';
    var data = fs.readFileSync(src);
    fs.writeFileSync(dst, data);
}
////////////////////////////////////////////////////////////////////////////////////////
function finish() {
    'use strict';
    log('# ' + new Date());
    log('# Completed. Duration = ' + (new Date().getTime() - gStartTime.getTime()) / 1000);
    printDuration(0);
    print('');
}

function setGlobalVars() {
    'use strict';
    //if (process.env.EG_CMAKE_MODULES === null) process.env['EG_CMAKE_MODULES'] = path.resolve('./_commonfiles/cmakemodules');
    gRootOutDir = gRootDir + '/_output-' + argConfig + '/' + gProcessSystem;
    gRootBldDir = gRootOutDir + '/build';
    gRootInsDir = gRootOutDir + '/install';
    gLog = gRootOutDir + '/cbuild.log';
    print('gRootOutDir=' + gRootOutDir);
    print('gRootBldDir=' + gRootBldDir);
    print('gRootInsDir=' + gRootInsDir);
    print('gLog=' + gLog);
    print('process.env.NODE_PATH=' + process.env.NODE_PATH);
}

function execCmd(cmd, callback, project) {
    'use strict';
    log(cmd);
    print(EOLN + process.cwd());
    if (DEBUG) {
        cmd = 'echo ' + cmd;
    } else {
        print(cmd + EOLN);
    }

    var child = childproc.exec(cmd, { stdio: 'inherit'});
    child.stdout.on('data', function (data) {
        process.stdout.write(data
            .replace(/1>/gm, '')
            .replace(/error : Unknown IO error/, 'You can probably ignore this likely spurious nodejs "error" - [error : Unknown IO error]')
            );
    });
    child.stderr.on('data', function (data) {
        process.stderr.write(data
            .replace(/1>/gm, '')
            );
    });
    child.on('exit', function (code) {
        print('\n');
        if (code !== 0) {
            quit(code, '***ERROR***: ' + cmd);
        } else {
            if (callback !== undefined) {
                callback(project);
            }
        }
    });
}

function chainfn(cmd, callback, project) {
    'use strict';
    if (cmd !== '') {
        execCmd(cmd, callback, project);
    } else if (callback !== undefined) {
        callback(project);
    } else {
        quit(-1, "chainfn - no cmd or callback defined.");
    }
}

function set_run(project, id) {
    'use strict';
    print('');
    print('*********************************************************************** ' + project + '(' + id + ')');
    process.chdir(gRootBldDir + '/' + project);
}

function setup_test(project) {
    'use strict';
    var cmd = '', progBinDir = '';
    if (project.match(/[.]*tester/)) {
        progBinDir = gRootInsDir + '/bin/' + project;
        if (process.platform === 'win32') {
            progBinDir = gRootInsDir + '/' + project + '/bin';
        }
        if (fs.existsSync(progBinDir)) {
            process.chdir(progBinDir);
            log('# ' + process.cwd());
            cmd = 'node runtester';
            if (arg_v !== '') {
                cmd += ' -- ' + arg_v;
            }
        }
    }
    return cmd;
}


// Create folder if it does not exist - if force then delete the folder first.
function createFolder(foldername, force) {
    //'use strict';     // we need to get rid of wrench
    if (force && fs.existsSync(foldername)) {
        print('Removing build folder ' + foldername);
        wrench.rmdirSyncRecursive(foldername, false);
    }
    if (!fs.existsSync(foldername)) {
        print('Creating build folder ' + foldername);
        wrench.mkdirSyncRecursive(foldername, 0777);
        //fs.mkdirSync(foldername);
    }
}

function catFile(filename) {
    'use strict';
    var hascontent = false, buf = '';
    if (fs.existsSync(filename)) {
        buf = fs.readFileSync(filename, 'utf8');
        if (buf.length > 0) {
            hascontent = true;
            print('');
            print(buf);
        }
    }
    return hascontent;
}

/////////////////////////////////////////////////////////////////////////////
function doc_preprocess() {
    'use strict';
    var docerrxxxfilename = 'doxygen-*.log';
    try {
        fs.unlinkSync(docerrxxxfilename);
    } catch (e) {
    }
    return true;
}

function doc_postprocess() {
    'use strict';
    var docerrhtmfilename = 'doxygen-htm.err.log',
        docerrchmfilename = 'doxygen-chm.err.log',
        docerrpdffilename = 'doxygen-pdf.err.log';

    if ((catFile(docerrhtmfilename) || catFile(docerrchmfilename) || catFile(docerrpdffilename))) {
        print('');
        quit(-1, '***ERROR***: running Doxygen.');
    }
    print('');
    return true;
}

function eclipse_cmake_fix(dir) {
    'use strict';
    var file = dir + '/.cproject',
        data = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file + '.bak', data);
    data = data.replace('pathentry kind="mac" name="__cplusplus" path="" value="1"/', '');
    fs.writeFileSync(file, data);
}

function copypackagesto(dstdir) {
    'use strict';
    wrench.mkdirSyncRecursive(dstdir, 0x0777);
    var files = fs.readdirSync('.');
    if (files.length) {
        files.forEach(function (file) {
            if (file.match(/[.]*\.exe/i) // Windows
                    || file.match(/[.]*\.deb/i) // *nix
                    || file.match(/[.]*\.rpm/i) // *nix
                    || file.match(/[.]*\.dmg/i) // osx
                    || file.match(/[.]*\.tar[.]*/i) // *nix/osx source
                    || file.match(/[.]*\.zip/i) // Windows source
                    ) {
                print('Copying package ' + file + ' -> ' + dstdir);
                copyfile(file, dstdir + '/' + file);
            }
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
function run_test(project) {
    'use strict';
    set_run(project, 'run_test');
    var cmd = setup_test(project);
    chainfn(cmd, runtests, project);
}

function runtests(project) {
    'use strict';
    if (project === undefined) {
        chainfn('', run_test, 'egcoretester');
    } else if (project === 'egcoretester') {
        chainfn('', run_test, 'egfntester');
    } else {
        finish();
    }
}

function runproject(project) {
    'use strict';
    var liborapp = '', cmd = '';
    if (project === undefined) {
        project = 'egcore';
        liborapp = 'libs';
    } else if (project === 'egcore') {
        project = 'egcoretester';
        liborapp = 'apps';
    } else if (project === 'egcoretester') {
        project = 'egfn';
        liborapp = 'libs';
    } else if (project === 'egfn') {
        project = 'egfntester';
        liborapp = 'apps';
    } else {
        project = undefined;
        runtests();
    }

    if (project !== undefined) {
        cmd = '';
        process.chdir(gRootDir);
        print('');
        print('# ' + process.cwd());
        log('# ' + process.cwd());
        copycommonfiles('both', project);
        copycommonfiles(liborapp, project);
        createFolder(gRootBldDir + '/' + project, false);
        chainfn(cmd, runbuild_first, project);
    }
}
/////////////////////////////////////////////////////////////////////////////
function runbuild_last(project) {
    'use strict';
    set_run(project, 'run_last');
    var cmd = '';
    chainfn(cmd, runproject, project);
}

function runbuild_install(project) {
    'use strict';
    set_run(project, 'run_install');
    var cmd = 'cmake --build . --target install' + gCmdConfig;
    copypackagesto(gRootOutDir);
    chainfn(cmd, runbuild_last, project);
}

function runbuild_pkg_src(project) {
    'use strict';
    set_run(project, 'run_pkg_src');
    var cmd = 'cmake --build . --target package_source' + gCmdConfig;
    chainfn(cmd, runbuild_install, project);
}

function runbuild_pkg(project) {
    'use strict';
    set_run(project, 'run_pkg');
    var cmd = 'cmake --build . --target pkg' + gCmdConfig;
    doc_postprocess();
    chainfn(cmd, runbuild_pkg_src, project);
}

function runbuild_doc(project) {
    'use strict';
    var cmd = '';
    if (argDoc === 'y') {
        set_run(project, 'run_doc');
        cmd = 'cmake --build . --target doc' + gCmdConfig;
    }
    chainfn(cmd, runbuild_pkg, project);
}

function runbuild_build(project) {
    'use strict';
    set_run(project, 'run_build');
    var cmd = 'cmake --build .' + gCmdConfig;
    if (process.platform !== 'win32') {
        eclipse_cmake_fix(gRootBldDir + '/' + project);
    }
    doc_preprocess();
    chainfn(cmd, runbuild_doc, project);
}

function runbuild_generate(project) {
    'use strict';
    var eclipse = '', progInsDir = gRootInsDir, cmd;
    set_run(project, 'run_generate');
    if (process.platform === 'win32') {
        progInsDir += '/' + project;
    } else {
        eclipse = ' -G"Eclipse CDT4 - Unix Makefiles"';
    }
    cmd = 'cmake ' + dquoted(gRootDir + '/' + project) +
        ' -DEG_BUILDDOC=' + argDoc +
        ' -DCMAKE_BUILD_TYPE=' + argConfig +
        ' -DCMAKE_LEGACY_CYGWIN_WIN32=0' +
        ' -DCMAKE_INSTALL_PREFIX=' + progInsDir +
        ' -DCMAKE_PREFIX_PATH=' + gRootInsDir + eclipse;
    chainfn(cmd, runbuild_build, project);
}

function runbuild_first(project) {
    'use strict';
    set_run(project, 'run_first');
    var cmd = '';
    chainfn(cmd, runbuild_generate, project);
}

////////////////////////////////////////////////////////////////////////////////////////
function processArgs() {
    'use strict';
    var argv = optimist
        .options('config', {
            "default": argConfigDef,
            describe: 'debug | release',
            string: true
        })
        .usage(eoln(1) + 'Build everything.')
        .argv;

    if (argv.h) {
        return usage('', optimist.help());
    }

    argConfig = argv.config;
    if (typeof argConfig !== 'string') {
        return usage('config does not resolve to a string', optimist.help());
    }

    if (argConfig !== '') {
        gCmdConfig = ' --config ' + argConfig;
    }

    argv._.forEach(function (arg) {
        arg_v += ' ' + arg;
    });

    print('Use -h for usage');
    print('');
    print('config=' + argConfig);
    print('arg_v=' + arg_v);

    return true;
}
////////////////////////////////////////////////////////////////////////////////////////
function main() {
    'use strict';
    if (!processArgs()) {
        return;
    }
    print('');

    setGlobalVars();
    createFolder(gRootBldDir, false);
    createFolder(gRootInsDir, false);

    if (fs.existsSync(gLog)) {
        fs.unlinkSync(gLog);
    }

    log('# ' + FULLTITLE);
    log('# ' + gStartTime);
    print('');

    if (argTestsOnly) {
        runtests();
    } else {
        runproject();
    }

    log('# ' + new Date());
    log('# Completed. Duration = ' + (new Date().getTime() - gStartTime.getTime()) / 1000);
}
//////////////////////////////////////////////////////
print('');
print(FULLTITLE);
print('');

main();
