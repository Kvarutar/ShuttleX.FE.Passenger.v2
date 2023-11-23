new-alias keytool "C:\Program Files\Java\jdk-11\bin\keytool.exe"
Set-Location .\android\app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
