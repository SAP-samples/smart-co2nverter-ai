import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/home";
import { Expenses } from "../screens/expenses";

const Stack = createNativeStackNavigator();

const HomeTab = () => {
    const { colors } = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: "Home",
                    headerStyle: { backgroundColor: colors.elevation.level2 },
                    headerBackTitleVisible: false
                }}
            />
            <Stack.Screen
                name="Expenses"
                component={Expenses}
                options={{
                    title: "Expenses",
                    headerStyle: { backgroundColor: colors.elevation.level2 },
                    headerTintColor: colors.primary,
                    headerTitleStyle: { color: "black" }
                }}
            />
        </Stack.Navigator>
    );
};

export { HomeTab };
