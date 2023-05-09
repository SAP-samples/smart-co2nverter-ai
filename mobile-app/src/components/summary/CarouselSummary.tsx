import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import CurrentPeriodSummary from "./CurrentPeriodSummary";
import PeriodicSummary from "./PeriodicSummary";
import { HorizontalContainer } from "../layout/HorizontalContainer";
import { useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");

const SCREEN_CONTAINER_MARGIN = 16;
const ELEMENT_MARGIN = 8;

const SUMMARY_HEIGHT = 328;

const CarouselSummary = () => {
    const [activeSummary, setActiveSummary] = useState<number>(0);
    const { colors } = useTheme();
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => setActiveSummary(event.nativeEvent.contentOffset.x > 0 ? 1 : 0)}
                snapToInterval={width - 2 * SCREEN_CONTAINER_MARGIN + 2 * ELEMENT_MARGIN}
                decelerationRate={0}
                contentContainerStyle={styles.container}
            >
                <View style={styles.firstSummary}>
                    <CurrentPeriodSummary style={{ height: SUMMARY_HEIGHT }} />
                </View>

                <View style={styles.secondSummary}>
                    <PeriodicSummary style={{ height: SUMMARY_HEIGHT }} />
                </View>
            </ScrollView>
            <HorizontalContainer style={{ position: "relative" }}>
                {Array.from({ length: 2 }, (_: any, id: number) => (
                    <Icon
                        key={id}
                        name="circle"
                        size={12}
                        color={activeSummary === id ? colors.outline : colors.outlineVariant}
                        style={styles.activeSummaryIndicator}
                    />
                ))}
            </HorizontalContainer>
        </View>
    );
};

export default CarouselSummary;

const styles = StyleSheet.create({
    activeSummaryIndicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 8
    },
    activeSummaryIndicator: {
        marginHorizontal: 2
    },
    container: {
        paddingHorizontal: 16
    },
    firstSummary: {
        marginRight: ELEMENT_MARGIN
    },
    secondSummary: {
        marginLeft: ELEMENT_MARGIN
    }
});
