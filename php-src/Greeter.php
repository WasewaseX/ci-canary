<?php

declare(strict_types=1);

namespace Canary;

/**
 * Greets by name; the smallest honest PHP fixture for the CI canary.
 */
final class Greeter
{
    public function __construct(private readonly string $greeting)
    {
        if (trim($greeting) === '') {
            throw new \InvalidArgumentException('greeting must not be blank');
        }
    }

    public function greet(?string $name): string
    {
        if ($name === null || trim($name) === '') {
            return $this->greeting . '!';
        }

        return $this->greeting . ', ' . $name . '!';
    }
}
