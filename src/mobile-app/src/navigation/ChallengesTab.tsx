import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Challenges, ChallengeDetails } from "../screens";

const Stack = createNativeStackNavigator();

const ChallengesTab = () => {
    const { colors } = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Challenges"
                component={Challenges}
                options={{
                    title: "Challenges",
                    headerStyle: { backgroundColor: colors.elevation.level2 },
                    headerBackTitleVisible: false,
                    headerTintColor: colors.primary,
                    headerTitleStyle: { color: "black" }
                }}
            />
            <Stack.Screen
                name="ChallengeDetails"
                component={ChallengeDetails}
                options={{
                    title: "Challenge Overview",
                    headerStyle: { backgroundColor: colors.elevation.level2 }
                }}
            />
        </Stack.Navigator>
    );
};

export { ChallengesTab };
