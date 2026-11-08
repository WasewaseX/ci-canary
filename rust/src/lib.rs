//! Canary for the Rust stack of the master-ci template.

/// Greets `name`, falling back to the world.
pub fn greet(name: &str) -> String {
    let name = if name.is_empty() { "world" } else { name };
    format!("Hello, {name}!")
}

#[cfg(test)]
mod tests {
    use super::greet;

    #[test]
    fn greets_a_named_caller() {
        assert_eq!(greet("canary"), "Hello, canary!");
    }

    #[test]
    fn falls_back_to_world() {
        assert_eq!(greet(""), "Hello, world!");
    }
}
