# - Try to find egcore
# Once done, this will define
#
#  EGCORE_FOUND - system has found library
#  EGCORE_INCLUDE_DIRS - header file dir
#  EGCORE_LIBRARIES - lib libraries 
#  EGCORE_DOC_DIR - doc folder
#  EGCORE_LIB_DIR - location of 'lib'/'dll' (windows) or 'so' file (*nix)
#  EGCORE_VERSION_STRING - version string

include(EgFindModule)
eg_find_module(egcore)
