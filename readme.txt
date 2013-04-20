Purpose
-------
The purpose of this project is to demonstrate some aspects of using CMAKE with some simple interdependent demo C libraries and applications. GitHub is a great place to store projects, so here it is. It's targetted at me, but if someone else finds it useful, then great.

In particular:

1. generation of multiple debian packages with dependencies (also RPM), focussing on runtime, dev, debug packaging.
2. Cross-platform. Tested on Windows XP/7 32/64bit; Linux (Ubuntu) 32/64bit; FreeBSD (64bit); OS X (previous version tested)
2. integration with Doxygen
3. integration with Eclipse (*nix) - generates debug project files.
4. integration with Visual Studio - generates debug project files.
5. Use of cmake variables for source code modification at build time
6. Use of the excellent cmake find mechanism to "find" dependendent packages

License:
Public domain

Acknowledgements:
1. Kitware for an excellent alternative to autotools (http://www.cmake.org).
2. the excellent cmake mailing list
3. https://github.com/shadowmint/cmake-multi-install - for a very simple, easily understandable example of generating multiple debian packages (that got me started)

Requirements
CMAKE: Tested on 2.8.8.
nodejs: Tested on 0.10.0
doxygen: Tested on 1.8.2

Building

cd into _commonfiles and run 'node cbuild'. Copies of the generated packages will be under _output_debug. See the example log file in _commonfiles for the actual cmake commands that are run. To skip using doxygen see the cbuild,js variable 'argDoc'.

(If you want to see a basic library package build, just focus on egcore.)

Content

project egcore: the 'core' example library.
project egfn: a library that depends on egcore.
project egcoretester: command line app that depends on egcore.
project egfntester: a command line app that depends on egfn and egcore.
_commonfiles: build files; cmake find modules; files common to project.

Output folders
_output_debug (or release)
...\<platform>.<architecture>
.......\build (where CMAKE puts the build tree)
.......\install (where the runtime files are installed to for testing)


TODO:
1. Rework nodejs script file
2. A lot more comments on how this all works
3. Rework debian debug packages to be in line with common practice
4. Use gcc debug flag for runtime package
5. Packages currently install apps into \usr\bin\<package> - change to do things properly (e.g. install to usr/lib and put a symlink in bin).
6. Do a better job of supporting RPM 

Random Thoughts

A team member spent several months putting together a build system based on autotools that only ran on *nix, and took 5 mins to run, and looked like a train wreck. After looking more closely at autotools I figured this in no way reflected on the dev. So I spent 3 weeks putting a cmake build system together that ran an all above platforms, took about 30 seconds to run from scratch (on ubuntu anyway), and was maintainable. Given the project deadlines, I am very grateful I came across cmake.

on _commonfiles

Due to the requirements of a project I worked on, I have the libraries/apps as completely seperate projects, with their own build files, etc. However, this led to considerable duplication, so I consolidated common functionality into _commonfiles. The build script copies these into the individual projects.

I wrapped CMAKE with a build "harness" which simply repeatedly calls cmake with the required arguments. I do not directly invoke make,etc as cmake wraps these platform dependent calls nicely. I chose nodejs (javascript) as the "script harness" for this. The sample log file details the calls made, so they can be done "by hand" if desired. 

Why Javascript?
* I've done plenty of scripting on various platforms over the years, bash, csh, jscript, dos batch, perl, python, vbscript, jscript.
* nodejs package system is outstanding
* nodejs is cross-platform and very easy to install everywhere
* I've used, minimally, Javascript in the browser and want to learn it better and use it on the server
* http://www.youtube.com/watch?v=JxAXlJEmNMg&list=PL7664379246A246CB (Crockford on Javascript)

on CMAKE

CMAKE has 2 distinct steps: generation of the build tree; and building. It has a variable cache that can be used at build time to control the build process. Some of the variables are set at generation time, some can be set after (usually using the cmake gui). Things can break if these aren't used properly. In addition debug/release builds need to have seperate trees on *nix, but can be combined with Visual Studio. To properly cater to this CMAKE script files become more complicated and are more fragile. KISS.... I combine generation/build together and keep the release/debug build trees seperate ....KISS. On more substantial projects you'd definely want to optimise by using the cache feature and seperating generation/build.

The CMAKE multi component packaging system is designed for multi component (subpackage) installers such as NSIS (Windows), and PackageMaker (OS X). Debian and RPM are effectively single component/package with dependencies between packages (much, much cleaner). However, to generate multiple packages from a single set of cmake files, effectively requires the generation of cmake/cpack build files "on the fly".

On *nix, the debug packages should install debug versions of files under /usr/lib/debug/usr/lib and be dependent on the runtime. However, the debug packages built here are set to replace the runtime files and  the package is set to conflict. Quite useful as an exploratory exercise but probably not what you'd want in production. Also works well with Eclipse. Also note that that the debug flag is not being set for the runtime package (which is recommended practice).

The generated eclipse project file has the cplusplus flag set on despite the cmake files saying "C" (bug in cmake perhaps). The js script hacks the file to force the flag to be false.

I wanted to run the tester applications as part of the build, which meant "installing" the files, then running them. I did not want to interfere with any "package install", so the files are "installed" into the build output folder under "install". The second problem is running them because the runtime environment has to be configured to know where the binaries are: PATH on Windows, LD_LIBRARY_PATH on *nix, DYLD_LIBRARY_PATH on OS X. The helper script files "runtester.js" do this.

I'd like to throw in a 3rd party library dependency (preinstalled) to demostrate this, but the cross-platform implications (re: Windows) are too painful for this simple demo.

The build will generate debian packages on *nix. The scripts contain some processing which converts the debian dependency strings to RPM format. However to use RPM, you currently have to change the script content to explictly use RPM instead of DEB.

buildconfig.in.h is used to inject version related info into the source, so we only need to define version once per project - in CMakeLists-Local.cmake.

etc,etc

