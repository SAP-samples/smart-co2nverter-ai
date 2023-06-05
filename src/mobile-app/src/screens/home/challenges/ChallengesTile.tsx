import { View } from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import { useContext } from "react";
import { Surface, useTheme } from "react-native-paper";
import { Text, Button, Caption } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { ChallengesUsers as ActiveChallenge } from "../../../types/entities";
import { calculateTotalAvoidedEmissions } from "./helper";

import ChallengeSummaryItem from "./ChallengeSummaryItem";
import BigNumberCO2 from "../../../components/BigNumberCO2";
import { AccountContext } from "../../../context/AccountContext";

const { width } = Dimensions.get("window");

const ChallengesTile = () => {
    const theme = useTheme();
    const styles = makeStyles(theme.colors);
    const navigation = useNavigation<any>();
    const { state } = useContext(AccountContext);
    const activeChallenges: Array<ActiveChallenge> = state.challenges.filter((c) => !c.isCompleted);
    return (
        <Surface elevation={1} style={[styles.surface, { borderRadius: theme.roundness }]}>
            <Text variant="titleMedium">My challenges</Text>
            <Caption>
                {`${"Active challenges"}` + (activeChallenges.length > 0 ? ` (${activeChallenges.length})` : "")}
            </Caption>
            <View style={{ marginTop: 24 }}>
                <BigNumberCO2 co2={calculateTotalAvoidedEmissions(state.challenges)} caption="Avoided so far" />
            </View>
            <View style={{ marginTop: 18 }}>
                {activeChallenges.length > 0 ? (
                    activeChallenges
                        .slice(0, 4)
                        .map((activeChallenge: ActiveChallenge) => (
                            <ChallengeSummaryItem activeChallenge={activeChallenge} key={activeChallenge.ID} />
                        ))
                ) : (
                    <Text variant="bodyMedium" style={{ textAlign: "center", marginTop: 12 }}>
                        There are currently no challenges running.
                    </Text>
                )}
            </View>
            <Button mode="text" style={{ marginTop: 28 }} onPress={() => navigation.navigate("ChallengesTab")}>
                See all challenges
            </Button>
        </Surface>
    );
};

export default ChallengesTile;

const makeStyles = (colors: any) =>
    StyleSheet.create({
        surface: {
            width: width - 32, // ScreenContainer
            paddingHorizontal: 18,
            paddingTop: 18,
            paddingBottom: 22
        }
    });
