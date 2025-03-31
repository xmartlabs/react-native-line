require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name            = 'react-native-line'
  s.version         = package['version']
  s.summary         = package['description']
  s.description     = package["description"]
  s.homepage        = package['homepage']
  s.license         = package['license']
  s.platforms       = { :ios => "15.1" }
  s.authors         = package['author']
  s.source          = { :git => package["repository"]["url"] }

  s.source_files  = "ios/**/*.{h,m,mm,swift}"

  s.dependency 'LineSDKSwift', '~> 5.12.0'

  install_modules_dependencies(s)
end
