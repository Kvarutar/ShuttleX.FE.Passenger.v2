package com.shuttlex.passenger;

import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Objects;

public class CustomModule extends ReactContextBaseJavaModule {
    CustomModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "CustomModule";
    }

    @ReactMethod
    public void navigateToLocationSettings() {
        final Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(intent);
    }

    private final Handler mHandler = new Handler(getReactApplicationContext().getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            Objects.requireNonNull(getCurrentActivity()).getWindow().setSoftInputMode(msg.what);
        }
    };

    @ReactMethod
    public void setSoftInputMode(String type) {
        Message msg = Message.obtain();
        switch (type) {
            case "adjustResize":
                msg.what = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE;
                break;
            case "adjustPan":
                msg.what = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN;
                break;
        }
        mHandler.sendMessage(msg);
    }
}
