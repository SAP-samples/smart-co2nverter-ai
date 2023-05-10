import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, Surface, List, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { HorizontalContainer } from "../../../components/layout/HorizontalContainer";
import { Categories as ICategory } from "../../../types/entities";
import { ITransactionSummary } from "../../../context/AccountContext";

export const CategoryItem = ({
    category,
    summary,
    styles = {}
}: {
    category: ICategory;
    summary: ITransactionSummary;
    styles?: any;
}) => {
    const { colors } = useTheme();
    const localStyles = makeStyles(colors);
    const navigation = useNavigation<any>();
    return (
        <TouchableOpacity
            style={styles}
            onPress={() => navigation.push("Expenses", { selectedCategoryId: category.ID })}
        >
            <Surface elevation={0}>
                <List.Item
                    title={category.description}
                    titleNumberOfLines={2}
                    titleStyle={{ fontWeight: "600" }}
                    description={`${Math.round(summary.spendings).toLocaleString()} €`}
                    left={() => (
                        <HorizontalContainer>
                            <View style={localStyles.iconContainer}>
                                <Icon name={category.icon || "exclamation-thick"} size={30} style={localStyles.icon} />
                            </View>
                        </HorizontalContainer>
                    )}
                    right={() => {
                        return (
                            <View style={localStyles.itemRight}>
                                <Text variant="titleSmall">{Math.round(summary.CO2Score).toLocaleString()} kg</Text>
                                <Icon name="chevron-right" size={24} color={colors.primary} />
                            </View>
                        );
                    }}
                />
            </Surface>
        </TouchableOpacity>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        icon: {
            padding: 8,
            color: colors.onPrimaryContainer
        },
        iconContainer: {
            backgroundColor: colors.primaryContainer,
            borderRadius: 25
        },
        itemRight: {
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
            marginRight: -20
        }
    });
