import { useState, useEffect, useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, Button, useTheme, Surface, Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { ChallengesUsers as IActiveChallenge, Challenges as IChallenge } from "../../types/entities";
import { activeChallengeQuery, updateChallengeQuery, completeChallengeQuery } from "../../queries";
import { deriveDaysLeft, calculateAvoidedEmissions, calculateProgress } from "../home/challenges/helper";

import { ScreenContainer } from "../../components/layout/ScreenContainer";
import Calendar, { IMarkedDays } from "./Calendar";
import BigNumberCO2 from "../../components/BigNumberCO2";
import ProgressBar from "../../components/ProgressBar";
import { AccountContext } from "../../context/AccountContext";

interface IProgress {
    emissionsAvoided: number;
    percentage: number;
}

const FEEDBACK: { [key: string]: string } = Object.freeze({
    save: "Challenge progress was saved successfully",
    error: "Something went wrong. Please try again later."
});

const ChallengeDetails = ({ route }: { route: any }) => {
    const navigation = useNavigation<any>();
    const { colors, roundness } = useTheme();
    const styles = makeStyles(colors);
    const { challengeId }: { challengeId: string } = route.params;
    const { cancelChallenge, fetchActiveChallenges } = useContext(AccountContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [challenge, setChallenge] = useState<IActiveChallenge>({} as IActiveChallenge);
    const associatedChallenge = challenge.challenge as IChallenge;
    const [markedDays, setMarkedDays] = useState<IMarkedDays>({} as IMarkedDays);
    const [progress, setProgress] = useState<IProgress>({ percentage: 0, emissionsAvoided: 0 });

    const [error, setError] = useState<boolean>(false);
    const [showFeedback, setShowFeedback] = useState<boolean>(false);

    let daysLeft: number = 30;
    let emissionsCap: string = "";
    let dueDate: string = "";
    // challenge is not just empty object ({})
    if (Object.keys(challenge).length > 0) {
        daysLeft = deriveDaysLeft(challenge.dueDate as unknown as string);
        emissionsCap = (associatedChallenge.avoidableEmissionsPerDay * associatedChallenge.daysToMark).toFixed(2);
        dueDate = Object.keys(challenge).length > 0 ? formatDueDate(challenge.dueDate as unknown as string) : "";
    }

    useEffect(() => {
        refreshChallenge(challengeId, true).catch(console.log);
    }, []);

    const refreshChallenge = async (challengeId: string, showLoadingIndicator = false): Promise<void> => {
        if (showLoadingIndicator) setIsLoading(true);
        const response = await fetchActiveChallenge(challengeId);
        if (response.ok) {
            const data = (await response.json()) as IActiveChallenge;
            const associatedChallenge = data.challenge as IChallenge;
            const markedDays = data.markedDates;
            setChallenge(data);
            setMarkedDays(markedDaysAsObject(markedDays as unknown as Array<string>, colors.primary));
            const emissionsAvoided = calculateAvoidedEmissions(
                markedDays.length,
                associatedChallenge.avoidableEmissionsPerDay
            );
            const percentage = calculateProgress(markedDays.length, associatedChallenge.daysToMark);
            setProgress({
                percentage: percentage,
                emissionsAvoided: emissionsAvoided
            });
        } else {
            setError(true);
            setShowFeedback(true);
        }
        if (showLoadingIndicator) setIsLoading(false);
    };

    const fetchActiveChallenge = (challengeId: string) => {
        return fetch(activeChallengeQuery(challengeId));
    };

    const updateChallenge = (challenge: IActiveChallenge): Promise<Response> => {
        return fetch(updateChallengeQuery(challenge));
    };

    const refreshProgress = (markedDaysCount: number): void => {
        const emissionsAvoided = calculateAvoidedEmissions(
            markedDaysCount,
            associatedChallenge.avoidableEmissionsPerDay
        );
        const percentage = calculateProgress(markedDaysCount, associatedChallenge.daysToMark);
        setProgress({ emissionsAvoided: emissionsAvoided, percentage: percentage });
    };

    const completeChallenge = (challengeId: string): Promise<Response> => {
        return fetch(completeChallengeQuery(challengeId));
    };

    const saveProgress = (): Promise<Response> => {
        const days = markedDaysAsList(markedDays);
        const challengeNew: IActiveChallenge = {
            ...challenge,
            markedDates: days as unknown as Date[]
        };
        delete challengeNew.challenge;
        return updateChallenge(challengeNew);
    };

    return (
        <>
            {isLoading ? (
                <View style={styles.activityIndicator}>
                    <ActivityIndicator animating={true} size="large" color={colors.primary} />
                </View>
            ) : (
                <ScreenContainer>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
                        <Text variant="titleMedium" style={{ marginTop: 8 }}>
                            {associatedChallenge && associatedChallenge.title}
                        </Text>
                        <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                            {associatedChallenge && associatedChallenge.description}
                        </Text>
                        <View style={{ alignItems: "flex-start", marginTop: 20 }}>
                            <Surface
                                elevation={3}
                                mode="flat"
                                style={{
                                    paddingHorizontal: 18,
                                    paddingVertical: 4,
                                    borderRadius: roundness
                                }}
                            >
                                <Text variant="bodyMedium">
                                    Avoid up to {emissionsCap} {"kg CO\u2082"}
                                </Text>
                            </Surface>
                        </View>
                        <View style={{ marginTop: 40 }}>
                            <BigNumberCO2 co2={progress.emissionsAvoided} caption="Avoided so far" />
                            <Text variant="labelSmall" style={{ marginTop: 4 }}>
                                {Math.max(daysLeft, 0)} days left until {dueDate}
                            </Text>
                            <ProgressBar
                                progress={progress.percentage}
                                style={{ backgroundColor: colors.surfaceVariant }}
                            />
                        </View>
                        <Text variant="titleSmall" style={{ marginTop: 40, marginBottom: 20 }}>
                            Mark the days on which you contributed to the challenge.
                        </Text>
                        <Calendar
                            markedDays={markedDays}
                            setMarkedDays={setMarkedDays}
                            startDate={challenge.startDate as unknown as string}
                            dueDate={challenge.dueDate as unknown as string}
                            refreshProgress={refreshProgress}
                        />
                        <View style={styles.buttonsContainer}>
                            <Button
                                mode="outlined"
                                compact
                                style={{
                                    marginHorizontal: 4,
                                    flex: 1
                                }}
                                onPress={async () => {
                                    const response = await cancelChallenge(challenge.ID);
                                    if (response.ok) {
                                        navigation.navigate("Challenges");
                                        fetchActiveChallenges().catch(console.log);
                                    } else {
                                        setError(true);
                                        setShowFeedback(true);
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!(progress.percentage >= 1 || daysLeft < 0)}
                                mode="outlined"
                                compact
                                style={{ marginHorizontal: 4, flex: 1 }}
                                onPress={async () => {
                                    let r1: Response = await saveProgress();
                                    let r2 = await completeChallenge(challenge.ID);
                                    if (r1.ok && r2.ok) {
                                        navigation.navigate("Challenges");
                                        fetchActiveChallenges().catch(console.log);
                                    } else {
                                        setError(true);
                                        setShowFeedback(true);
                                    }
                                }}
                            >
                                Finish
                            </Button>
                            <Button
                                mode="contained"
                                compact
                                style={{ marginHorizontal: 4, flex: 1 }}
                                onPress={async () => {
                                    const response = await saveProgress();
                                    if (response.ok) {
                                        setShowFeedback(true);
                                        refreshChallenge(challenge.ID).catch(console.log);
                                    } else {
                                        setError(true);
                                        setShowFeedback(true);
                                    }
                                    fetchActiveChallenges().catch(console.log);
                                }}
                            >
                                Save
                            </Button>
                        </View>
                    </ScrollView>
                    <Snackbar
                        onDismiss={() => {
                            setError(false);
                            setShowFeedback(false);
                        }}
                        duration={3000}
                        visible={showFeedback}
                    >
                        {error ? FEEDBACK["error"] : FEEDBACK["save"]}
                    </Snackbar>
                </ScreenContainer>
            )}
        </>
    );
};

export default ChallengeDetails;

const makeStyles = (colors: any) =>
    StyleSheet.create({
        activityIndicator: {
            ...(StyleSheet.absoluteFill as object),
            alignItems: "center",
            justifyContent: "center"
        },
        buttonsContainer: {
            marginVertical: 32,
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1
        }
    });

/* HELPERS */

/* returns list of date strings */
const markedDaysAsList = (markedDays: IMarkedDays): Array<string> => {
    return Object.entries(markedDays)
        .filter(([_, { selected }]) => selected)
        .map(([dateString, _]: [dateString: string, _: any]) => dateString);
};

const markedDaysAsObject = (markedDays: Array<string>, color: string): IMarkedDays => {
    return markedDays.reduce(
        (acc, dateString) => ({ ...acc, [dateString]: { selected: true, selectedColor: color } }),
        {}
    );
};

const formatDueDate = (dueDate: string) => {
    const parts: Array<string> = dueDate.split("-");
    const month = parts[1];
    const days = parts[2];
    return days + "." + month;
};
