import { useState, useEffect, useContext } from "react";
import { Image } from "react-native";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { AppNavigation } from "./navigation";
import { AccountProvider, AccountContext } from "./context/AccountContext";
import { colors } from "./theme/colors";
import { images } from "./components/equivalencies/images";

const App = () => {
    const theme = {
        ...DefaultTheme,
        roundness: 16,
        colors: {
            ...DefaultTheme.colors,
            ...colors,
            // override
            background: "#fff",
            // custom
            emphasize: "#004880",
            onEmphasize: "#fff",
            onUnderlying: "rgba(255, 255, 255, 0.2)"
        },
        fonts: {
            ...DefaultTheme.fonts,
            titleSmall: { fontSize: 14, fontWeight: 700 },
            titleMedium: { fontSize: 20, fontWeight: 700 },
            titleLarge: { fontSize: 24, fontWeight: 700 }
        }
    };

    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();
                const imageAssets = cacheImages(Object.values(images));
                await Promise.all(imageAssets);
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    return (
        <AccountProvider>
            <PaperProvider theme={theme}>{appIsReady && <AppNavigation />}</PaperProvider>
        </AccountProvider>
    );
};

registerRootComponent(() => {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <App />
        </SafeAreaProvider>
    );
});

const cacheImages = (images: Array<string>) => {
    return images.map((image: string) => {
        if (typeof image === "string") {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
};
