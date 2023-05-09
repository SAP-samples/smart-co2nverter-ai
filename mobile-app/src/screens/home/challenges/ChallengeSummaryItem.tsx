import { StyleSheet, View } from "react-native";
import { useTheme, Surface, List, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Challenges, ChallengesUsers as ActiveChallenge } from "../../../types/entities";
import { deriveDaysLeft, calculateProgress, calculateAvoidedEmissions } from "./helper";
import ProgressBar from "../../../components/ProgressBar";

const ChallengeSummaryItem = ({
    activeChallenge,
    iconName
}: {
    activeChallenge: ActiveChallenge;
    iconName: string;
}) => {
    const underlyingChallenge: Challenges = activeChallenge?.challenge as Challenges;
    const daysLeft = deriveDaysLeft(activeChallenge.dueDate as unknown as string);
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
                description={`${emissionsAvoided} kg avoided / ${daysLeft} days left`}
                descriptionNumberOfLines={3}
                left={(props) => (
                    <Icon style={props.style} name={iconName} color={theme.colors.onPrimaryContainer} size={32} />
                )}
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
