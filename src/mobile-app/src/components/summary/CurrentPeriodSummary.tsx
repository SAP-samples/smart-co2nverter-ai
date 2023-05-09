import { useContext } from "react";
import moment, { Moment } from "moment";
import { IconButton, Text, useTheme } from "react-native-paper";
import EmphasizedSurface from "../surface/EmphasizedSurface";
import { HorizontalContainer } from "../layout/HorizontalContainer";
import CircularProgress from "react-native-circular-progress-indicator";
import { VerticalContainer } from "../layout/VerticalContainer";
import { AccountContext, ITransactionSummary } from "../../context/AccountContext";
import { FooterSummary } from "./FooterSummary";

const nextPeriod = (current: Moment, setPeriod: (nextPeriod: Moment) => void) => {
    setPeriod(moment(current).add(1, "month"));
};

const prevPeriod = (current: Moment, setPeriod: (prevPeriod: Moment) => void) => {
    setPeriod(moment(current).subtract(1, "month"));
};

const isFirst = (current: Moment) => {
    return moment(current).subtract(1, "month").isBefore(moment("2020-01-01", "YYYY-MM-DD"));
};

const isLast = (current: Moment) => {
    return moment(current).add(1, "month").isAfter(moment());
};

const CurrentPeriodSummary = ({ categoryId, style: customStyle = {} }: { categoryId?: string; style?: any }) => {
    const { getConsideredMonth, setConsideredMonth, monthlySummary, getCategoryById } = useContext(AccountContext);
    const { colors } = useTheme();

    const consideredMonth = getConsideredMonth();

    const { CO2Score } =
        categoryId && categoryId !== "ALL"
            ? monthlySummary.categorizedSummary[categoryId]
            : monthlySummary.transactionSummary;
    const budget = 1000;
    return (
        <EmphasizedSurface>
            <VerticalContainer style={customStyle}>
                <HorizontalContainer style={{ justifyContent: "space-between", marginTop: -12 }}>
                    <IconButton
                        icon="chevron-left"
                        iconColor={colors.onPrimary}
                        size={32}
                        disabled={isFirst(consideredMonth)}
                        onPress={() => prevPeriod(consideredMonth, setConsideredMonth)}
                    />
                    <Text variant="headlineSmall" style={{ color: colors.onPrimary }}>
                        {moment(consideredMonth).format("MMMM YYYY")}
                    </Text>
                    <IconButton
                        icon="chevron-right"
                        iconColor={colors.onPrimary}
                        size={32}
                        disabled={isLast(consideredMonth)}
                        onPress={() => nextPeriod(consideredMonth, setConsideredMonth)}
                    />
                </HorizontalContainer>

                <HorizontalContainer style={{ marginTop: 16 }}>
                    <CircularProgress
                        activeStrokeWidth={8}
                        inActiveStrokeWidth={8}
                        key={CO2Score.toString()}
                        value={CO2Score}
                        radius={150 / 2}
                        duration={1500}
                        progressValueColor="#fff"
                        activeStrokeColor={CO2Score <= budget ? colors.inversePrimary : "#EC7063"}
                        inActiveStrokeColor={colors.primary}
                        maxValue={Math.max(budget, CO2Score)}
                        title={"kg CO\u2082"}
                        titleColor={colors.onPrimary}
                    />
                </HorizontalContainer>
                <HorizontalContainer style={{ marginTop: 24 }}>
                    <FooterSummary categoryId={categoryId} />
                </HorizontalContainer>
            </VerticalContainer>
        </EmphasizedSurface>
    );
};

export default CurrentPeriodSummary;
