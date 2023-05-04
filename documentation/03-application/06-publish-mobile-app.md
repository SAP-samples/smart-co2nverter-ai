# Publish Mobile App

TODO

- explain where it gets published
- link to publishing
- app.json

To publish the React Native app on Expo using the Expo CLI, you will need to follow these steps:

### Prerequisties

The following prerequisites have already been mentioned in the Technical Setup Phase.

- Install the Expo CLI by running the following command in your terminal:

  `$ npm install -g expo-cli`

- Log in to your Expo account by running the following command in your terminal:

  `$ expo login`

### Configuring the Publishing Parameters

1. Set the release channel for your app by adding the following line to the `app.json` file:

   ```json
   {
     "expo": {
       "name": "smart-co2nverter",
       "slug": "smart-co2nverter",
       "version": "1.0.0",
       "releaseChannel": "default",
       "owner": "<YOUR_EXPO_USERNAME_OR_EXPO_ORG>",
        "privacy": "hidden", // restricts access to the project page to only the owner and other users that have been granted access: https://docs.expo.dev/versions/latest/config/app/#privacy
       ...,
        "extra": {
            "apiKey": "<YOUR_API_KEY_FOR_CAP>",
            "baseUrl": "<YOUR_CAP_BASE_URL>",
            "account": "8fbaa8ca-6cf3-4ea4-9764-82e6b841480d" //account from the sample data
        }
     }
   }
   ```

   You can set the release channel to any string value you like. This will be used to distinguish different versions of your app.

2. Run the following command in your terminal to publish your app:

   `$ expo publish`

   This will upload your app to the Expo server and make it available to users who have the Expo client app installed on their devices. You will get the following output:

   ```
    › Expo SDK: 49.0.0
    › Release channel: default
    › Workflow: Managed

    Building optimized bundles and generating sourcemaps...
    Starting Metro Bundler
    Your JavaScript transform cache is empty, rebuilding (this may take a minute).
    Started Metro Bundler
    Android Bundling complete 53449ms
    💿 iOS Building Hermes bytecode for the bundle
    💿 Android Building Hermes bytecode for the bundle

    Bundle                              Size
    ┌ index.ios.js (Hermes)          2.94 MB
    ├ index.android.js (Hermes)      2.94 MB
    ├ index.ios.js.map (Hermes)      8.81 MB
    └ index.android.js.map (Hermes)  8.82 MB

    💡 JavaScript bundle sizes affect startup time. Learn more.

    Analyzing assets
    Saving assets
    ...

    Uploading JavaScript bundles
    Publish complete

    📝  Manifest: https://exp.host/@<OWNER>/smart-co2nverter?release-channel=default Learn more.
    ⚙️   Project page: https://expo.dev/@<OWNER>/smart-co2nverter?serviceType=classic&distribution=expo-go&release-channel=default Learn more.
   ```

That's it! Your React Native app is now published at Expo

> **Note**
> The app is only available for the owner and users that have been granted access by inviting them as -at least- Viewer to the owner's Expo account via: https://expo.dev/accounts/OWNER/settings/members (make sure to exchange the placeholder _OWNER_ with the owners identifier)
