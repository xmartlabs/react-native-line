package com.xmartlabs.line

import android.app.Activity
import android.content.Intent
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicReference

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

import com.linecorp.linesdk.*
import com.linecorp.linesdk.api.LineApiClient
import com.linecorp.linesdk.api.LineApiClientBuilder
import com.linecorp.linesdk.auth.LineAuthenticationConfig
import com.linecorp.linesdk.auth.LineAuthenticationParams
import com.linecorp.linesdk.auth.LineLoginApi
import com.linecorp.linesdk.auth.LineLoginResult

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

@ReactModule(name = LineLoginModule.NAME)
class LineLoginModule(reactContext: ReactApplicationContext) :
    NativeLineLoginSpec(reactContext) {

    companion object {
        const val BOT_PROMPT = "botPrompt"
        const val CHANNEL_ID = "channelId"
        const val ONLY_WEB_LOGIN = "onlyWebLogin"
        const val SCOPES = "scopes"

        const val NAME = NativeLineLoginSpec.NAME
        private const val LOGIN_REQUEST_CODE = 1423
        private val DEFAULT_SCOPES = listOf("profile")
    }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val pendingLogin = AtomicReference<Promise?>(null)

    @Volatile private var channelId: String? = null
    @Volatile private var lineApiClient: LineApiClient? = null

    private val activityListenerRegistered = AtomicBoolean(false)

    override fun invalidate() {
        scope.cancel()
        pendingLogin.getAndSet(null)
            ?.reject("MODULE_INVALIDATED", "Module was destroyed during login", null)
        if (activityListenerRegistered.getAndSet(false)) {
            reactApplicationContext.removeActivityEventListener(loginResultListener)
        }
        super.invalidate()
    }

    override fun setup(args: ReadableMap, promise: Promise) {
        val id = args.getString(CHANNEL_ID)?.takeIf { it.isNotBlank() }
            ?: return promise.reject("SETUP_FAILED", "channelId must be a non-empty string", null)

        channelId = id

        lineApiClient = LineApiClientBuilder(reactApplicationContext, id).build()

        if (activityListenerRegistered.compareAndSet(false, true)) {
            reactApplicationContext.addActivityEventListener(loginResultListener)
        }
        promise.resolve(null)
    }

    override fun login(args: ReadableMap, promise: Promise) {
        requireClient(promise) ?: return

        val id = channelId ?: return promise.reject("NOT_SETUP", "Call setup() first", null)

        val scopes = args.getArray(SCOPES)
            ?.toArrayList()?.filterIsInstance<String>()?.takeIf { it.isNotEmpty() }
            ?: DEFAULT_SCOPES

        val onlyWebLogin = args.hasKey(ONLY_WEB_LOGIN) && args.getBoolean(ONLY_WEB_LOGIN)

        val botPromptRaw = args.getString(BOT_PROMPT) ?: "normal"
        val botPrompt = LineAuthenticationParams.BotPrompt.entries
            .find { it.name.equals(botPromptRaw, ignoreCase = true) }
            ?: return promise.reject(
                "INVALID_ARGUMENT",
                "Invalid botPrompt '$botPromptRaw'. Expected: ${
                    LineAuthenticationParams.BotPrompt.entries.joinToString { it.name.lowercase() }
                }",
                null,
            )

        val activity = currentActivity
            ?: return promise.reject("NO_ACTIVITY", "Activity is not available", null)

        if (!pendingLogin.compareAndSet(null, promise)) {
            return promise.reject("LOGIN_IN_PROGRESS", "A login is already in progress", null)
        }

        val authParams = LineAuthenticationParams.Builder()
            .scopes(Scope.convertToScopeList(scopes))
            .botPrompt(botPrompt)
            .build()

        val config = if (onlyWebLogin) {
            LineAuthenticationConfig.Builder(id).disableLineAppAuthentication().build()
        } else null

        val intent = if (config != null) {
            LineLoginApi.getLoginIntent(activity, config, authParams)
        } else {
            LineLoginApi.getLoginIntent(activity, id, authParams)
        }

        activity.startActivityForResult(intent, LOGIN_REQUEST_CODE)
    }

    private val loginResultListener = object : ActivityEventListener {
        override fun onNewIntent(intent: Intent) = Unit

        override fun onActivityResult(
            activity: Activity,
            requestCode: Int,
            resultCode: Int,
            data: Intent?
        ) {
            if (requestCode != LOGIN_REQUEST_CODE) return
            val promise = pendingLogin.getAndSet(null) ?: return

            if (resultCode != Activity.RESULT_OK || data == null) {
                val (code, message) = if (resultCode == Activity.RESULT_CANCELED) {
                    "LOGIN_CANCELLED" to "Login was cancelled by the user"
                } else {
                    "LOGIN_FAILED" to "Login failed with unexpected result code $resultCode"
                }
                return promise.reject(code, message, null)
            }

            val result = LineLoginApi.getLoginResultFromIntent(data)
            if (result.responseCode == LineApiResponseCode.SUCCESS) {
                val cred = result.lineCredential
                val prof = result.lineProfile
                if (cred != null && prof != null) {
                    promise.resolve(buildLoginResult(result, cred, prof))
                } else {
                    promise.reject(
                        "PARSE_ERROR",
                        "Credential or profile missing from login result",
                        null
                    )
                }
            } else {
                promise.reject(
                    result.responseCode.name,
                    result.errorData.message ?: result.responseCode.name,
                    null
                )
            }
        }
    }

    override fun logout(promise: Promise) {
        val client = requireClient(promise) ?: return
        scope.launch {
            try {
                val r = client.logout()
                if (r.isSuccess) promise.resolve(null)
                else promise.reject(
                    r.responseCode.name,
                    r.errorData.message ?: r.responseCode.name,
                    null
                )
            } catch (e: Exception) {
                promise.reject("API_ERROR", e.message ?: "Unexpected error during logout", e)
            }
        }
    }

    override fun getProfile(promise: Promise) = apiCall(
        promise,
        call = LineApiClient::getProfile,
        build = ::buildProfile,
    )

    override fun getCurrentAccessToken(promise: Promise) = apiCall(
        promise,
        call = LineApiClient::getCurrentAccessToken,
        build = { buildAccessToken(it, idToken = null) },
    )

    override fun getFriendshipStatus(promise: Promise) = apiCall(
        promise,
        call = LineApiClient::getFriendshipStatus,
        build = ::buildFriendshipStatus,
    )

    override fun refreshAccessToken(promise: Promise) = apiCall(
        promise,
        call = LineApiClient::refreshAccessToken,
        build = { buildAccessToken(it, idToken = null) },
    )

    override fun verifyAccessToken(promise: Promise) = apiCall(
        promise,
        call = LineApiClient::verifyToken,
        build = ::buildVerifyResult,
    )

    /**
     * Returns the initialized [LineApiClient] or rejects [promise] with NOT_SETUP
     * and returns null, allowing callers to use the `?: return` pattern.
     */
    private fun requireClient(promise: Promise): LineApiClient? =
        lineApiClient ?: run {
            promise.reject("NOT_SETUP", "Call setup() before using the LINE SDK", null)
            null
        }

    /**
     * Runs a blocking LINE API [call] on the IO dispatcher.
     * Resolves [promise] via [build] on success, or rejects it with the LINE error.
     */
    private fun <T> apiCall(
        promise: Promise,
        call: (LineApiClient) -> LineApiResponse<T>,
        build: (T) -> WritableMap,
    ) {
        val client = requireClient(promise) ?: return
        scope.launch {
            try {
                val r = call(client)
                if (r.isSuccess) promise.resolve(build(r.responseData))
                else promise.reject(
                    r.responseCode.name,
                    r.errorData.message ?: r.responseCode.name,
                    null
                )
            } catch (e: Exception) {
                promise.reject("API_ERROR", e.message ?: "Unexpected error", e)
            }
        }
    }

    /**
     * [expiresIn] is seconds-until-expiry (OAuth standard `expires_in`),
     * derived from the SDK's millisecond value.
     */
    private fun buildAccessToken(token: LineAccessToken, idToken: LineIdToken?): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "accessToken" to token.tokenString,
                "expiresIn"   to token.expiresInMillis / 1000L,
                "idToken"     to idToken?.rawString,
            )
        )

    private fun buildProfile(profile: LineProfile): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "displayName"   to profile.displayName,
                "pictureUrl"    to profile.pictureUrl?.toString(),
                "statusMessage" to profile.statusMessage,
                "userId"        to profile.userId,
            )
        )

    private fun buildFriendshipStatus(status: LineFriendshipStatus): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "friendFlag" to status.isFriend
            )
        )

    private fun buildLoginResult(result: LineLoginResult, credential: LineCredential, profile: LineProfile): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "accessToken"             to buildAccessToken(credential.accessToken, result.lineIdToken),
                "friendshipStatusChanged" to result.friendshipStatusChanged,
                "idTokenNonce"            to result.lineIdToken?.let { result.nonce },
                "scope"                   to Scope.join(credential.scopes),
                "userProfile"             to buildProfile(profile),
            )
        )

    private fun buildVerifyResult(credential: LineCredential): WritableMap =
        Arguments.makeNativeMap(
            mapOf(
                "clientId"  to channelId,
                "expiresIn" to credential.accessToken.expiresInMillis / 1000L,
                "scope"     to Scope.join(credential.scopes),
            )
        )
}
