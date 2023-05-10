import { View, StyleSheet } from "react-native";
import { useTheme, List, Text, IconButton } from "react-native-paper";
import moment from "moment";

import { Transactions as ITransaction } from "../../../types/entities";
import CircleIcon from "../../CircleIcon";

export const TransactionalItem = ({
    item,
    styles = {},
    enableHabits = false,
    editHabit
}: {
    item: ITransaction;
    styles?: any;
    enableHabits?: boolean;
    editHabit?: (transaction: ITransaction) => void;
}) => {
    const { colors } = useTheme();
    const localStyles = makeStyles(colors);
    return (
        <View style={styles}>
            <List.Item
                title={item.description}
                titleNumberOfLines={2}
                titleStyle={{ fontWeight: "600" }}
                description={`${Number(item.amount).toFixed(0)} € \n${moment(item.date, "YYYY-MM-DD").format(
                    "MMMM Do YYYY"
                )}`}
                left={(props) => <CircleIcon {...props} icon={item?.mcc?.category?.icon || "exclamation-thick"} />}
                right={() => {
                    return (
                        <View style={localStyles.itemRight}>
                            <Text variant="titleSmall">{Number(item.CO2Score).toFixed(0)} kg</Text>
                            {enableHabits && (
                                <IconButton
                                    mode="outlined"
                                    style={{ marginLeft: 9, borderColor: colors.primary, marginRight: -2 }}
                                    icon="pencil"
                                    iconColor={colors.primary}
                                    size={12}
                                    onPress={() => {
                                        if (editHabit) {
                                            editHabit(item);
                                        }
                                    }}
                                />
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        itemRight: {
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
            marginRight: -20
        }
    });
