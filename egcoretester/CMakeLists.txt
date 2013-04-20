cmake_minimum_required(VERSION 2.8.8)
set(CMAKE_VERBOSE_MAKEFILE ON)

set(EG_CMAKE_MODULES "$ENV{EG_CMAKE_MODULES}")
if ("${EG_CMAKE_MODULES}" STREQUAL "")
	set(EG_CMAKE_MODULES "${CMAKE_SOURCE_DIR}/../_commonfiles/cmakemodules/") 
endif()
if(NOT EXISTS "${EG_CMAKE_MODULES}/")
	message(FATAL_ERROR "EG_CMAKE_MODULES environment variable not set or cannot find ${EG_CMAKE_MODULES}")
endif()
#CMAKE doesn't like \ in the string, so on Windows convert any
STRING(REPLACE \\ / EG_CMAKE_MODULES "${EG_CMAKE_MODULES}")
message(STATUS "EG_CMAKE_MODULES=${EG_CMAKE_MODULES}")

#Prepends the cmake/modules path inside the MAKE_MODULE_PATH variable which stores the
#directories of additional CMake modules (eg MacroOutOfSourceBuild.cmake):
set(CMAKE_MODULE_PATH ${EG_CMAKE_MODULES} ${CMAKE_MODULE_PATH})
#The macro below forces the build directory to be different from source directory
include(MacroOutOfSourceBuild)
macro_ensure_out_of_source_build("${PROJECT_NAME} requires an out of source build.")

# Let's flatten all the CMAKE platform variables into our own non-overlapping set.
if (CYGWIN)
	set(EG_CMAKE_PLATFORM "X_CYGWIN") # we don't support cygwin yet
elseif (WIN32)
	set(EG_CMAKE_PLATFORM "X_WIN32")
elseif (APPLE)
	set(EG_CMAKE_PLATFORM "X_APPLE")
elseif (${CMAKE_SYSTEM_NAME} MATCHES "FreeBSD")
	set(EG_CMAKE_PLATFORM "X_FREEBSD")
elseif (${CMAKE_SYSTEM_NAME} MATCHES "Linux")
	set(EG_CMAKE_PLATFORM "X_LINUX")
elseif (UNIX)
	set(EG_CMAKE_PLATFORM "X_NIX")
else()
	set(EG_CMAKE_PLATFORM "") # good luck
endif()

message(STATUS)
message(STATUS "******* ${CMAKE_SYSTEM_NAME}.${CMAKE_SYSTEM_PROCESSOR} (${EG_CMAKE_PLATFORM}) *******")
message(STATUS)

if ("${CMAKE_BUILD_TYPE}" STREQUAL "")
	set(PROJECT_BUILD_DEBUG 0)
elseif ("${CMAKE_BUILD_TYPE}" STREQUAL "debug")
	set(PROJECT_BUILD_DEBUG 1)
else()
	set(PROJECT_BUILD_DEBUG 0)
endif()

set(EG_PACKAGE_DEBUG_CONST "-dbg")
set(EG_PACKAGE_DEBUG "")
if (PROJECT_BUILD_DEBUG)
	set(EG_PACKAGE_DEBUG ${EG_PACKAGE_DEBUG_CONST})
endif()

set(BUILD_SHARED_LIBS TRUE)

include(CMakeLists-Local.cmake)

include(EgTimestamp)
NOW(PROJECT_TIMESTAMP)

string(TOUPPER ${PROJECT_NAME} PROJECT_NAME_UPPER)
set(PROJECT_COPYRIGHT "2012 Eg of examples.com, <eg@example.com>.")
set(PROJECT_MAJOR_VERSION ${${PROJECT_NAME}_MAJOR_VERSION})
set(PROJECT_MINOR_VERSION ${${PROJECT_NAME}_MINOR_VERSION})
set(PROJECT_PATCH_VERSION ${${PROJECT_NAME}_PATCH_VERSION})
set(PROJECT_TWEAK_VERSION ${${PROJECT_NAME}_TWEAK_VERSION})
set(${PROJECT_NAME}_VERSION "${PROJECT_MAJOR_VERSION}.${PROJECT_MINOR_VERSION}.${PROJECT_PATCH_VERSION}")
if (NOT ${PROJECT_TWEAK_VERSION} STREQUAL "")
	set(${PROJECT_NAME}_VERSION "${${PROJECT_NAME}_VERSION}.${PROJECT_TWEAK_VERSION}")
endif()
set(PROJECT_VERSION ${${PROJECT_NAME}_VERSION})

