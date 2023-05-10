import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Habits } from "../screens";

const Stack = createNativeStackNavigator();

const HabitsTab = () => {
    const { colors } = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Habits"
                component={Habits}
                options={{
                    title: "Habits",
                    headerStyle: { backgroundColor: colors.elevation.level2 },
                    headerBackTitleVisible: false,
                    headerTintColor: colors.primary,
                    headerTitleStyle: { color: "black" }
                }}
            />
        </Stack.Navigator>
    );
};

export { HabitsTab };
