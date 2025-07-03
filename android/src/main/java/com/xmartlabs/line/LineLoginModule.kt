package com.xmartlabs.line

import android.app.Activity
import android.content.Context
import android.content.Intent

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

import com.linecorp.linesdk.*
import com.linecorp.linesdk.api.LineApiClient
import com.linecorp.linesdk.api.LineApiClientBuilder
import com.linecorp.linesdk.auth.LineAuthenticationConfig
import com.linecorp.linesdk.auth.LineAuthenticationParams
import com.linecorp.linesdk.auth.LineLoginApi
import com.linecorp.linesdk.auth.LineLoginResult
import com.linecorp.linesdk.LineProfile

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private var LOGIN_REQUEST_CODE: Int = 0

enum class LoginArguments(val key: String) {
    BOT_PROMPT("botPrompt"),
    ONLY_WEB_LOGIN("onlyWebLogin"),
    SCOPES("scopes")
}

class LineLoginModule(private val reactContext: ReactApplicationContext) :
    NativeLineLoginSpec(reactContext) {

    companion object {
        const val NAME = NativeLineLoginSpec.NAME
    }

    private val coroutineScope: CoroutineScope = CoroutineScope(Dispatchers.Main)

    private lateinit var channelId: String
    private lateinit var lineApiClient: LineApiClient
    private var loginResult: Promise? = null

    override fun setup(args: ReadableMap, promise: Promise) {
        channelId = args.getString("channelId")!!
        lineApiClient = LineApiClientBuilder(reactContext.applicationContext, channelId).build()
        reactContext.addActivityEventListener(object : ActivityEventListener {
            override fun onNewIntent(intent: Intent) {}
            override fun onActivityResult(
                activity: Activity,
                requestCode: Int,
                resultCode: Int,
                data: Intent?
            ) =
                handleActivityResult(requestCode, resultCode, data)
        })
    }

    override fun login(args: ReadableMap, promise: Promise) {
        val scopes =
            if (args.hasKey(LoginArguments.SCOPES.key)) args.getArray(LoginArguments.SCOPES.key)!!
                .toArrayList() as List<String> else listOf("profile")
        val onlyWebLogin =
            args.hasKey(LoginArguments.ONLY_WEB_LOGIN.key) && args.getBoolean(LoginArguments.ONLY_WEB_LOGIN.key)
        val botPromptString =
            if (args.hasKey(LoginArguments.BOT_PROMPT.key)) args.getString(LoginArguments.BOT_PROMPT.key)!! else "normal"
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
                    activity, channelId, lineAuthenticationParams
                )

                else -> LineLoginApi.getLoginIntent(activity, channelId, lineAuthenticationParams)
            }

        activity.startActivityForResult(loginIntent, LOGIN_REQUEST_CODE)
        this.loginResult = promise
    }

    override fun getProfile(promise: Promise) {
        coroutineScope.launch {
            val lineApiResponse = withContext(Dispatchers.IO) { lineApiClient.getProfile() }
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
                "ERROR",
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

    override fun logout(promise: Promise) {
        coroutineScope.launch {
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

    override fun getCurrentAccessToken(promise: Promise) = invokeLineServiceMethod(
        promise = promise,
        serviceCallable = { lineApiClient.getCurrentAccessToken() },
        parser = { parseAccessToken(it, lineIdToken = null) }
    )

    override fun getFriendshipStatus(promise: Promise) = invokeLineServiceMethod(
        promise = promise,
        serviceCallable = { lineApiClient.getFriendshipStatus() },
        parser = { parseFriendshipStatus(it) }
    )

    override fun refreshAccessToken(promise: Promise) = invokeLineServiceMethod(
        promise = promise,
        serviceCallable = { lineApiClient.refreshAccessToken() },
        parser = { parseAccessToken(it, lineIdToken = null) }
    )

    override fun verifyAccessToken(promise: Promise) = invokeLineServiceMethod(
        promise = promise,
        serviceCallable = { lineApiClient.verifyToken() },
        parser = { parseVerifyAccessToken(it) }
    )

    private fun <T> invokeLineServiceMethod(
        promise: Promise,
        serviceCallable: () -> LineApiResponse<T>,
        parser: (T) -> WritableMap
    ) {
        coroutineScope.launch {
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


    private fun parseAccessToken(
        accessToken: LineAccessToken,
        lineIdToken: LineIdToken?
    ): WritableMap = Arguments.makeNativeMap(
        mapOf(
            "accessToken" to accessToken.tokenString,
            "expiresIn" to accessToken.expiresInMillis,
            "idToken" to lineIdToken?.rawString
        )
    )

    private fun parseFriendshipStatus(friendshipStatus: LineFriendshipStatus): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "friendFlag" to friendshipStatus.isFriend
            )
        )

    private fun parseProfile(profile: LineProfile): WritableMap = Arguments.makeNativeMap(
        mapOf(
            "displayName" to profile.displayName,
            "pictureUrl" to profile.pictureUrl?.toString(),
            "statusMessage" to profile.statusMessage,
            "userId" to profile.userId
        )
    )

    private fun parseLoginResult(loginResult: LineLoginResult): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "accessToken" to parseAccessToken(
                    loginResult.lineCredential!!.accessToken,
                    loginResult.lineIdToken
                ),
                "friendshipStatusChanged" to loginResult.friendshipStatusChanged,
                "idTokenNonce" to loginResult.lineIdToken?.nonce,
                "scope" to loginResult.lineCredential?.scopes?.let {
                    Scope.join(it)
                },
                "userProfile" to parseProfile(loginResult.lineProfile!!)
            )
        )

    private fun parseVerifyAccessToken(verifyAccessToken: LineCredential): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "clientId" to channelId,
                "expiresIn" to verifyAccessToken.accessToken.expiresInMillis,
                "scope" to Scope.join(verifyAccessToken.scopes)
            )
        )


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

    private fun createLineAuthenticationConfig(
        channelId: String,
        onlyWebLogin: Boolean
    ): LineAuthenticationConfig? {
        return createConfig(
            channelId,
            onlyWebLogin
        )
    }
}
