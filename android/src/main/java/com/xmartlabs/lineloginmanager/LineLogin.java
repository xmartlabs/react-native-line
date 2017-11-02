package com.xmartlabs.lineloginmanager;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.linecorp.linesdk.LineCredential;
import com.linecorp.linesdk.LineProfile;
import com.linecorp.linesdk.auth.LineLoginApi;
import com.linecorp.linesdk.auth.LineLoginResult;

public class LineLogin extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "LineLoginManager";
    private static final String ERROR = "ERROR";
    private static final String CHANNEL_ID = "1544017747";
    private static final int REQUEST_CODE = 1;

    private Promise loginPromise;
    private LineLoginResult loginResult;
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);
            if (requestCode != REQUEST_CODE) {
                loginPromise.reject(ERROR, "Unsupported request");
                return;
            }
            if (loginPromise != null) {
                loginResult = LineLoginApi.getLoginResultFromIntent(data);
                switch (loginResult.getResponseCode()) {
                    case SUCCESS:
                        loginPromise.resolve(parseLoginResult(loginResult));
                        break;
                    case CANCEL:
                        loginResult = null;
                        loginPromise.reject(ERROR, "Line login canceled by user");
                        break;
                    default:
                        loginResult = null;
                        loginPromise.reject(ERROR, loginResult.getErrorData().toString());
                        break;
                }
            }
        }
    };

    public LineLogin(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void login(final Promise promise) {
        try {
            loginPromise = promise;
            Intent intent = LineLoginApi.getLoginIntent(getCurrentActivity().getApplicationContext(), CHANNEL_ID);
            getCurrentActivity().startActivityForResult(intent, REQUEST_CODE);
        } catch (Exception e) {
            promise.reject(ERROR, e.toString());
        }
    }

    @ReactMethod
    public void loginWithPermissions(final Promise promise) {
        login(promise);
    }

    @ReactMethod
    public void currentAccessToken(final Promise promise) {
        if (loginResult != null) {
            promise.resolve(parseAccessToken(loginResult.getLineCredential()));
        } else {
            promise.reject(ERROR, "No user logged in");
        }
    }

    @ReactMethod
    public void getUserProfile(final Promise promise) {
        if (loginResult != null) {
            LineProfile profile = loginResult.getLineProfile();
            promise.resolve(parseProfile(profile));
        } else {
            promise.reject(ERROR, "No user logged in");
        }
    }

    @ReactMethod
    public void logout(final Promise promise) {
        loginResult = null;
        promise.resolve(new Object());
    }

    private WritableMap parseLoginResult(LineLoginResult loginResult) {
        WritableMap result = Arguments.createMap();
        result.putMap("profile", parseProfile(loginResult.getLineProfile()));
        result.putMap("accessToken", parseAccessToken(loginResult.getLineCredential()));
        return result;
    }

    private WritableMap parseProfile(LineProfile profile) {
        WritableMap result = Arguments.createMap();
        result.putString("displayName", profile.getDisplayName());
        result.putString("userID", profile.getUserId());
        result.putString("statusMessage", profile.getStatusMessage());
        result.putString("pictureURL", profile.getPictureUrl().toString());
        return result;
    }

    private WritableMap parseAccessToken(LineCredential credentials) {
        WritableMap result = Arguments.createMap();
        result.putString("accessToken", credentials.getAccessToken().getAccessToken());
        result.putString("expirationDate", Long.toString(credentials.getAccessToken().getExpiresInMillis()));
        return result;
    }
}
