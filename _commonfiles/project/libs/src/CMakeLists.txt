configure_file ("../version.in.h" "${PROJECT_BINARY_DIR}/version.h" @ONLY)
configure_file ("../version.in.rc" "${PROJECT_BINARY_DIR}/version.rc" @ONLY)
include_directories("${PROJECT_BINARY_DIR}")
include_directories("${PROJECT_SOURCE_DIR}/include")

##file(GLOB ${PROJECT_NAME}_SOURCES *.c)
aux_source_directory(. my_SOURCES)
if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	set(my_SOURCES ${my_SOURCES} "${PROJECT_BINARY_DIR}/version.rc")
endif()

add_library(${PROJECT_NAME} ${my_SOURCES})
target_link_libraries(${PROJECT_NAME} ${LIBS})

set_target_properties(${PROJECT_NAME} PROPERTIES 
	SOVERSION ${${PROJECT_NAME}_MAJOR_VERSION}
	VERSION ${${PROJECT_NAME}_MAJOR_VERSION}.${${PROJECT_NAME}_MINOR_VERSION}.${${PROJECT_NAME}_PATCH_VERSION}
)

if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	set_target_properties(${PROJECT_NAME} PROPERTIES OUTPUT_NAME "lib${PROJECT_NAME}")
endif()

if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	set(_MYLIB "lib")
	set(_MYRES "etc")
	set(_MYINC "include")
	set(_MYDOC "docs")
	set(_MYLIC ".")
else()
	set(_MYLIB "lib")
	set(_MYRES "etc/${PROJECT_NAME}")
	set(_MYINC "include")
	set(_MYDOC "share/doc/lib${PROJECT_NAME}")
	set(_MYLIC ${_MYDOC})
endif()

install(TARGETS ${PROJECT_NAME} DESTINATION ${_MYLIB} COMPONENT runtime)
install(DIRECTORY ../resources/ DESTINATION ${_MYRES} COMPONENT runtime)
install(FILES ../README.txt ../copyright.txt DESTINATION ${_MYLIC} COMPONENT runtime)
install(DIRECTORY ../include/ DESTINATION ${_MYINC} COMPONENT dev)
install(FILES "${PROJECT_BINARY_DIR}/version.h" DESTINATION ${_MYINC}/${PROJECT_NAME} COMPONENT runtime)
if (${EG_BUILDDOC})
	install(DIRECTORY "${PROJECT_BINARY_DIR}/docs/" DESTINATION ${_MYDOC} COMPONENT dev)
endif()

if (${EG_CMAKE_PLATFORM} STREQUAL "X_WIN32")
	add_custom_target(install-runtime
   COMMAND ${CMAKE_COMMAND} -DBUILD_TYPE=release -DCOMPONENT=runtime -P ${CMAKE_BINARY_DIR}/cmake_install.cmake
   COMMENT "Installing release runtime")
   
	add_custom_target(install-dev
   COMMAND ${CMAKE_COMMAND} -DBUILD_TYPE=release -DCOMPONENT=dev -P ${CMAKE_BINARY_DIR}/cmake_install.cmake
   COMMENT "Installing release dev")

	add_custom_target(installdbg-runtime
   COMMAND ${CMAKE_COMMAND} -DBUILD_TYPE=debug -DCOMPONENT=runtime -P ${CMAKE_BINARY_DIR}/cmake_install.cmake
   COMMENT "Installing debug runtime")
   
	add_custom_target(installdbg-dev
   COMMAND ${CMAKE_COMMAND} -DBUILD_TYPE=debug -DCOMPONENT=dev -P ${CMAKE_BINARY_DIR}/cmake_install.cmake
   COMMENT "Installing debug dev")
endif()
   


