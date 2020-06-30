require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'RNLine'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "10.0"

  s.source       = { :git => "" } # https://github.com/CocoaPods/cocoapods-packager/issues/216#issuecomment-525296029
  # s.source       = { :git => "https://github.com/xmartlabs/react-native-line.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,swift}"
  # s.preserve_paths = '**/*.{h,m}' # https://github.com/CocoaPods/cocoapods-packager/issues/216#issuecomment-525296029

  s.dependency 'React'
  s.dependency 'LineSDKSwift', '~> 5.0'
end
