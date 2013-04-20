project(egfntester C)

set(PROJECT_BRIEF "EGFNTESTER ANSI C sample program to test egfn library.")

set(${PROJECT_NAME}_MAJOR_VERSION 1)
set(${PROJECT_NAME}_MINOR_VERSION 1)
set(${PROJECT_NAME}_PATCH_VERSION 1)
set(${PROJECT_NAME}_TWEAK_VERSION )

include(EgLoadPackageDetails)
eg_load_package_details(egcore)
eg_load_package_details(egfn)

set(PROJECT_PACKAGE_DEPENDENCIES_DEBIAN "lib${EGFN_NAME}${EG_PACKAGE_DEBUG} (>= ${EGFN_VERSION_STRING})")
