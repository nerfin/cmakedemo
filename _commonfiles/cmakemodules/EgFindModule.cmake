## Generic macro to find EG modules
macro(EG_FIND_MODULE module)
set(my_NAME ${module})

string(TOUPPER ${my_NAME} my_VAR_NAME)

set(${my_VAR_NAME}_NAME ${my_NAME})
find_path(${my_VAR_NAME}_INCLUDE_DIR ${my_NAME}/version.h PATH_SUFFIXES ${my_NAME}/include)
find_library(${my_VAR_NAME}_LIBRARY NAMES ${my_NAME} lib${my_NAME} PATH_SUFFIXES ${my_NAME}/lib)
find_path(${my_VAR_NAME}_DOC_DIR ${my_NAME}.tag PATH_SUFFIXES share/doc/lib${my_NAME} ${my_NAME}/docs)
#we only need this for windows at the moment, so if it's problematic on other platforms, then make it specific to windows
find_path(${my_VAR_NAME}_LIB_DIR ${my_NAME}.lib lib${my_NAME}.lib lib${my_NAME}.dylib lib${my_NAME}.so PATH_SUFFIXES lib ${my_NAME}/lib)

if (${my_VAR_NAME}_INCLUDE_DIR AND EXISTS "${${my_VAR_NAME}_INCLUDE_DIR}/${my_NAME}/version.h")
	file(
		STRINGS "${${my_VAR_NAME}_INCLUDE_DIR}/${my_NAME}/version.h" my_version_str
		REGEX "^#define[\t ]+${my_VAR_NAME}_VERSION[\t ]+\".*\""
	)
	string(REGEX REPLACE "^#define[\t ]+${my_VAR_NAME}_VERSION[\t ]+\"([^\"]*)\".*" "\\1"
		${my_VAR_NAME}_VERSION_STRING "${my_version_str}"
	)
	unset(my_version_str)
endif()

# Handle the QUIETLY and REQUIRED arguments and set ${my_VAR_NAME}_FOUND to TRUE if all listed variables are TRUE.
# Treat ${my_VAR_NAME}_DOC_DIR as optional
include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(
	${my_VAR_NAME}
	REQUIRED_VARS ${my_VAR_NAME}_LIBRARY ${my_VAR_NAME}_INCLUDE_DIR ${my_VAR_NAME}_LIB_DIR 
	VERSION_VAR ${my_VAR_NAME}_VERSION_STRING
)

#if (${my_VAR_NAME}_FOUND)
	set(${my_VAR_NAME}_INCLUDE_DIRS ${${my_VAR_NAME}_INCLUDE_DIR} )
	set(${my_VAR_NAME}_LIBRARIES ${${my_VAR_NAME}_LIBRARY} )
#endif()

mark_as_advanced(${my_VAR_NAME}_INCLUDE_DIRS ${my_VAR_NAME}_LIBRARIES ${my_VAR_NAME}_DOC_DIR ${my_VAR_NAME}_LIB_DIR ${my_VAR_NAME}_VERSION_STRING)

set(mymsg "${my_VAR_NAME}_FOUND = ${${my_VAR_NAME}_FOUND} (${${my_VAR_NAME}_VERSION_STRING})")
if (${my_VAR_NAME}_FOUND)
		message(STATUS ${mymsg})
else()
	set(mymsg "${mymsg} (LIB=${${my_VAR_NAME}_LIBRARIES}) (INC=${${my_VAR_NAME}_INCLUDE_DIRS}) (DOC=${${my_VAR_NAME}_DOC_DIR})")
	if (${my_NAME}_FIND_REQUIRED)
		message(STATUS ${mymsg})
		message(FATAL_ERROR "Required library ${my_NAME} NOT FOUND.")
	elseif (NOT ${my_NAME}_FIND_QUIETLY)
		message(STATUS ${mymsg})
	endif()
endif()

unset(mymsg)
unset(${my_VAR_NAME}_INCLUDE_DIR)
unset(${my_VAR_NAME}_LIBRARY)
unset(my_VAR_NAME)
unset(my_NAME)

endmacro(EG_FIND_MODULE)
