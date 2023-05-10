import { StyleSheet, View } from "react-native";
import { useTheme, Surface, List, IconButton } from "react-native-paper";

import { Challenges, ChallengesUsers as ActiveChallenge } from "../../../types/entities";
import { deriveDaysLeft, calculateProgress, calculateAvoidedEmissions } from "./helper";
import ProgressBar from "../../../components/ProgressBar";
import CircleIcon from "../../../components/CircleIcon";

const ChallengeSummaryItem = ({ activeChallenge }: { activeChallenge: ActiveChallenge }) => {
    const underlyingChallenge: Challenges = activeChallenge?.challenge as Challenges;
    const daysLeft = Math.max(deriveDaysLeft(activeChallenge.dueDate as unknown as string), 0);
    const emissionsAvoided = calculateAvoidedEmissions(
        activeChallenge.markedDates.length,
        underlyingChallenge.avoidableEmissionsPerDay
    );
    const progress = calculateProgress(activeChallenge.markedDates.length, underlyingChallenge.daysToMark);

    const theme = useTheme();
    return (
        <Surface elevation={3} mode="flat" style={{ borderRadius: theme.roundness, marginVertical: 6 }}>
            <List.Item
                title={underlyingChallenge.title}
                titleNumberOfLines={2}
                titleStyle={{ fontWeight: "600" }}
                description={`${emissionsAvoided} kg avoided • ${daysLeft} days left`}
                descriptionNumberOfLines={3}
                left={(props) => <CircleIcon {...props} icon={underlyingChallenge.icon} />}
                right={(props) => (
                    <IconButton
                        style={[props.style, styles.iconButton]}
                        icon="chevron-right"
                        iconColor={theme.colors.primary}
                    />
                )}
            />
            <View style={styles.progressContainer}>
                <ProgressBar progress={progress} />
            </View>
        </Surface>
    );
};

export default ChallengeSummaryItem;

const styles = StyleSheet.create({
    iconButton: {
        marginLeft: 0,
        marginRight: -24
    },
    progressContainer: {
        marginTop: -8,
        marginBottom: 12,
        marginLeft: 64,
        marginRight: 40
    }
});
