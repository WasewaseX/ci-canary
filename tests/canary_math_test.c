#include "canary_math.h"

#include <stdlib.h>

static int failures = 0;

static void expect_int(int actual, int expected, const char *label) {
    if (actual != expected) {
        failures++;
        printf("FAIL %s: got %d, expected %d\n", label, actual, expected);
        return;
    }
    printf("ok %s\n", label);
}

int main(void) {
    expect_int(canary_add(2, 3), 5, "add");
    expect_int(canary_add(-1, 1), 0, "add inverse");
    expect_int(canary_clamp(7, 0, 5), 5, "clamp high");
    expect_int(canary_clamp(-2, 0, 5), 0, "clamp low");
    expect_int(canary_clamp(3, 0, 5), 3, "clamp inside");

    if (failures > 0) {
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
