import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Surface, Text, Button, Caption } from "react-native-paper";

import { AccountContext, ITransactionSummary } from "../../../context/AccountContext";
import { HorizontalContainer } from "../../../components/layout/HorizontalContainer";
import { CategoryItem } from "../../../components/list/items/CategoryItem";

export const EmissionsByCategoryTile = () => {
    const { getCategoryById, getConsideredMonth, monthlySummary } = useContext(AccountContext);
    const [sortedSummaries, setSortedSummaries] = useState<any>([]);
    const [showAll, setShowAll] = useState<boolean>(false);
    const theme = useTheme();
    const styles = makeStyles(theme.colors);

    useEffect(() => {
        setSortedSummaries(
            Object.entries(monthlySummary.categorizedSummary)
                .sort(
                    (
                        [_catA, summaryA]: [string, ITransactionSummary],
                        [_catB, summaryB]: [string, ITransactionSummary]
                    ) => summaryB.CO2Score - summaryA.CO2Score
                )
                .slice(...(showAll ? [0] : [0, 4]))
        );
    }, [monthlySummary, showAll]);

    return (
        <Surface elevation={1} style={[styles.surface, { borderRadius: theme.roundness }]}>
            <Text variant="titleMedium">{"CO\u2082 Emissions by category"}</Text>
            <Caption>{getConsideredMonth().format("MMMM YYYY")}</Caption>
            <View style={{ marginVertical: 16 }}>
                {sortedSummaries.map(([categoryId, transactionSummary]: [string, ITransactionSummary]) => (
                    <CategoryItem
                        key={categoryId}
                        category={getCategoryById(categoryId)}
                        summary={transactionSummary}
                    />
                ))}
            </View>
            <HorizontalContainer>
                <Button
                    mode="text"
                    style={{ borderRadius: 32 }}
                    onPress={() => {
                        setShowAll(!showAll);
                    }}
                >
                    <Text style={{ color: theme.colors.primary }}>
                        {showAll ? "See less categories" : "See all categories"}
                    </Text>
                </Button>
            </HorizontalContainer>
        </Surface>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        surface: {
            marginHorizontal: 16,
            padding: 16
        }
    });
