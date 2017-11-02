package com.xmartlabs.lineloginmanager;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
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
                        loginPromise.resolve(loginResult.getLineCredential().getAccessToken().getAccessToken());
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
            promise.resolve(loginResult.getLineCredential().getAccessToken().getAccessToken());
        } else {
            promise.reject(ERROR, "No user logged in");
        }
    }

    @ReactMethod
    public void getUserProfile(final Promise promise) {
        if (loginResult != null) {
            LineProfile profile = loginResult.getLineProfile();
            WritableMap result = Arguments.createMap();
            result.putString("displayName", profile.getDisplayName());
            result.putString("userId", profile.getUserId());
            result.putString("statusMessage", profile.getStatusMessage());
            result.putString("pictureUrl", profile.getPictureUrl().toString());
            promise.resolve(result);
        } else {
            promise.reject(ERROR, "No user logged in");
        }
    }

    @ReactMethod
    public void logout(final Promise promise) {
        loginResult = null;
        promise.resolve(new Object());
    }
}
