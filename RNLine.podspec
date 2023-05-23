require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'RNLine'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "11.0"
  s.swift_version = '5.0'

  s.source       = { :git => "" }
  s.source_files  = "ios/**/*.{h,m,swift}"

  s.dependency 'React-Core'
  s.dependency 'LineSDKSwift', '~> 5.8.1'
end
