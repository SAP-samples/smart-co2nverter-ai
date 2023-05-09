import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { Moment } from "moment";

import EmphasizedSurface from "../surface/EmphasizedSurface";
import { HorizontalContainer } from "../layout/HorizontalContainer";
import { VerticalContainer } from "../layout/VerticalContainer";
import { useContext } from "react";
import { AccountContext, ITransactionSummary } from "../../context/AccountContext";
import { CustomModal } from "../modals/CustomModal";
import { generateCategorizedSummaryQuery, generateHistoricalSummaryQuery } from "../../queries";
import { ConverterService } from "../../types/entities";

const { width } = Dimensions.get("window");

const PeriodicSummary = ({ style: customStyle = {} }: { style: any }) => {
    const { monthlySummary, getConsideredMonth, isChangingMonth } = useContext(AccountContext);
    const { colors } = useTheme();

    const { lastMonths } = monthlySummary;
    const CO2Scores = lastMonths.map((month: ITransactionSummary) => Math.round(month.CO2Score));
    const data = {
        labels: CO2Scores.map((_: number, index: number) =>
            getConsideredMonth()
                .subtract(lastMonths.length - (index + 1), "month")
                .format("MMM")
        ),
        datasets: [
            {
                data: CO2Scores,
                colors: CO2Scores.map(
                    (_: number, index: number) =>
                        (opacity = 1) =>
                            index === CO2Scores.length - 1 ? colors.inversePrimary : colors.primaryContainer
                )
            }
        ]
    };
    return (
        <EmphasizedSurface>
            <VerticalContainer style={customStyle}>
                <HorizontalContainer style={{ marginTop: 2 }}>
                    <Text variant="headlineSmall" style={{ color: colors.onPrimary }}>
                        {"CO\u2082 emissions by months in kg"}
                    </Text>
                </HorizontalContainer>
                <HorizontalContainer style={styles.barChartContainer}>
                    {!isChangingMonth && (
                        <BarChart
                            style={styles.barChartFormat}
                            data={data}
                            width={Math.min(width, (CO2Scores.length + 1) * 52)}
                            height={170}
                            withInnerLines={false}
                            showBarTops={false}
                            showValuesOnTopOfBars={true}
                            chartConfig={chartConfig}
                            fromZero={true}
                            barPercentage={false}
                            withHorizontalLabels={false}
                            verticalLabelRotation={0}
                            flatColor={true}
                            withCustomBarColorFromData={true}
                        />
                    )}
                </HorizontalContainer>
                <HorizontalContainer>
                    <AISummary />
                </HorizontalContainer>
            </VerticalContainer>
        </EmphasizedSurface>
    );
};

export default PeriodicSummary;

const AISummary = () => {
    const [summaries, setSummaries] = useState<{ categorizedSummary: string; historicalSummary: string }>({
        categorizedSummary: "",
        historicalSummary: ""
    });
    const [showSummary, setShowSummary] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { monthlySummary, getConsideredMonth, getCategoryById } = useContext(AccountContext);
    const { lastMonths } = monthlySummary;

    const summarize = async () => {
        setLoading(true);

        // Categorized Summary
        const payloadCategorizedSummary: ConverterService.ICategorizedCO2[] = Object.entries(
            monthlySummary.categorizedSummary
        )
            .filter(([_categoryId, summary]: [string, ITransactionSummary]) => summary.CO2Score > 0)
            .map(([categoryId, summary]: [string, ITransactionSummary]) => ({
                category: getCategoryById(categoryId).description,
                co2: summary.CO2Score
            }));
        const queryCategorizedSummary = generateCategorizedSummaryQuery(payloadCategorizedSummary);
        const responseCategorizedSummary = await fetch(queryCategorizedSummary);

        // Historical Summary
        const payloadHistoricalSummary: ConverterService.IMonthlyCO2[] = lastMonths
            .map((summary: ITransactionSummary, index: number) => {
                const consideredMonth = getConsideredMonth().subtract(lastMonths.length - (index + 1), "month");
                return {
                    year: consideredMonth.format("YYYY"),
                    month: consideredMonth.format("MM"),
                    co2: summary.CO2Score
                };
            })
            .reverse();
        const queryHistoricalSummary = generateHistoricalSummaryQuery(payloadHistoricalSummary);
        const responseHistoricalSummary = await fetch(queryHistoricalSummary);

        if (responseHistoricalSummary.ok && responseCategorizedSummary.ok) {
            const dataCategorizedSummary = await responseCategorizedSummary.json();
            const categorizedSummary = dataCategorizedSummary.text.replace(/^\s+|\s+$/g, "");

            const dataHistoricalSummary = await responseHistoricalSummary.json();
            const historicalSummary = dataHistoricalSummary.text.replace(/^\s+|\s+$/g, "");
            setSummaries({ categorizedSummary, historicalSummary });
            setShowSummary(true);
        } else {
            setShowSummary(false);
        }

        setLoading(false);
    };

    return (
        <VerticalContainer>
            <Button icon="chat-question" mode="elevated" loading={loading} onPress={summarize}>
                Summarize
            </Button>
            <View style={{ marginTop: 8 }}>
                <Text style={{ color: "#fff" }}>
                    {
                        "When 'Summarize' is pressed, a summary is generated by GPT-3 based on the CO\u2082 emissions shown in the chart above."
                    }
                </Text>
            </View>
            <CustomModal
                title={"Your CO\u2082 Footprint Summary"}
                titleDescription={`The summaries below were generated by GPT-3 evaluating the CO\u2082 emissions for the categories of the selected months giving recommendations on how to reduce your emissions for the category with the highest ones. Furthermore, the CO\u2082 Footprint gets summarized based on the data of the last ${lastMonths.length} months.`}
                visible={showSummary}
                onDismiss={() => setShowSummary(false)}
            >
                <View style={{ backgroundColor: "#fff", marginTop: 16, padding: 16, borderRadius: 16 }}>
                    <Text variant="titleSmall">{`Categories with highest emissions`}</Text>
                    <Text>{summaries.categorizedSummary}</Text>
                </View>
                <View style={{ backgroundColor: "#fff", marginTop: 16, padding: 16, borderRadius: 16 }}>
                    <Text variant="titleSmall">{`CO\u2082 footpring of the last ${lastMonths.length} months`}</Text>
                    <Text>{summaries.historicalSummary}</Text>
                </View>
            </CustomModal>
        </VerticalContainer>
    );
};

const styles = StyleSheet.create({
    barChartContainer: {
        marginTop: 20,
        marginBottom: 16
    },
    barChartFormat: {
        marginLeft: -76
    }
});

const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (_opacity = 1) => `rgba(255, 255, 255, 1.0)`,
    strokeWidth: 2,
    barPercentage: 0.8,
    barRadius: 2,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16
    },
    propsForBackgroundLines: {
        strokeWidth: 0
    },
    propsForLabels: {
        fontSize: 12,
        fontWeight: "bold"
    },
    fillShadowGradient: "#fff",
    fillShadowGradientOpacity: 1
};
