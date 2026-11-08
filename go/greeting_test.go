package greeting

import "testing"

func TestGreet(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name string
		in   string
		want string
	}{
		{name: "named caller", in: "canary", want: "Hello, canary!"},
		{name: "empty falls back to world", in: "", want: "Hello, world!"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			if got := Greet(tt.in); got != tt.want {
				t.Fatalf("Greet(%q) = %q, want %q", tt.in, got, tt.want)
			}
		})
	}
}
