project(egcoretester C)

set(PROJECT_BRIEF "EGCORETESTER ANSI C sample program to test egcore library.")

set(${PROJECT_NAME}_MAJOR_VERSION 1)
set(${PROJECT_NAME}_MINOR_VERSION 1)
set(${PROJECT_NAME}_PATCH_VERSION 1)
set(${PROJECT_NAME}_TWEAK_VERSION )

include(EgLoadPackageDetails)
eg_load_package_details(egcore)

set(PROJECT_PACKAGE_DEPENDENCIES_DEBIAN "lib${EGCORE_NAME}${EG_PACKAGE_DEBUG} (>= ${EGCORE_VERSION_STRING})")
