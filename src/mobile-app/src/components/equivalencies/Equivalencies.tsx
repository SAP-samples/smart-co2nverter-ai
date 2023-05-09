import { useState, useEffect, useContext } from "react";
import { ScrollView, View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { images } from "./images";
import { AccountContext } from "../../context/AccountContext";
import { Equivalencies as IEquivalency } from "../../types/entities";
import { HorizontalContainer } from "../layout/HorizontalContainer";
import { equivalenciesQuery } from "../../queries";

const { width } = Dimensions.get("window");

const getActiveSlideIndex = (xOffset: number) => {
    if (xOffset > 500) return 2;
    if (xOffset > 0) return 1;
    return 0;
};

const Equivalencies = () => {
    const theme = useTheme();
    const { colors } = useTheme();
    const { monthlySummary, isChangingMonth } = useContext(AccountContext);
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const [equivalencies, setEquivalencies] = useState<Array<IEquivalency>>([]);

    const { CO2Score } = monthlySummary.transactionSummary;
    const styles = makeStyles(theme.roundness);

    useEffect(() => {
        if (!!isChangingMonth) {
            const fetchEquivalencies = async () => {
                const query = equivalenciesQuery(monthlySummary.transactionSummary.CO2Score);
                const response = await fetch(query);
                if (response.ok) {
                    const data = (await response.json()).value as Array<IEquivalency>;
                    setEquivalencies(data);
                }
            };
            fetchEquivalencies().catch(console.error);
        }
    }, [isChangingMonth]);
    return (
        <View>
            <View style={{ marginHorizontal: 16 }}>
                <Text variant="titleMedium">{"Your CO\u2082 emissions are comparable to..."}</Text>
            </View>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => setActiveSlide(getActiveSlideIndex(event.nativeEvent.contentOffset.x))}
                decelerationRate={0}
            >
                {equivalencies.map((equivalency: IEquivalency, index: number) => {
                    return (
                        <ImageBackground
                            resizeMode="cover"
                            style={[styles.equivalencyContainer, styles.shadow]}
                            imageStyle={{ borderRadius: theme.roundness }}
                            source={images[equivalency.image]}
                            key={`${CO2Score}-${equivalency.amount}-${index}`}
                        >
                            <View style={styles.hue} />
                            <View style={styles.equivalency}>
                                <Text variant="displayMedium" style={styles.equivalencyHead}>
                                    {equivalency.amount.toLocaleString()}
                                </Text>
                                <Text variant="bodyMedium" style={styles.equivalencyBody}>
                                    {equivalency.description}
                                </Text>
                            </View>
                        </ImageBackground>
                    );
                })}
            </ScrollView>
            <HorizontalContainer style={{ position: "relative" }}>
                {Array.from({ length: equivalencies.length }, (_: any, id: number) => (
                    <Icon
                        key={id}
                        name="circle"
                        size={12}
                        color={activeSlide === id ? colors.outline : colors.outlineVariant}
                        style={styles.activeSummaryIndicator}
                    />
                ))}
            </HorizontalContainer>
        </View>
    );
};

export default Equivalencies;

const makeStyles = (roundness: number) =>
    StyleSheet.create({
        shadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 2 // to apply a somewhat similar shadow effect on Android
        },
        equivalencyContainer: {
            width: width - 32,
            marginTop: 8,
            marginBottom: 16,
            marginHorizontal: 16,
            borderRadius: roundness,
            backgroundColor: "#fff"
        },
        hue: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: roundness
        },
        equivalency: { paddingVertical: 30, paddingHorizontal: 32 },
        equivalencyHead: {
            color: "#fff",
            fontWeight: "500",
            fontSize: 40
        },
        equivalencyBody: {
            color: "#fff",
            lineHeight: 20
        },
        activeSummaryIndicatorContainer: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 8
        },
        activeSummaryIndicator: {
            marginHorizontal: 2
        }
    });
