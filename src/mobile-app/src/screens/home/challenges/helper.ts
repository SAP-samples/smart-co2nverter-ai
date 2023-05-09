import { ChallengesUsers as ActiveChallenge, ChallengesUsers } from "../../../types/entities";

const calculateAvoidedEmissions = (countMarkedDates: number, emissionsAvoidablePerDay: number): number =>
    Math.round((countMarkedDates * emissionsAvoidablePerDay + Number.EPSILON) * 100) / 100;

const calculateProgress = (countMarkedDates: number, daysToMark: number): number => {
    let progress = countMarkedDates / daysToMark;
    progress = Number(progress.toFixed(2));
    return progress;
};

// dueDate is date string, e.g. "2023-01-24"
const deriveDaysLeft = (dueDate: string): number => {
    const daysLeft: number = (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return Math.floor(daysLeft);
};

const calculateTotalAvoidedEmissions = (activeChallenges: Array<ActiveChallenge>) => {
    return (
        Math.round(
            activeChallenges.reduce((total: number, current: ChallengesUsers) => {
                return (
                    total +
                    current.markedDates.length * (current.challenge?.avoidableEmissionsPerDay || 0) +
                    Number.EPSILON
                );
            }, 0) * 100
        ) / 100
    );
};

const CHALLENGE_ICON_MAPPING: { [id: string]: string } = Object.freeze({
    "572fef3e-b324-45bb-af18-aa2c99877c97": "bike",
    "410b50f6-ccb8-41fa-9baa-2a555f620124": "food-apple"
});

const CHALLENGE_CATEGORY_MAPPING: { [id: string]: string } = Object.freeze({
    "572fef3e-b324-45bb-af18-aa2c99877c97": "Transportation",
    "410b50f6-ccb8-41fa-9baa-2a555f620124": "Food"
});

export {
    calculateAvoidedEmissions,
    calculateTotalAvoidedEmissions,
    calculateProgress,
    deriveDaysLeft,
    CHALLENGE_ICON_MAPPING,
    CHALLENGE_CATEGORY_MAPPING
};
