require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name            = 'RTNLine'
  s.version         = package['version']
  s.summary         = package['description']
  s.description     = package["description"]
  s.homepage        = package['homepage']
  s.license         = package['license']
  s.platforms       = { :ios => "15.1" }
  s.authors         = package['author']
  s.source          = { :git => package["repository"]["url"] }

  s.source_files  = "ios/**/*.{h,m,swift}"

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.dependency 'LineSDKSwift', '~> 5.11.0'

  install_modules_dependencies(s)
end
