import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Suggestions } from "../screens";

const Stack = createNativeStackNavigator();

const SuggestionsTab = () => {
    const { colors } = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Suggestions"
                component={Suggestions}
                options={{
                    title: "Suggestions",
                    headerStyle: { backgroundColor: colors.elevation.level2 },
                    headerBackTitleVisible: false,
                    headerTintColor: colors.primary,
                    headerTitleStyle: { color: "black" }
                }}
            />
        </Stack.Navigator>
    );
};

export { SuggestionsTab };
