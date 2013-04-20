get_property(TARGET_LIBS TARGET ${PROJECT_NAME} PROPERTY LOCATION)

string(TOLOWER ${CPACK_GENERATOR} LOWERCASE_CPACK_GENERATOR)
set(BUILD_DIR ${PROJECT_BINARY_DIR}/packages/deb/runtime)
set(TARGET_TYPE "runtime")
configure_file(packages/package-deb.in.cmake ${BUILD_DIR}/CMakeLists.txt @ONLY)
add_custom_target(deb_${TARGET_TYPE} COMMAND ${CMAKE_COMMAND} . 
                                COMMAND ${CMAKE_CPACK_COMMAND} -G ${CPACK_GENERATOR}
                                COMMAND cp *.${LOWERCASE_CPACK_GENERATOR} ${PROJECT_BINARY_DIR} 
                                WORKING_DIRECTORY ${BUILD_DIR})
								
set(BUILD_DIR ${PROJECT_BINARY_DIR}/packages/deb/dev)
set(TARGET_TYPE "dev")
configure_file(packages/package-deb.in.cmake ${BUILD_DIR}/CMakeLists.txt @ONLY)
add_custom_target(deb_${TARGET_TYPE} COMMAND ${CMAKE_COMMAND} . 
                                COMMAND ${CMAKE_CPACK_COMMAND} -G ${CPACK_GENERATOR}
                                COMMAND cp *.${LOWERCASE_CPACK_GENERATOR} ${PROJECT_BINARY_DIR} 
                                WORKING_DIRECTORY ${BUILD_DIR})								
								