if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	add_definitions(-D_CRT_SECURE_NO_WARNINGS -W4 -MD -WX)
else()
	set(CMAKE_C_FLAGS_DEBUG "${CMAKE_C_FLAGS_DEBUG} -g3 -fstack-protector-all")
	add_definitions(-ansi -std=c99 -pedantic-errors -Werror -Wmissing-prototypes -Wstrict-prototypes -Wall -Wextra -Wshadow -Wcast-qual -Wwrite-strings -Wformat=2 -Wstrict-overflow=5)
	add_definitions(-Waggregate-return -Wbad-function-cast -Wcast-align -Wmissing-declarations -Wnested-externs -Wredundant-decls -Winline -Wno-error=long-long)
	#add_definitions(-Wconversion) # this causes problems on older versions of gcc
	# required for freebsd - probably related to old versions of gcc
	add_definitions(-D_ISO_C_VISIBLE=1999 -D_POSIX_C_SOURCE=200112)
	
	# Supress some warnings if you must
	#add_definitions(-Wno-error=format -Wno-error=unused-but-set-variable -Wno-error=unused-value)
endif()

if (${EG_BUILDDOC})

	set(DOXY_TYPE_HTM "htm")
	set(DOXY_TYPE_CHM "chm")
	set(DOXY_TYPE_PDF "pdf")
	set(DOXY_TYPE "htm")
	#set(DOXY_TYPE "chm")
	#set(DOXY_TYPE "pdf")

	if (${DOXY_TYPE} STREQUAL ${DOXY_TYPE_PDF})
		set(DOXY_GENERATE_HTML "NO")
		set(DOXY_GENERATE_HTMLHELP "NO")
		set(DOXY_GENERATE_CHI "NO")
		set(DOXY_GENERATE_LATEX "YES")
		set(DOXY_GENERATE_TREEVIEW "YES")
		set(DOXY_HTML_OUTPUT "html")
	elseif (${DOXY_TYPE} STREQUAL ${DOXY_TYPE_CHM})
		set(DOXY_GENERATE_HTML "YES")
		set(DOXY_GENERATE_HTMLHELP "YES")
		set(DOXY_GENERATE_CHI "YES")
		set(DOXY_GENERATE_LATEX "NO")
		set(DOXY_GENERATE_TREEVIEW "NO")
		set(DOXY_HTML_OUTPUT "html-chm")
	else()
		set(DOXY_GENERATE_HTML "YES")
		set(DOXY_GENERATE_HTMLHELP "NO")
		set(DOXY_GENERATE_CHI "NO")
		set(DOXY_GENERATE_LATEX "NO")
		set(DOXY_GENERATE_TREEVIEW "YES")
		set(DOXY_HTML_OUTPUT "html")
	endif()

	if (EXISTS ${PROJECT_SOURCE_DIR}/Doxyfile.in)
		find_package(Doxygen)
		find_package(HTMLHelp)
		if (DOXYGEN_FOUND)
			configure_file(${PROJECT_SOURCE_DIR}/Doxyfile.in ${PROJECT_BINARY_DIR}/Doxyfile @ONLY)
			add_custom_target(doc ${DOXYGEN_EXECUTABLE} ${PROJECT_BINARY_DIR}/Doxyfile COMMENT "Generating API documentation with Doxygen" VERBATIM)
			#Creating a dependency to inbuilt targets doesn't work yet - http://public.kitware.com/Bug/view.php?id=8438
			#add_dependencies(doc install)
		endif()
	endif()
	if (NOT DOXYGEN_FOUND)
		add_custom_target(doc)
	endif()
endif()

if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	set(EG_CPACK_GENERATOR "NSIS")
	set(EG_CPACK_SOURCE_GENERATOR "ZIP")
elseif (${EG_CMAKE_PLATFORM} STREQUAL "X_APPLE")
	set(EG_CPACK_GENERATOR "PackageMaker")
	set(EG_CPACK_SOURCE_GENERATOR "TZ")
elseif (${EG_CMAKE_PLATFORM} STREQUAL "X_FREEBSD")
	set(EG_CPACK_GENERATOR "DEB")
	set(EG_CPACK_SOURCE_GENERATOR "TZ")
elseif (${EG_CMAKE_PLATFORM} STREQUAL "X_LINUX")
	set(EG_CPACK_GENERATOR "DEB")
	set(EG_CPACK_SOURCE_GENERATOR "TZ")
elseif (${EG_CMAKE_PLATFORM} STREQUAL "X_NIX")
	set(EG_CPACK_GENERATOR "DEB")
	set(EG_CPACK_SOURCE_GENERATOR "TZ")
else()
	# Leave it up to cpack to decide based on the platform.
endif()

add_subdirectory(src)
include(CMakeCPack.cmake)

message(STATUS "-------------------------------------------------------------------------------")
message(STATUS "Version = ${PROJECT_VERSION}")
message(STATUS "Project Source dir = ${PROJECT_SOURCE_DIR}")
message(STATUS "Project Binary dir = ${PROJECT_BINARY_DIR}")
message(STATUS "-------------------------------------------------------------------------------")
message(STATUS)


