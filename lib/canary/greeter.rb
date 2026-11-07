# frozen_string_literal: true

module Canary
  # Greets by name; the smallest honest Ruby fixture for the CI canary.
  class Greeter
    def initialize(greeting)
      raise ArgumentError, "greeting must not be blank" if greeting.nil? || greeting.strip.empty?

      @greeting = greeting
    end

    def greet(name)
      return "#{@greeting}!" if name.nil? || name.strip.empty?

      "#{@greeting}, #{name}!"
    end
  end
end
