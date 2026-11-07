namespace Canary;

/// <summary>
/// Greets by name; the smallest honest C# fixture for the CI canary.
/// </summary>
public static class Greeter
{
    public static string Greet(string greeting, string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(greeting);
        return string.IsNullOrWhiteSpace(name)
            ? $"{greeting}!"
            : $"{greeting}, {name}!";
    }
}
