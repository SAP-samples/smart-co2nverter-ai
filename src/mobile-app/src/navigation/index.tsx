import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ActivityIndicator, BottomNavigation, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { HomeTab } from "./HomeTab";
import { ChallengesTab } from "./ChallengesTab";
import { SuggestionsTab } from "./SuggestionsTab";
import { HabitsTab } from "./HabitsTab";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
    const { isLoading } = useContext(AccountContext);
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    return (
        <>
            {isLoading() ? (
                <View style={styles.activityIndicator}>
                    <ActivityIndicator animating={true} size="large" color={colors.primary} />
                </View>
            ) : (
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={{
                            headerShown: false
                        }}
                        tabBar={({ navigation, state, descriptors, insets }) => (
                            <BottomNavigation.Bar
                                navigationState={state}
                                safeAreaInsets={{ ...insets, bottom: 8 }}
                                onTabPress={({ route }) => {
                                    navigation.navigate(route.name, route.params);
                                }}
                                renderIcon={({ route, focused, color }) => {
                                    const { options } = descriptors[route.key];
                                    return options.tabBarIcon ? options.tabBarIcon({ focused, color, size: 24 }) : null;
                                }}
                                getLabelText={({ route }) => {
                                    const { options } = descriptors[route.key];
                                    const label: string = (options.tabBarLabel as string) || "NA";
                                    return label;
                                }}
                            />
                        )}
                    >
                        <Tab.Screen
                            name="HomeTab"
                            component={HomeTab}
                            options={{
                                tabBarLabel: "Home",
                                tabBarIcon: ({ color, size }) => (
                                    <Icon name="home-variant-outline" size={size} color={color} />
                                )
                            }}
                        />
                        <Tab.Screen
                            name="ChallengesTab"
                            component={ChallengesTab}
                            options={{
                                tabBarLabel: "Challenges",
                                tabBarIcon: ({ color, size }) => <Icon name="leaf" size={size} color={color} />
                            }}
                        />
                        <Tab.Screen
                            name="SuggestionsTab"
                            component={SuggestionsTab}
                            options={{
                                tabBarLabel: "Suggestions",
                                tabBarIcon: ({ color, size }) => (
                                    <Icon name="lightbulb-outline" size={size} color={color} />
                                )
                            }}
                        />
                        <Tab.Screen
                            name="HabitsTab"
                            component={HabitsTab}
                            options={{
                                tabBarLabel: "Habits",
                                tabBarIcon: ({ color, size }) => <Icon name="account-cash" size={size} color={color} />
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            )}
        </>
    );
};

export { AppNavigation };

const makeStyles = (colors: any) =>
    StyleSheet.create({
        activityIndicator: {
            ...(StyleSheet.absoluteFill as object),
            alignItems: "center",
            justifyContent: "center"
        }
    });
