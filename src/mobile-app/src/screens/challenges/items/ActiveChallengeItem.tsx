import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, useTheme, Surface } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Challenges, ChallengesUsers as ActiveChallenge } from "../../../types/entities";
import { deriveDaysLeft, calculateProgress, calculateAvoidedEmissions } from "../../home/challenges/helper";
import { AccountContext } from "../../../context/AccountContext";

import ProgressBar from "../../../components/ProgressBar";
import BigNumberCO2 from "../../../components/BigNumberCO2";
import { useNavigation } from "@react-navigation/native";

const ActiveChallengeItem = ({
    activeChallenge,
    iconName,
    parentCategory,
    setShowFeedback,
    setError
}: {
    activeChallenge: ActiveChallenge;
    iconName: string;
    parentCategory: string;
    setShowFeedback?: any;
    setError?: any;
}) => {
    const underlyingChallenge: Challenges = activeChallenge?.challenge as Challenges;
    const daysLeft = deriveDaysLeft(activeChallenge.dueDate as unknown as string);
    const emissionsAvoided = calculateAvoidedEmissions(
        activeChallenge.markedDates.length,
        underlyingChallenge.avoidableEmissionsPerDay
    );
    const progress = calculateProgress(activeChallenge.markedDates.length, underlyingChallenge.daysToMark);
    const emissionsCap: string = (
        underlyingChallenge.avoidableEmissionsPerDay * underlyingChallenge.daysToMark
    ).toFixed(2);

    const theme = useTheme();
    const navigation = useNavigation<any>();
    const { cancelChallenge, fetchActiveChallenges } = useContext(AccountContext);
    return (
        // tiny horizontal margin so that shadow is not cut off
        <Surface
            elevation={1}
            style={{ borderRadius: theme.roundness, padding: 16, marginVertical: 8, marginHorizontal: 4 }}
        >
            <View style={styles.header}>
                <Icon name={iconName} color={theme.colors.onPrimaryContainer} size={32} style={{ marginRight: 10 }} />
                <Text variant="bodyMedium">{parentCategory}</Text>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    <Surface elevation={2} mode="flat" style={styles.challengeStatus}>
                        <Text variant="bodyMedium">{activeChallenge.isCompleted ? "Finished" : "In progress"}</Text>
                    </Surface>
                </View>
            </View>
            <Text variant="titleLarge" style={{ marginTop: 16 }}>
                {underlyingChallenge.title}
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 6 }}>
                {underlyingChallenge.description}
            </Text>
            <View style={{ alignItems: "flex-start", marginTop: 20 }}>
                <Surface elevation={3} mode="flat" style={styles.avoidedCO2Label}>
                    <Text variant="bodyMedium">
                        Avoid up to {emissionsCap} {"kg CO\u2082"}
                    </Text>
                </Surface>
            </View>
            <View style={{ marginTop: 30 }}>
                <BigNumberCO2 co2={emissionsAvoided} caption="Avoided so far" />
                <Text variant="labelSmall" style={{ marginTop: 4 }}>
                    {daysLeft} days left
                </Text>
                <ProgressBar progress={progress} />
            </View>
            {!activeChallenge.isCompleted && (
                <View style={{ flexDirection: "row", marginTop: 38 }}>
                    <Button
                        mode="outlined"
                        style={{ marginRight: 4 }}
                        onPress={async () => {
                            const response = await cancelChallenge(activeChallenge.ID);
                            if (response.ok) {
                                if (setShowFeedback) setShowFeedback(true);
                                fetchActiveChallenges().catch(console.log);
                            } else {
                                if (setError) setError(true);
                                if (setShowFeedback) setShowFeedback(true);
                                console.log("Error during canceling challenge");
                            }
                        }}
                    >
                        Cancel challenge
                    </Button>
                    <Button
                        mode="contained"
                        style={{ marginLeft: 4 }}
                        onPress={() => navigation.navigate("ChallengeDetails", { challengeId: activeChallenge.ID })}
                    >
                        Update challenge
                    </Button>
                </View>
            )}
        </Surface>
    );
};

export default ActiveChallengeItem;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    challengeStatus: {
        justifyContent: "center",
        borderRadius: 15,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6
    },
    avoidedCO2Label: {
        paddingHorizontal: 18,
        paddingVertical: 4,
        marginHorizontal: 0,
        borderRadius: 15
    }
});
