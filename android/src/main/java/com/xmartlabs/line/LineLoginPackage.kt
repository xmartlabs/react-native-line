package com.xmartlabs.line

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.TurboReactPackage
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class LineLoginPackage : TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
        when (name) {
            LineLoginModule.NAME -> LineLoginModule(reactContext)
            else -> null
        }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
        ReactModuleInfoProvider {
            mapOf(
                LineLoginModule.NAME to ReactModuleInfo(
                    LineLoginModule.NAME,
                    LineLoginModule.NAME,
                    canOverrideExistingModule = false,
                    needsEagerInit = false,
                    hasConstants = true,
                    isCxxModule = false,
                    isTurboModule = true
                )
            )
        }
}
