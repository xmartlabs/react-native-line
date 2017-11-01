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
  private static final String MODULE_NAME = "LineLogin";
  private static final String CHANNEL_ID = "CHANGE_ME";
  private static final int REQUEST_CODE = 1;

  private Promise loginPromise;

  public LineLogin(ReactApplicationContext reactContext) {
    super(reactContext);
  }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
      super.onActivityResult(activity, requestCode, resultCode, data);
      if(resultCode != REQUEST_CODE) {
        loginPromise.reject("Unsupported request");
        loginPromise = null;
        return;
      }
      if (loginPromise != null) {
        LineLoginResult result = LineLoginApi.getLoginResultFromIntent(data);
        switch(result.getResponseCode()) {
          case SUCCESS:
            loginPromise.resolve(result.getLineProfile());
          case CANCEL:
            loginPromise.reject("Line login canceled by user");
          default:
            loginPromise.reject(result.getErrorData().toString());
        }
      }
    }
  };

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
    } catch(Exception e) {
      promise.reject(e.toString());
    }
  }
}
