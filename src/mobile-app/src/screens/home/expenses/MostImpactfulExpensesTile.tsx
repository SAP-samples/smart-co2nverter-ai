import { useContext, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Surface, Text, Button, Caption } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { AccountContext } from "../../../context/AccountContext";
import { Transactions as ITransaction } from "../../../types/entities";
import { HorizontalContainer } from "../../../components/layout/HorizontalContainer";
import { TransactionalItem } from "../../../components/list/items/TransactionalItem";

export const MostImpactfulExpensesTile = () => {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const { monthlySummary, getConsideredMonth } = useContext(AccountContext);
    const [transactions, setTransactions] = useState<Array<ITransaction>>([]);

    useEffect(() => {
        setTransactions(
            (monthlySummary.transactionSummary?.transactions as ITransaction[])
                .sort((a: any, b: any) => b.CO2Score - a.CO2Score)
                .slice(0, 4)
        );
    }, [getConsideredMonth]);

    return (
        <Surface elevation={1} style={[localStyles.surface, { borderRadius: theme.roundness }]}>
            <Text variant="titleMedium">{"Most impactful expenses"}</Text>
            <Caption>{getConsideredMonth().format("MMMM YYYY")}</Caption>
            <View style={{ marginVertical: 16 }}>
                {transactions.map((transaction: ITransaction) => (
                    <TransactionalItem key={transaction.ID} item={transaction} />
                ))}
            </View>
            <HorizontalContainer>
                <Button
                    mode="text"
                    style={{ borderRadius: 32 }}
                    onPress={() => {
                        navigation.push("Expenses", { selectedCategoryId: "ALL" });
                    }}
                >
                    <Text style={{ color: theme.colors.primary }}>{"See all expenses"}</Text>
                </Button>
                <Button
                    mode="text"
                    style={{ borderRadius: 32 }}
                    onPress={() => {
                        navigation.navigate("SuggestionsTab");
                    }}
                >
                    <Text style={{ color: theme.colors.primary }}>{"Reduce Impact"}</Text>
                </Button>
            </HorizontalContainer>
        </Surface>
    );
};

const localStyles = StyleSheet.create({
    surface: {
        marginHorizontal: 16,
        padding: 16
    }
});
