package com.xmartlabs.rnline

import android.app.Activity
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.*

import com.linecorp.linesdk.api.LineApiClient
import com.linecorp.linesdk.api.LineApiClientBuilder
import com.linecorp.linesdk.auth.LineAuthenticationConfig
import com.linecorp.linesdk.auth.LineAuthenticationParams
import com.linecorp.linesdk.auth.LineLoginApi
import com.linecorp.linesdk.auth.LineLoginResult

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import com.facebook.react.bridge.WritableMap
import com.linecorp.linesdk.*
import com.linecorp.linesdk.LineProfile

enum class LoginArguments(val key: String) {
    SCOPES("scopes"),
    ONLY_WEB_LOGIN("onlyWebLogin"),
    BOT_PROMPT("botPrompt")
}

class RNLine(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val MODULE_NAME: String = "LineLogin"
        private const val ERROR_MESSAGE: String = "ERROR"
    }


    private val lineApiClient: LineApiClient
    private val channelId: String
    private var LOGIN_REQUEST_CODE: Int = 0
    private val uiCoroutineScope: CoroutineScope = CoroutineScope(Dispatchers.Main)

    private var loginResult: Promise? = null

    override fun getName() = MODULE_NAME

    init {
        val context: Context = reactContext.applicationContext
        channelId = context.getString(R.string.line_channel_id)
        lineApiClient = LineApiClientBuilder(context, channelId).build()
        reactContext.addActivityEventListener(object : ActivityEventListener {
            override fun onNewIntent(intent: Intent?) {}

            override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) =
                    handleActivityResult(requestCode, resultCode, data)
        })
    }

    @ReactMethod
    fun login(args: ReadableMap, promise: Promise) {
        val scopes = if (args.hasKey(LoginArguments.SCOPES.key)) args.getArray(LoginArguments.SCOPES.key)!!.toArrayList() as List<String> else listOf("profile")
        val onlyWebLogin = args.hasKey(LoginArguments.ONLY_WEB_LOGIN.key) && args.getBoolean(LoginArguments.ONLY_WEB_LOGIN.key)
        val botPromptString = if (args.hasKey(LoginArguments.BOT_PROMPT.key)) args.getString(LoginArguments.BOT_PROMPT.key)!! else "normal"
        login(
                scopes,
                onlyWebLogin,
                botPromptString,
                promise
        )
    }

    private fun login(
            scopes: List<String>,
            onlyWebLogin: Boolean,
            botPromptString: String,
            promise: Promise
    ) {

        val lineAuthenticationParams = LineAuthenticationParams.Builder()
                .scopes(Scope.convertToScopeList(scopes))
                .apply {
                    botPrompt(LineAuthenticationParams.BotPrompt.valueOf(botPromptString))
                }
                .build()

        val lineAuthenticationConfig: LineAuthenticationConfig? =
                createLineAuthenticationConfig(channelId, onlyWebLogin)

        val activity: Activity = currentActivity!!

        val loginIntent =
                when {
                    lineAuthenticationConfig != null -> LineLoginApi.getLoginIntent(
                            activity,
                            lineAuthenticationConfig,
                            lineAuthenticationParams
                    )
                    onlyWebLogin -> LineLoginApi.getLoginIntentWithoutLineAppAuth(
                            activity, channelId, lineAuthenticationParams)
                    else -> LineLoginApi.getLoginIntent(activity, channelId, lineAuthenticationParams)
                }

        activity.startActivityForResult(loginIntent, LOGIN_REQUEST_CODE)
        this.loginResult = promise
    }

    @ReactMethod
    fun getProfile(promise: Promise) {
        uiCoroutineScope.launch {
            val lineApiResponse = withContext(Dispatchers.IO) { lineApiClient.profile }
            if (!lineApiResponse.isSuccess) {
                promise.reject(
                        lineApiResponse.responseCode.name,
                        lineApiResponse.errorData.message,
                        null
                )
            } else {
                promise.resolve(parseProfile(lineApiResponse.responseData))
            }
        }
    }

    fun handleActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
        if (requestCode != LOGIN_REQUEST_CODE) return

        if (resultCode != Activity.RESULT_OK || intent == null) {
            loginResult?.reject(
                    resultCode.toString(),
                    ERROR_MESSAGE,
                    null
            )
        }

        val result = LineLoginApi.getLoginResultFromIntent(intent)

        when (result.responseCode) {
            LineApiResponseCode.SUCCESS -> {
                loginResult?.resolve(parseLoginResult(result))
                loginResult = null
            }
            LineApiResponseCode.CANCEL -> {
                loginResult?.reject(
                        result.responseCode.name,
                        result.errorData.message,
                        null
                )
            }
            else -> {
                loginResult?.reject(
                        result.responseCode.name,
                        result.errorData.message,
                        null
                )
            }
        }

        loginResult = null
    }

    @ReactMethod
    fun logout(promise: Promise) {
        uiCoroutineScope.launch {
            val lineApiResponse = withContext(Dispatchers.IO) { lineApiClient.logout() }
            if (lineApiResponse.isSuccess) {
                promise.resolve(null)
            } else {
                promise.reject(
                        lineApiResponse.responseCode.name,
                        lineApiResponse.errorData.message,
                        null
                )
            }
        }
    }

    @ReactMethod
    fun getCurrentAccessToken(promise: Promise) = invokeLineServiceMethod(
            promise = promise,
            serviceCallable = { lineApiClient.currentAccessToken },
            parser = { parseAccessToken(it, lineIdToken = null) }
    )

    @ReactMethod
    fun getBotFriendshipStatus(promise: Promise) = invokeLineServiceMethod(
            promise = promise,
            serviceCallable = { lineApiClient.friendshipStatus },
            parser = { parseFriendshipStatus(it) }
    )

    @ReactMethod
    fun refreshToken(promise: Promise) = invokeLineServiceMethod(
            promise = promise,
            serviceCallable = { lineApiClient.refreshAccessToken() },
            parser = { parseAccessToken(it, lineIdToken = null) }
    )

    @ReactMethod
    fun verifyAccessToken(promise: Promise) = invokeLineServiceMethod(
            promise = promise,
            serviceCallable = { lineApiClient.verifyToken() },
            parser = { parseVerifyAccessToken(it) }
    )

    private fun <T> invokeLineServiceMethod(
            promise: Promise,
            serviceCallable: () -> LineApiResponse<T>,
            parser: (T) -> WritableMap
    ) {
        uiCoroutineScope.launch {
            val lineApiResponse = withContext(Dispatchers.IO) { serviceCallable.invoke() }
            if (lineApiResponse.isSuccess) {
                promise.resolve(parser.invoke(lineApiResponse.responseData))
            } else {
                promise.reject(
                        lineApiResponse.responseCode.name,
                        lineApiResponse.errorData.message,
                        null
                )
            }
        }
    }

    // Parsers
    private fun parseAccessToken(accessToken: LineAccessToken, lineIdToken: LineIdToken?): WritableMap = Arguments.makeNativeMap(
            mapOf(
                    "access_token" to accessToken.tokenString,
                    "expires_in" to accessToken.expiresInMillis,
                    "id_token" to lineIdToken?.rawString
            )
    )

    private fun parseFriendshipStatus(friendshipStatus: LineFriendshipStatus): WritableMap = Arguments.makeNativeMap(
            mapOf(
                    "friendFlag" to friendshipStatus.isFriend
            )
    )

    private fun parseVerifyAccessToken( verifyAccessToken: LineCredential): WritableMap = Arguments.makeNativeMap(
            mapOf(
                    "client_id" to channelId,
                    "scope" to Scope.join(verifyAccessToken.scopes),
                    "expires_in" to verifyAccessToken.accessToken.expiresInMillis
            )
    )


    private fun parseProfile(profile: LineProfile): WritableMap = Arguments.makeNativeMap(
            mapOf(
                    "displayName" to profile.displayName,
                    "userID" to profile.userId,
                    "statusMessage" to profile.statusMessage,
                    "pictureURL" to profile.pictureUrl?.toString()
            )
    )

    private fun parseLoginResult(loginResult: LineLoginResult): WritableMap = Arguments.makeNativeMap(
            mapOf(
                    "userProfile" to parseProfile(loginResult.lineProfile!!),
                    "accessToken" to parseAccessToken(loginResult.lineCredential!!.accessToken, loginResult.lineIdToken),
                    "scope" to loginResult.lineCredential?.scopes?.let {
                        Scope.join(it)
                    },
                    "friendshipStatusChanged" to loginResult.friendshipStatusChanged,
                    "IDTokenNonce" to loginResult.lineIdToken?.nonce
            )
    )


    // Helpers
    private fun createLineAuthenticationConfig(
            channelId: String,
            onlyWebLogin: Boolean
    ): LineAuthenticationConfig? {
        return createConfig(
                channelId,
                onlyWebLogin
        )
    }

    private fun createConfig(
            channelId: String,
            isLineAppAuthDisabled: Boolean
    ): LineAuthenticationConfig {
        val configBuilder = LineAuthenticationConfig.Builder(channelId)

        if (isLineAppAuthDisabled) {
            configBuilder.disableLineAppAuthentication()
        }

        return configBuilder.build()
    }
}
