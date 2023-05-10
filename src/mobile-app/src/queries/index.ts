import Constants from "expo-constants";
import buildQuery from "odata-query";

import * as ConverterService from "../types/entities";
import { buildRequest, actionQuery, getDefaultHeader, Method } from "./helper";

const account = Constants.expoConfig?.extra?.account || "";

export const categoriesQuery = (): Request => {
    const path = "/converter/Categories";
    return buildRequest(path);
};

export const accountDataQuery = (): Request => {
    let path = "/converter/Accounts";
    const expand = ["challenges/challenge", "habits/habit", "transactions/mcc/category"];
    path += buildQuery({ key: account, expand: expand });
    // Account uuid must not be surrounded by single quotes (') to be used as key
    path = path.replace("'", "").replace("'", "");
    return buildRequest(path);
};

export const equivalenciesQuery = (CO2Score: number): Request => {
    const getEquivalencies = { getEquivalencies: { co2: Math.round(CO2Score), account: account } };
    const query = "/converter" + buildQuery({ func: getEquivalencies });
    // Account uuid must not be surrounded by single quotes (') to be used as key
    const path = query.replace("'", "").replace("'", "");
    return buildRequest(path);
};

export const habitCategoriesQuery = (): Request => {
    let path = "/converter/HabitCategories";
    path += buildQuery({ expand: ["options", "mccs/mcc"] });
    return buildRequest(path);
};

export const setHabitQuery = (habitCategory: string, habit: string, transaction?: string): Request => {
    const actionName = "setHabit";
    const body: any = { account, habitCategory, habit };
    if (transaction) {
        body.transaction = transaction;
    }
    return actionQuery(actionName, body);
};

export const accountHabitsQuery = () => {
    let path = "/converter/Accounts";
    const expand = "habits/habit";
    path += buildQuery({ key: account, expand: expand });
    path = path.replace("'", "").replace("'", "");
    return buildRequest(path);
};

export const availableChallengesQuery = (): Request => {
    const path = "/converter/Challenges";
    return buildRequest(path);
};

export const activeChallengesQuery = (): Request => {
    let path = "/converter/Accounts";
    const expand = "challenges/challenge";
    path += buildQuery({ key: account, expand: expand });
    path = path.replace("'", "").replace("'", "");
    return buildRequest(path);
};

export const activeChallengeQuery = (id: string): Request => {
    let path = "/converter/ChallengesUsers";
    const expand = "challenge";
    path += buildQuery({ key: id, expand: expand });
    path = path.replace("'", "").replace("'", "");
    return buildRequest(path);
};

export const startChallengeQuery = (id: string): Request => {
    const actionName = "startChallenge";
    const body = { account: account, challengeId: id };
    return actionQuery(actionName, body);
};

export const cancelChallengeQuery = (id: string): Request => {
    const actionName = "cancelChallenge";
    const body = { id: id };
    return actionQuery(actionName, body);
};

export const completeChallengeQuery = (id: string): Request => {
    const actionName = "completeChallenge";
    const body = { id: id };
    return actionQuery(actionName, body);
};

export const updateChallengeQuery = (challenge: ConverterService.ChallengesUsers) => {
    let path = "/converter/ChallengesUsers";
    path += buildQuery({ key: challenge.ID });
    path = path.replace("'", "").replace("'", "");
    const headers: Headers = getDefaultHeader();
    headers.append("Content-Type", "application/json");
    return buildRequest(path, Method.PUT, headers, challenge);
};

export const generateSuggestionsQuery = (
    category: string,
    spendings: number,
    CO2Score: number,
    amountOfTransactions: number
): Request => {
    const actionName = ConverterService.ActionGenerateSuggestions.name;
    const body = { category, spendings, CO2Score, amountOfTransactions };
    return actionQuery(actionName, body);
};

export const generateHistoricalSummaryQuery = (historicalSummary: Array<ConverterService.IMonthlyCO2>): Request => {
    const actionName = ConverterService.ActionGenerateHistoricalSummary.name;
    const body: ConverterService.ActionGenerateHistoricalSummaryParams = { historicalSummary };
    return actionQuery(actionName, body);
};

export const generateCategorizedSummaryQuery = (
    categorizedSummary: Array<ConverterService.ICategorizedCO2>
): Request => {
    const actionName = ConverterService.ActionGenerateCategorizedSummary.name;
    const body: ConverterService.ActionGenerateCategorizedSummaryParams = { categorizedSummary };
    return actionQuery(actionName, body);
};

export const askForCompositionQuery = (name: string, contract: string, address: string, provider: string): Request => {
    const actionName = ConverterService.ActionAskForComposition.name;
    const body: ConverterService.ActionAskForCompositionParams = { name, contract, address, provider };
    return actionQuery(actionName, body);
};

export const askForGreenContractQuery = (
    name: string,
    contract: string,
    address: string,
    provider: string
): Request => {
    const actionName = ConverterService.ActionAskForGreenContract.name;
    const body: ConverterService.ActionAskForGreenContractParams = { name, contract, address, provider };
    return actionQuery(actionName, body);
};

export const askForChallengeBenefitsQuery = (title: string, description: string, avoidableEmissionsPerDay: string) => {
    const actionName = ConverterService.ActionAskForChallengeBenefits.name;
    const body: ConverterService.ActionAskForChallengeBenefitsParams = {
        title,
        description,
        avoidableEmissionsPerDay
    };
    return actionQuery(actionName, body);
};

export const askForHabitRecommendationQuery = (
    question: string,
    currentHabit: string,
    habitSummaries: Array<ConverterService.IHabitSummary>
) => {
    const actionName = ConverterService.ActionAskForHabitRecommendation.name;
    const body: ConverterService.ActionAskForHabitRecommendationParams = {
        question,
        currentHabit,
        habitSummaries
    };
    return actionQuery(actionName, body);
};
