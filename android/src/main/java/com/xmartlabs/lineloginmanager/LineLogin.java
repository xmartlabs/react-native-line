package com.xmartlabs.lineloginmanager;

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.linecorp.linesdk.LineAccessToken;
import com.linecorp.linesdk.LineApiResponse;
import com.linecorp.linesdk.LineCredential;
import com.linecorp.linesdk.LineProfile;
import com.linecorp.linesdk.api.LineApiClient;
import com.linecorp.linesdk.api.LineApiClientBuilder;
import com.linecorp.linesdk.auth.LineLoginApi;
import com.linecorp.linesdk.auth.LineLoginResult;

public class LineLogin extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "LineLoginManager";
    private static final String ERROR = "ERROR";
    private static final String CHANNEL_ID = "1544017747";
    private static final int REQUEST_CODE = 1;

    private LineApiClient lineApiClient;
    private Promise currentPromise;
    private LineLoginResult loginResult;
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);
            if (requestCode != REQUEST_CODE) {
                currentPromise.reject(ERROR, "Unsupported request");
                return;
            }
            if (currentPromise != null) {
                loginResult = LineLoginApi.getLoginResultFromIntent(data);
                switch (loginResult.getResponseCode()) {
                    case SUCCESS:
                        currentPromise.resolve(parseLoginResult(loginResult));
                        break;
                    case CANCEL:
                        loginResult = null;
                        currentPromise.reject(ERROR, "Line login canceled by user");
                        break;
                    default:
                        loginResult = null;
                        currentPromise.reject(ERROR, loginResult.getErrorData().toString());
                        break;
                }
            }
        }
    };

    public LineLogin(ReactApplicationContext reactContext) {
        super(reactContext);
        lineApiClient = new LineApiClientBuilder(getCurrentActivity().getApplicationContext(), CHANNEL_ID).build();
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void login(final Promise promise) {
        try {
            currentPromise = promise;
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
        currentPromise = promise;
        new GetAccessTokenTask().execute();
    }

    @ReactMethod
    public void getUserProfile(final Promise promise) {
        currentPromise = promise;
        new GetProfileTask().execute();
    }

    @ReactMethod
    public void logout(final Promise promise) {
        currentPromise = promise;
        new LogoutTask().execute();
    }

    private WritableMap parseLoginResult(LineLoginResult loginResult) {
        WritableMap result = Arguments.createMap();
        result.putMap("profile", parseProfile(loginResult.getLineProfile()));
        result.putMap("accessToken", parseAccessToken(loginResult.getLineCredential().getAccessToken()));
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

    private WritableMap parseAccessToken(LineAccessToken accessToken) {
        WritableMap result = Arguments.createMap();
        result.putString("accessToken", accessToken.getAccessToken());
        result.putString("expirationDate", Long.toString(accessToken.getExpiresInMillis()));
        return result;
    }

    public class LogoutTask extends AsyncTask<Void, Void, LineApiResponse> {

        final static String TAG = "LogoutTask";

        @Override
        protected LineApiResponse doInBackground(Void... voids) {
            return lineApiClient.getProfile();
        }

        @Override
        protected void onPostExecute(LineApiResponse lineApiResponse) {
            if (lineApiResponse.isSuccess()) {
                currentPromise.resolve(new Object());
            } else {
                currentPromise.reject(ERROR, lineApiResponse.getErrorData().toString());
            }
        }
    }

    public class GetProfileTask extends AsyncTask<Void, Void, LineApiResponse<LineProfile>> {
        final static String TAG = "GetProfileTask";

        protected LineApiResponse<LineProfile> doInBackground(Void... params) {
            return lineApiClient.getProfile();
        }

        protected void onPostExecute(LineApiResponse<LineProfile> lineApiResponse) {
            if (lineApiResponse.isSuccess()) {
                currentPromise.resolve(parseProfile(lineApiResponse.getResponseData()));
            } else {
                currentPromise.reject(ERROR, lineApiResponse.getErrorData().toString());
            }
        }
    }

    public class GetAccessTokenTask extends AsyncTask<Void, Void, LineApiResponse<LineAccessToken>> {
        final static String TAG = "GetAccessTokenTask";

        protected LineApiResponse<LineAccessToken> doInBackground(Void... params) {
            return lineApiClient.getCurrentAccessToken();
        }

        @Override
        protected void onPostExecute(LineApiResponse<LineAccessToken> lineApiResponse) {
            if (lineApiResponse.isSuccess()) {
                currentPromise.resolve(parseAccessToken(lineApiResponse.getResponseData()));
            } else {
                currentPromise.reject(ERROR, lineApiResponse.getErrorData().toString());
            }
        }
    }
}
