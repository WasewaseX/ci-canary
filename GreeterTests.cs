using Canary;

using Xunit;

public class GreeterTests
{
    [Fact]
    public void GreetsANamedPerson()
    {
        Assert.Equal("Hello, CI!", Greeter.Greet("Hello", "CI"));
    }

    [Fact]
    public void FallsBackWhenNameIsBlank()
    {
        Assert.Equal("Hello!", Greeter.Greet("Hello", "  "));
    }
}
