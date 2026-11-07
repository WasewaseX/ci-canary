package com.example.canary;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class GreeterTest {

    @Test
    void greetsANamedPerson() {
        Greeter greeter = new Greeter("Hello");
        assertEquals("Hello, CI!", greeter.greet("CI"));
    }

    @Test
    void fallsBackWhenNameIsBlank() {
        Greeter greeter = new Greeter("Hello");
        assertEquals("Hello!", greeter.greet("  "));
    }

    @Test
    void rejectsBlankGreeting() {
        assertThrows(IllegalArgumentException.class, () -> new Greeter(" "));
    }
}
