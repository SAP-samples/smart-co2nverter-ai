import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, Chip, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { HorizontalContainer } from "../layout/HorizontalContainer";
import { VerticalContainer } from "../layout/VerticalContainer";
import { DisclaimerModal } from "../modals/DisclaimerModal";
import { AccountContext, IMonthlySummary } from "../../context/AccountContext";
import { Transactions as ITransaction } from "../../types/entities";

const getSummaryValues = (monthlySummary: IMonthlySummary, categoryId?: string) => {
    if (!!categoryId && categoryId !== "ALL") {
        const currentMonthCO2 = monthlySummary.categorizedSummary[categoryId].CO2Score;
        const lastMonthCO2 = monthlySummary.lastMonths[monthlySummary.lastMonths.length - 2]
            ? monthlySummary.lastMonths[monthlySummary.lastMonths.length - 2].transactions
                  ?.filter((tx: ITransaction) => tx.mcc?.category_ID === categoryId)
                  .reduce((sum: number, tx: ITransaction) => sum + (tx.CO2Score || 0), 0)
            : 0;
        const spendings = monthlySummary.categorizedSummary[categoryId].spendings;
        const differenceToLast = Math.round(currentMonthCO2 - lastMonthCO2);
        const higherThanLastMonth = differenceToLast < 0;
        return { spendings, differenceToLast, higherThanLastMonth };
    } else {
        const currentMonthCO2 = monthlySummary.transactionSummary.CO2Score;
        const lastMonthCO2 = monthlySummary.lastMonths[monthlySummary.lastMonths.length - 2].CO2Score || 0;
        const spendings = monthlySummary.transactionSummary.spendings;
        const differenceToLast = Math.round(currentMonthCO2 - lastMonthCO2);
        const higherThanLastMonth = differenceToLast < 0;
        return { spendings, differenceToLast, higherThanLastMonth };
    }
};

export const FooterSummary = ({ categoryId }: { categoryId?: string }) => {
    const { monthlySummary, getCurrentKey } = useContext(AccountContext);
    const { colors } = useTheme();
    const { spendings, differenceToLast, higherThanLastMonth } = getSummaryValues(monthlySummary, categoryId);

    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <VerticalContainer key={getCurrentKey()}>
            <HorizontalContainer style={{ marginTop: 8 }}>
                <Chip
                    mode="flat"
                    selectedColor={colors.onPrimary}
                    style={{ backgroundColor: colors.primary }}
                    textStyle={{ color: colors.onPrimary }}
                    icon={() => (
                        <Icon
                            name={
                                differenceToLast === 0
                                    ? "arrow-right"
                                    : higherThanLastMonth
                                    ? "arrow-bottom-right"
                                    : "arrow-top-right"
                            }
                            size={16}
                            color={colors.onPrimary}
                        />
                    )}
                >
                    {`${differenceToLast === 0 || higherThanLastMonth ? "" : "+"}${differenceToLast} `}kg compared to
                    previous month
                </Chip>
            </HorizontalContainer>
            <HorizontalContainer style={{ marginTop: 8 }}>
                <Text variant={"labelMedium"} style={{ color: colors.onPrimary, marginRight: 4 }}>
                    Based on {Math.round(spendings).toLocaleString()} € in spendings
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        setIsModalVisible(true);
                    }}
                >
                    <Icon name="information" size={20} color={colors.onPrimary} />
                </TouchableOpacity>
                <DisclaimerModal
                    visible={isModalVisible}
                    onDismiss={() => {
                        setIsModalVisible(false);
                    }}
                />
            </HorizontalContainer>
        </VerticalContainer>
    );
};
