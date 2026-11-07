<?php

declare(strict_types=1);

namespace Canary;

use PHPUnit\Framework\TestCase;

final class GreeterTest extends TestCase
{
    public function testGreetsANamedPerson(): void
    {
        $greeter = new Greeter('Hello');
        $this->assertSame('Hello, CI!', $greeter->greet('CI'));
    }

    public function testFallsBackWhenNameIsBlank(): void
    {
        $greeter = new Greeter('Hello');
        $this->assertSame('Hello!', $greeter->greet('  '));
    }

    public function testRejectsBlankGreeting(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new Greeter(' ');
    }
}
