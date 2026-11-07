cmake_minimum_required(VERSION 3.16)
project(canary_cpp C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)

add_library(canary_math src/canary_math.c)
target_include_directories(canary_math PUBLIC src)

add_executable(canary_app src/main.c)
target_link_libraries(canary_app PRIVATE canary_math)

enable_testing()
add_executable(canary_math_test tests/canary_math_test.c)
target_link_libraries(canary_math_test PRIVATE canary_math)
add_test(NAME canary_math COMMAND canary_math_test)
