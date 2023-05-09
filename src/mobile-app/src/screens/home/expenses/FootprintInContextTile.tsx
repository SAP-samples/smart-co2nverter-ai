import { Animated, Dimensions, ImageBackground, ImageSourcePropType, StyleSheet, View } from "react-native";
import { Caption, Surface, Text, useTheme } from "react-native-paper";
import { useContext, useEffect, useRef, useState } from "react";

import BigNumberCO2 from "../../../components/BigNumberCO2";
import { AccountContext } from "../../../context/AccountContext";

const FootprintProgressBar = ({
    step,
    steps,
    source,
    text1,
    text2,
    percentage,
    height
}: {
    step: number;
    steps: number;
    source: ImageSourcePropType;
    text1: string;
    text2: string;
    percentage: string;
    height: number;
}) => {
    const [width, setWidth] = useState(0);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const reactive = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: reactive,
            useNativeDriver: true
        }).start();
    }, []);

    useEffect(() => {
        reactive.setValue(-width + (width * step) / steps);
    }, [step, width]);

    return (
        <View style={localStyles.progressBarContainer}>
            <View style={localStyles.image}>
                <ImageBackground source={source} style={{ width: 46, height: 46, marginTop: 3 }} />
            </View>
            <View style={{ flexGrow: 1 }}>
                <View style={localStyles.progressBarText}>
                    <Text style={{ color: "#465E70", marginLeft: 2 }}>{text1}</Text>
                    <Text style={{ color: "#222222", marginLeft: "auto", marginRight: 4 }}>{text2}</Text>
                </View>
                <View style={{ marginBottom: 4 }}>
                    <View
                        onLayout={(e) => {
                            const newWidth = e.nativeEvent.layout.width;
                            setWidth(newWidth);
                        }}
                        style={{
                            ...localStyles.progressBar,
                            height,
                            backgroundColor: "#fff",
                            overflow: "hidden",
                            marginLeft: -1,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                        }}
                    >
                        <Animated.View
                            style={{
                                ...localStyles.progressBar,
                                height,
                                backgroundColor: "#0060A7",
                                transform: [{ translateX: animatedValue }]
                            }}
                        />
                    </View>
                </View>
                <Text style={{ color: "#222222" }}>{percentage}</Text>
            </View>
        </View>
    );
};

const FootprintInContextTile = () => {
    const theme = useTheme();

    const { getForecast } = useContext(AccountContext);

    const currentYearForecast = getForecast();

    const germanyAverage = 8090;
    const europeAverage = 6800;
    const usaAverage = 14860;
    const europeStepsPercent = Math.trunc((currentYearForecast / europeAverage) * 100);
    const europeSteps = Math.min(europeStepsPercent, 100);
    const germanyStepsPercent = Math.trunc((currentYearForecast / germanyAverage) * 100);
    const germanySteps = Math.min(germanyStepsPercent, 100);
    const usaStepsPercent = Math.trunc((currentYearForecast / usaAverage) * 100);
    const usaSteps = Math.min(usaStepsPercent, 100);
    return (
        <Surface elevation={1} style={[localStyles.surface, { borderRadius: theme.roundness }]}>
            <View>
                <View style={{ marginBottom: 8 }}>
                    <Text variant="titleMedium">Your footprint in context</Text>
                    <Caption>Compare your CO2 emissions to averages in your region</Caption>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <BigNumberCO2
                        co2={currentYearForecast}
                        caption={`Your expected emissions this year based on the average of your last 8 months`}
                    />
                </View>
                <View style={{ marginBottom: 8 }}>
                    <View style={{ marginBottom: 16 }}>
                        <FootprintProgressBar
                            step={germanySteps}
                            steps={100}
                            source={require("../../../assets/germanyFlag.png")}
                            text1="Germany"
                            text2={`${germanyAverage} kg`}
                            percentage={`${germanyStepsPercent}%`}
                            height={22}
                        />
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <FootprintProgressBar
                            step={europeSteps}
                            steps={100}
                            source={require("../../../assets/europeanFlag.png")}
                            text1="Europe"
                            text2={`${europeAverage} kg`}
                            percentage={`${europeStepsPercent}%`}
                            height={22}
                        />
                    </View>
                    <View>
                        <FootprintProgressBar
                            step={usaSteps}
                            source={require("../../../assets/usFlag.png")}
                            text1="USA"
                            text2={`${usaAverage} kg`}
                            steps={100}
                            percentage={`${usaStepsPercent}%`}
                            height={22}
                        />
                    </View>
                </View>
            </View>
        </Surface>
    );
};

export default FootprintInContextTile;

const localStyles = StyleSheet.create({
    surface: {
        marginHorizontal: 16,
        padding: 16
    },
    progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    image: {
        width: 57,
        height: 57,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#B9C7D0",
        alignItems: "center",
        marginRight: -1,
        zIndex: 999
    },
    progressBar: {
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: "colors.emphazie"
    },
    progressBarText: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
        marginRight: 4,
        marginLeft: 8
    }
});
