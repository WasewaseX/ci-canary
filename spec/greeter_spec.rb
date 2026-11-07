# frozen_string_literal: true

require "rspec"
require_relative "../lib/canary/greeter"

RSpec.describe Canary::Greeter do
  subject(:greeter) { described_class.new("Hello") }

  it "greets a named person" do
    expect(greeter.greet("CI")).to eq("Hello, CI!")
  end

  it "falls back when the name is blank" do
    expect(greeter.greet("   ")).to eq("Hello!")
  end

  it "rejects a blank greeting" do
    expect { described_class.new(" ") }.to raise_error(ArgumentError)
  end
end
