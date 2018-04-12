
#### Legend
- [ ] Yet To Be Done

- [x] Waiting For Approval

~~-[x] Waiting For Approval/ DONE~~

---------------------

### Issue Checklist 

---------------------

- [x] #52 (iOS/Android) ERROR: cordova not available.
- [x] #53 (iOS/Android) Double Tab selection on Me Tab after Logout. 
- [ ] #54 (iOS/Android) Form Validation Prompts for Register & Log In
- [ ] #55 (iOS/Android) Password Validation Policy 
- [ ] #56 (iOS/Android) Trade Password 6-PIN Validation & Encryption
- [x] #58 (iOS/Android) Profile => Advertisement Page w/o details
- [ ] #59 (iOS/Android) FEATURE: Forget Password
- [x] #78 (iOS/Android) Order List not refreshed when new order is made
- [ ] #79 (iOS/Android) In-App Badge Notifications 
- [ ] #80 (iOS/Android) Chat Bubble covered by Order Information
- [x] #81 (iOS/Android) Tab Component is visible in Chat
- [x] #82 (iOS/Android) Add Currency symbols to fiat & crypto values
- [x] #83 (iOS/Android) Clean up CSS in Order Information
- [x] #84 (iOS/Android) Clean Up Complain Page
- [x] #85 (iOS/Android) Implement Slug for complain ID
- [x] #86 (iOS/Android) Implement GO button in keyboard (Chat)
- [x] #87 (iOS/Android) Add other Order Status 
- [ ] #88 (iOS/Android) Change rating flow
- [ ] #89 (iOS/Android) Change rating system to Stars
- [x] #90 (iOS/Android) Change order info from card to list
- [x] #91 (iOS/Android) order not pushed to finished after done
- [x] #92 (iOS/Android) Chat Room Title Change
- [x] #93 (iOS/Android) Remove Block Function
- [ ] #94 (iOS/Android) MY Trades With Him Tab
- [x] #95 (iOS/Android) Chat Room Image Upload
- [x] #96 (iOS/Android) Alert Component CSS Clean Up
- [ ] #97 (iOS/Android) Dismiss Alert On Activation
- [x] #98 (iOS/Android) Implement GO button in keyboard (Alert)
- [x] #102 (iOS/Android) Simulteanoues Touch Triggers App Crash
- [x] #104 (iOS/Android) Add fee for order info for advertisers
- [ ] #105 (iOS/Android) FEATURE: Soft Logout with 6 PIN
- [x] #106 (iOS/Android) Disable Copy Paste in Password Field
- [ ] #107 (iOS/Android) Data Retention of Previous User
- [x] #111 (iOS/Android) Alert Validation in Input
- [ ] #112 (iOS) removeView ERROR on Run



# How to enable livereload
* Added the following line of codes to the index.html
```html
<meta http-equiv="Content-Security-Policy" content="font-src 'self' data:; img-src * data:; default-src gap://ready file://* *; script-src 'self' 'unsafe-inline' 'unsafe-eval' * ; style-src 'self' 'unsafe-inline' *">
```
* Terminal run 
```
ionic cordova run android --livereload-host --livereload -c
```
* Launch Chrome browser access the following url chrome://inspect

# Font Awesome added to ionic usage
```html
<!-- basic usage -->
<fa-icon name="camera-retro"></fa-icon>
<!-- basic usage with color -->
<fa-icon name="camera-retro" color="danger"></fa-icon>
<!-- larger icons -->
<fa-icon name="camera-retro" size="4x"></fa-icon>
<!-- fixed width icons -->
<fa-icon name="camera-retro" fixed-width></fa-icon>
<!-- dynamic value -->
<fa-icon [name]="icon"></fa-icon>
<!-- buttons -->
<button ion-button icon-left>
  <fa-icon name="group"></fa-icon>
  people
</button>
```

# Coinmarket Cap API won't work with livereload.
* Please clean up all the ip addresses in config.xml before testing with coinmarket cap.

# Production Builds (ANDROID)
To run or build your app for production, run
```
ionic cordova run android --release
# or
ionic cordova build android --release
```
This will minify your app’s code as Ionic’s source and also remove any debugging capabilities from the APK. This is generally used when deploying an app to the Google Play Store.

```
keytool -genkey -v -keystore coinotc-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias coinotc-alias

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore coinotc-release-key.jks ./platforms/android/build/outputs/apk/android-release-unsigned.apk coinotc-alias

zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./platforms/android/build/outputs/apk/coinotc-release.apk

apksigner verify ./platforms/android/build/outputs/apk/coinotc-release.apk

```
