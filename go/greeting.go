// Package greeting exercises the Go stack of the master-ci canary.
package greeting

import "fmt"

// Greet returns a greeting for name, falling back to the world.
func Greet(name string) string {
	if name == "" {
		name = "world"
	}
	return fmt.Sprintf("Hello, %s!", name)
}
