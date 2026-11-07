/* Integer helpers; the smallest honest C fixture for the CI canary. */
#include "canary_math.h"

int canary_add(int a, int b) {
    return a + b;
}

int canary_clamp(int value, int low, int high) {
    if (value < low) {
        return low;
    }
    if (value > high) {
        return high;
    }
    return value;
}
