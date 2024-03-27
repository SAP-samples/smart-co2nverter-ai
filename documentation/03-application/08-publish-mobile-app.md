# Publish Mobile App

In this section we will publish the React Native app to Expo so that it can be used without running it locally. This also makes it possible to grant access to other users.

### Prerequisties

The following prerequisites have already been mentioned in the Technical Setup Phase.

- Install the Expo CLI by running the following command in your terminal:

  `$ npm install -g expo-cli`

- Log in to your Expo account by running the following command in your terminal:

  `$ expo login`

### Configuring the Publishing Parameters

To publish the React Native app on Expo using the Expo CLI, you will need to follow these steps:

1. Enter your <_PARAMETERS_> to the `app.json` file in the `src/mobile-app/` directory if you skipped running the React Native app locally:

   ```jsonc
   {
        "expo": {
            "name": "smart-co2nverter",
            "slug": "smart-co2nverter",
            "version": "1.0.0",
            "releaseChannel": "default",
            "owner": "<YOUR_EXPO_USERNAME_OR_EXPO_ORG>",
            "privacy": "hidden", // restricts access to the project page to only the owner and other users that have been granted access: https://docs.expo.dev/versions/latest/config/app/#privacy
            #...,
            "extra": {
                "apiKey": "<YOUR_API_KEY_FOR_CAP>",
                "baseUrl": "<YOUR_CAP_BASE_URL>",
                "account": "8fbaa8ca-6cf3-4ea4-9764-82e6b841480d" //account from the sample data
            }
        }
   }
   ```

   You can set the release channel to any string value you like. This will be used to distinguish different versions of your app.

2. Follow the steps on expo to [Create a Development Build](https://docs.expo.dev/develop/development-builds/introduction/).

That's it! Your React Native app is now published at Expo!

> **Note**
> The app is only available for the owner and users that have been granted access by inviting them as -at least- Viewer to the owner's Expo account via: https://expo.dev/accounts/OWNER/settings/members (make sure to exchange the placeholder _OWNER_ with the owners identifier)
