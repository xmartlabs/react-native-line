let lineImplementation = "implementation 'com.linecorp.linesdk:linesdk:5.8.0'"

let compileOptions = `compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }`

module.exports = { compileOptions, lineImplementation }
