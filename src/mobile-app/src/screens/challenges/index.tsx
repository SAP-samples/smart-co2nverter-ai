import { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, Snackbar, Caption } from "react-native-paper";

import { AccountContext } from "../../context/AccountContext";
import { Challenges as AvailableChallenges, ChallengesUsers as ActiveChallenges } from "../../types/entities";
import { CHALLENGE_ICON_MAPPING, CHALLENGE_CATEGORY_MAPPING } from "../home/challenges/helper";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { VerticalContainer } from "../../components/layout/VerticalContainer";
import { HorizontalContainer } from "../../components/layout/HorizontalContainer";
import ActiveChallengeItem from "./items/ActiveChallengeItem";
import ChallengeItem from "./items/ChallengeItem";
import { CustomModal } from "../../components/modals/CustomModal";

const FEEDBACK: { [key: string]: string } = Object.freeze({
    cancel: "Challenge was canceled successfully",
    error: "Something went wrong. Please try again later."
});

const Challenges = () => {
    const { state, getChallenges } = useContext(AccountContext);
    const availableChallenges: Array<AvailableChallenges> = getChallenges();
    const activeChallenges: Array<ActiveChallenges> = state.challenges;
    const inProgressChallenges = activeChallenges ? activeChallenges.filter((challenge) => !challenge.isCompleted) : [];
    const completedChallenges = activeChallenges ? activeChallenges.filter((challenge) => challenge.isCompleted) : [];

    const [selectedFilter, setSelectedFilter] = useState<0 | 1 | 2>(0);
    const availableCount = availableChallenges.length;
    const inProgressCount = inProgressChallenges.length;
    const completedCount = completedChallenges.length;

    const [showModal, setShowModal] = useState<boolean>(false);
    const [gptError, setGptError] = useState<boolean>(false);
    const [motivation, setMotivation] = useState<{ title: string; description: string; content: string }>({
        title: "",
        description: "",
        content: ""
    });
    const [error, setError] = useState<boolean>(false);
    const [showFeedback, setShowFeedback] = useState<boolean>(false);
    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 8 }}>
                <Text variant="titleMedium" style={{ marginTop: 16 }}>
                    Challenge yourself
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                    Avoid CO2 emissions by introducing climate friendly changes in your routine and tracking their
                    impact.
                </Text>
                <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-around" }}>
                    <Button
                        mode={selectedFilter === 0 ? "contained" : "contained-tonal"}
                        compact={true}
                        onPress={() => setSelectedFilter(0)}
                    >
                        Available ({availableCount})
                    </Button>
                    <Button
                        mode={selectedFilter === 1 ? "contained" : "contained-tonal"}
                        compact={true}
                        onPress={() => setSelectedFilter(1)}
                    >
                        In progress ({inProgressCount})
                    </Button>
                    <Button
                        mode={selectedFilter === 2 ? "contained" : "contained-tonal"}
                        compact={true}
                        onPress={() => setSelectedFilter(2)}
                    >
                        Finished ({completedCount})
                    </Button>
                </View>
                <View style={{ marginTop: 12, marginBottom: 14 }}>
                    {selectedFilter === 0 &&
                        availableChallenges.map((challenge: AvailableChallenges) => (
                            <ChallengeItem
                                challenge={challenge}
                                iconName={CHALLENGE_ICON_MAPPING[challenge.ID]}
                                parentCategory={CHALLENGE_CATEGORY_MAPPING[challenge.ID]}
                                key={challenge.ID}
                                {...{ setMotivation, setShowModal, setGptError }}
                            />
                        ))}
                    {selectedFilter === 1 &&
                        (inProgressCount > 0 ? (
                            inProgressChallenges.map((challenge: ActiveChallenges) => {
                                const id = challenge.challenge?.ID as string;
                                return (
                                    <ActiveChallengeItem
                                        activeChallenge={challenge}
                                        iconName={CHALLENGE_ICON_MAPPING[id]}
                                        parentCategory={CHALLENGE_CATEGORY_MAPPING[id]}
                                        setShowFeedback={setShowFeedback}
                                        setError={setError}
                                        key={challenge.ID}
                                    />
                                );
                            })
                        ) : (
                            <VerticalContainer style={{ marginTop: 8 }}>
                                <HorizontalContainer>
                                    <Text>No Challenges</Text>
                                </HorizontalContainer>
                                <HorizontalContainer>
                                    <Caption>You have no challenges in progress currently.</Caption>
                                </HorizontalContainer>
                            </VerticalContainer>
                        ))}
                    {selectedFilter === 2 &&
                        (completedCount > 0 ? (
                            completedChallenges.map((challenge: ActiveChallenges) => {
                                const id = challenge.challenge?.ID as string;
                                return (
                                    <ActiveChallengeItem
                                        activeChallenge={challenge}
                                        iconName={CHALLENGE_ICON_MAPPING[id]}
                                        parentCategory={CHALLENGE_CATEGORY_MAPPING[id]}
                                        key={challenge.ID}
                                    />
                                );
                            })
                        ) : (
                            <VerticalContainer style={{ marginTop: 8 }}>
                                <HorizontalContainer>
                                    <Text>No Challenges</Text>
                                </HorizontalContainer>
                                <HorizontalContainer>
                                    <Caption>You have not finished any challenges yet.</Caption>
                                </HorizontalContainer>
                            </VerticalContainer>
                        ))}
                </View>
            </ScrollView>
            <CustomModal
                title={motivation.title}
                titleDescription={motivation.description}
                visible={showModal}
                onDismiss={() => setShowModal(false)}
            >
                <View style={{ backgroundColor: "#fff", marginTop: 16, padding: 16, borderRadius: 16 }}>
                    <Text>{motivation.content}</Text>
                </View>
            </CustomModal>
            <Snackbar onDismiss={() => setGptError(false)} duration={5000} visible={gptError}>
                Error getting GPT-3 response! Please try again later.
            </Snackbar>
            <Snackbar
                onDismiss={() => {
                    setError(false);
                    setShowFeedback(false);
                }}
                duration={3000}
                visible={showFeedback}
            >
                {error ? FEEDBACK["error"] : FEEDBACK["cancel"]}
            </Snackbar>
        </ScreenContainer>
    );
};

export default Challenges;
