# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Fix for release build with react-native-config, if not specified config is empty
-keep class com.shuttlexinc.passenger.BuildConfig { *; }

# Fix for release build with react-native-keychain when using FB storage.
# After upgrading react-native package need to migrate to AES and version 9+
-keep class com.facebook.crypto.** { *; }
