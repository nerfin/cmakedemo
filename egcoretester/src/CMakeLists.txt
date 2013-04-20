configure_file("buildconfig.in.h" "${PROJECT_BINARY_DIR}/buildconfig.h")
configure_file("../version.in.rc" "${PROJECT_BINARY_DIR}/version.rc" @ONLY)
include_directories("${PROJECT_BINARY_DIR}")

aux_source_directory(. my_SOURCES)
if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	set(my_SOURCES ${my_SOURCES} "${PROJECT_BINARY_DIR}/version.rc")
endif()

add_executable(${PROJECT_NAME} ${my_SOURCES})
target_link_libraries(${PROJECT_NAME} ${LIBS})
set_target_properties(${PROJECT_NAME} PROPERTIES OUTPUT_NAME "${PROJECT_NAME}m")

if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	set(_MYBIN "bin")
	set(_MYLIC ".")
else()
	set(_MYBIN "bin/${PROJECT_NAME}")
	set(_MYLIC "share/doc/${PROJECT_NAME}")
endif()

install(TARGETS ${PROJECT_NAME} DESTINATION ${_MYBIN})
install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/../resources/ DESTINATION ${_MYBIN})
install(FILES ../README.txt ../copyright.txt DESTINATION ${_MYLIC})

if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	configure_file("../windows/project.vcproj.user.in" "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.vcproj.user")
endif()

