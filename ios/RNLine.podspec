require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name          = 'RNLine'
  s.version       = package['version']
  s.summary       = package['description']
  s.license       = package['license']

  s.authors       = package['author']
  s.homepage      = package['homepage']
  s.platform      = :ios, "13.0"
  s.swift_version = '5.4'

  s.source        = { :git => "https://github.com/xmartlabs/react-native-line" }
  s.source_files  = "**/*.{h,m,swift}"

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  s.dependency 'React-Core'
  s.dependency 'LineSDKSwift', '~> 5.8.1'
end
