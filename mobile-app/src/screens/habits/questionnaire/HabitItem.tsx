import { View, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Habits as IHabit } from "../../../types/entities";

const HabitItem = ({
    habit,
    isChecked,
    setCheckedHabit
}: {
    habit: IHabit;
    isChecked: boolean;
    setCheckedHabit: any;
}) => {
    const theme = useTheme();
    return (
        <TouchableOpacity
            style={{
                backgroundColor: theme.colors.elevation.level3,
                borderRadius: theme.roundness,
                padding: 12,
                marginVertical: 6
            }}
            onPress={() => setCheckedHabit(habit.ID)}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                    name={isChecked ? "radiobox-marked" : "radiobox-blank"}
                    size={30}
                    color={theme.colors.onPrimaryContainer}
                />
                <View style={{ marginLeft: 8, flexShrink: 1 }}>
                    <Text variant="bodyMedium">{habit.option}</Text>
                    {habit.additionalInformation && <Text variant="bodySmall">{habit.additionalInformation}</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default HabitItem;
