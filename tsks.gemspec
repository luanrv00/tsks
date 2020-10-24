require_relative 'lib/tsks/version'

Gem::Specification.new do |spec|
  spec.name          = "tsks"
  spec.version       = Tsks::VERSION
  spec.authors       = ["Luan F. R. Vicente"]
  spec.email         = ["luanrvmood@gmail.com"]
  spec.summary       = "A stateful command line interface to help you handle your daily tsks (with synchronisation and contexts!)"
  spec.homepage      = "https://github.com/luanrvmood/tsks"
  spec.required_ruby_version = Gem::Requirement.new(">= 2.3.0")
  spec.metadata["allowed_push_host"] = "https://rubygems.org"
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]
  spec.add_development_dependency "rspec"
  spec.add_development_dependency "dotenv"
  spec.add_dependency "thor"
  spec.add_dependency "sqlite3"
  spec.add_dependency "httparty"
  spec.add_dependency "uuid"
end
