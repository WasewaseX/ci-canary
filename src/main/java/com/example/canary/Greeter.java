package com.example.canary;

/** Greets by name; the smallest honest Java fixture for the CI canary. */
public final class Greeter {

    private final String greeting;

    public Greeter(String greeting) {
        if (greeting == null || greeting.isBlank()) {
            throw new IllegalArgumentException("greeting must not be blank");
        }
        this.greeting = greeting;
    }

    public String greet(String name) {
        if (name == null || name.isBlank()) {
            return greeting + "!";
        }
        return greeting + ", " + name + "!";
    }
}
