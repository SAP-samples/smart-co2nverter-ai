export namespace carbon {
    export interface Transactions {
        ID: string;
        account?: Accounts;
        account_ID?: string;
        currency: string;
        amount: number;
        date: Date;
        description: string;
        mcc?: MCC;
        mcc_ID?: string;
        CO2Score?: number;
    }

    export interface Challenges {
        ID: string;
        title: string;
        description: string;
        mcc?: MCC;
        mcc_ID?: string;
        daysToMark: number;
        avoidableEmissionsPerDay: number;
    }

    export interface ChallengesUsers {
        ID: string;
        account?: Accounts;
        account_ID?: string;
        challenge?: Challenges;
        challenge_ID?: string;
        startDate: Date;
        dueDate: Date;
        markedDates: Date[];
        isCompleted: boolean;
    }

    export enum EquivalenciesBucket {
        XS = "XS",
        S = "S",
        M = "M",
        L = "L",
        XL = "XL"
    }

    export interface Equivalencies {
        ID: string;
        vegan: boolean;
        bucket: EquivalenciesBucket;
        co2PerKg: number;
        activity: string;
        description: string;
        image: string;
        amount?: number;
    }

    export interface Accounts {
        ID: string;
        name: string;
        transactions: Transactions[];
        challenges: ChallengesUsers[];
        habits: AccountHabits[];
    }

    export interface Categories {
        ID: string;
        description: string;
        icon: string;
        mccs: MCC[];
    }

    export interface MCC {
        ID: string;
        MCC: string;
        description: string;
        factor: number;
        category?: Categories;
        category_ID?: string;
    }

    export interface HabitCategories {
        ID: string;
        question: string;
        additionalInformation: string;
        options?: Habits[];
        mccs: HabitCategoriesMCC[];
    }

    export interface HabitCategoriesMCC {
        habitCategory?: HabitCategories;
        habitCategory_ID?: string;
        mcc?: MCC;
        mcc_ID?: string;
    }

    export enum HabitsCode {
        VEGAN = "VEGAN",
        VEGETARIAN = "VEGETARIAN",
        PESCATARIAN = "PESCATARIAN",
        LOW_MEAT_EATER = "LOW_MEAT_EATER",
        DIET_AVERAGE = "DIET_AVERAGE",
        HIGH_MEAT_EATER = "HIGH_MEAT_EATER",
        DIESEL = "DIESEL",
        PETROL = "PETROL",
        FOOD = "FOOD",
        ELECTRICITY = "ELECTRICITY",
        DEFAULT = "DEFAULT"
    }

    export interface Habits {
        ID: string;
        habitCategory?: HabitCategories;
        habitCategory_ID?: string;
        code: HabitsCode;
        tag: string;
        option: string;
        additionalInformation: string;
        factor: number;
    }

    export interface AccountHabits {
        ID: string;
        account?: Accounts;
        account_ID?: string;
        habits?: Habits;
        habits_ID?: string;
        transaction?: Transactions;
        transaction_ID?: string;
    }

    export enum Entity {
        Transactions = "carbon.Transactions",
        Challenges = "carbon.Challenges",
        ChallengesUsers = "carbon.ChallengesUsers",
        Equivalencies = "carbon.Equivalencies",
        Accounts = "carbon.Accounts",
        Categories = "carbon.Categories",
        MCC = "carbon.MCC",
        HabitCategories = "carbon.HabitCategories",
        HabitCategoriesMCC = "carbon.HabitCategoriesMCC",
        Habits = "carbon.Habits",
        AccountHabits = "carbon.AccountHabits"
    }

    export enum SanitizedEntity {
        Transactions = "Transactions",
        Challenges = "Challenges",
        ChallengesUsers = "ChallengesUsers",
        Equivalencies = "Equivalencies",
        Accounts = "Accounts",
        Categories = "Categories",
        MCC = "MCC",
        HabitCategories = "HabitCategories",
        HabitCategoriesMCC = "HabitCategoriesMCC",
        Habits = "Habits",
        AccountHabits = "AccountHabits"
    }
}

export namespace sap.common {
    export interface Languages {
        name: string;
        descr: string;
        code: string;
        texts: Texts[];
        localized?: Texts;
    }

    export interface Countries {
        name: string;
        descr: string;
        code: string;
        texts: Texts[];
        localized?: Texts;
    }

    export interface Currencies {
        name: string;
        descr: string;
        code: string;
        symbol: string;
        texts: Texts[];
        localized?: Texts;
    }

    export interface Texts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export interface Texts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export interface Texts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export enum Entity {
        Languages = "sap.common.Languages",
        Countries = "sap.common.Countries",
        Currencies = "sap.common.Currencies",
        Texts = "sap.common.Currencies.texts"
    }

    export enum SanitizedEntity {
        Languages = "Languages",
        Countries = "Countries",
        Currencies = "Currencies",
        Texts = "Texts"
    }
}

export namespace ConverterService {
    export interface Transactions {
        ID: string;
        account?: Accounts;
        account_ID?: string;
        currency: string;
        amount: number;
        date: Date;
        description: string;
        mcc?: MCC;
        mcc_ID?: string;
        CO2Score?: number;
    }

    export interface AccountHabits {
        ID: string;
        account?: Accounts;
        account_ID?: string;
        habits?: Habits;
        habits_ID?: string;
        transaction?: Transactions;
        transaction_ID?: string;
    }

    export interface Accounts {
        ID: string;
        name: string;
        transactions: Transactions[];
        challenges: ChallengesUsers[];
        habits: AccountHabits[];
    }

    export enum HabitsCode {
        VEGAN = "VEGAN",
        VEGETARIAN = "VEGETARIAN",
        PESCATARIAN = "PESCATARIAN",
        LOW_MEAT_EATER = "LOW_MEAT_EATER",
        DIET_AVERAGE = "DIET_AVERAGE",
        HIGH_MEAT_EATER = "HIGH_MEAT_EATER",
        DIESEL = "DIESEL",
        PETROL = "PETROL",
        FOOD = "FOOD",
        ELECTRICITY = "ELECTRICITY",
        DEFAULT = "DEFAULT"
    }

    export interface Habits {
        ID: string;
        habitCategory?: HabitCategories;
        habitCategory_ID?: string;
        code: HabitsCode;
        tag: string;
        option: string;
        additionalInformation: string;
        factor: number;
    }

    export interface Challenges {
        ID: string;
        title: string;
        description: string;
        mcc?: MCC;
        mcc_ID?: string;
        daysToMark: number;
        avoidableEmissionsPerDay: number;
    }

    export interface ChallengesUsers {
        ID: string;
        account?: Accounts;
        account_ID?: string;
        challenge?: Challenges;
        challenge_ID?: string;
        startDate: Date;
        dueDate: Date;
        markedDates: Date[];
        isCompleted: boolean;
    }

    export interface Categories {
        ID: string;
        description: string;
        icon: string;
        mccs: MCC[];
    }

    export interface MCC {
        ID: string;
        MCC: string;
        description: string;
        factor: number;
        category?: Categories;
        category_ID?: string;
    }

    export interface HabitCategories {
        ID: string;
        question: string;
        additionalInformation: string;
        options?: Habits[];
        mccs: HabitCategoriesMCC[];
    }

    export enum EquivalenciesBucket {
        XS = "XS",
        S = "S",
        M = "M",
        L = "L",
        XL = "XL"
    }

    export interface Equivalencies {
        ID: string;
        vegan: boolean;
        bucket: EquivalenciesBucket;
        co2PerKg: number;
        activity: string;
        description: string;
        image: string;
        amount?: number;
    }

    export interface ISuggestion {
        title: string;
        description: string;
    }

    export interface IMonthlyCO2 {
        year: string;
        month: string;
        co2: number;
    }

    export interface ICategorizedCO2 {
        category: string;
        co2: number;
    }

    export interface IHabitSummary {
        option: string;
        context: string;
        factor: number;
    }

    export interface GPTAnswer {
        text: string;
    }

    export interface HabitCategoriesMCC {
        habitCategory?: HabitCategories;
        habitCategory_ID?: string;
        mcc?: MCC;
        mcc_ID?: string;
    }

    export enum FuncGetEquivalencies {
        name = "getEquivalencies",
        paramCo2 = "co2",
        paramAccount = "account"
    }

    export interface FuncGetEquivalenciesParams {
        co2: number;
        account: string;
    }

    export type FuncGetEquivalenciesReturn = Equivalencies[];

    export enum ActionAiProxy {
        name = "aiProxy",
        paramPrompt = "prompt"
    }

    export interface ActionAiProxyParams {
        prompt: string;
    }

    export type ActionAiProxyReturn = GPTAnswer;

    export enum ActionGenerateSuggestions {
        name = "generateSuggestions",
        paramCategory = "category",
        paramSpendings = "spendings",
        paramCO2Score = "CO2Score",
        paramAmountOfTransactions = "amountOfTransactions"
    }

    export interface ActionGenerateSuggestionsParams {
        category: string;
        spendings: number;
        CO2Score: number;
        amountOfTransactions: number;
    }

    export type ActionGenerateSuggestionsReturn = ISuggestion[];

    export enum ActionGenerateCategorizedSummary {
        name = "generateCategorizedSummary",
        paramCategorizedSummary = "categorizedSummary"
    }

    export interface ActionGenerateCategorizedSummaryParams {
        categorizedSummary: ICategorizedCO2[];
    }

    export type ActionGenerateCategorizedSummaryReturn = GPTAnswer;

    export enum ActionGenerateHistoricalSummary {
        name = "generateHistoricalSummary",
        paramHistoricalSummary = "historicalSummary"
    }

    export interface ActionGenerateHistoricalSummaryParams {
        historicalSummary: IMonthlyCO2[];
    }

    export type ActionGenerateHistoricalSummaryReturn = GPTAnswer;

    export enum ActionAskForComposition {
        name = "askForComposition",
        paramName = "name",
        paramContract = "contract",
        paramAddress = "address",
        paramProvider = "provider"
    }

    export interface ActionAskForCompositionParams {
        name: string;
        contract: string;
        address: string;
        provider: string;
    }

    export type ActionAskForCompositionReturn = GPTAnswer;

    export enum ActionAskForGreenContract {
        name = "askForGreenContract",
        paramName = "name",
        paramContract = "contract",
        paramAddress = "address",
        paramProvider = "provider"
    }

    export interface ActionAskForGreenContractParams {
        name: string;
        contract: string;
        address: string;
        provider: string;
    }

    export type ActionAskForGreenContractReturn = GPTAnswer;

    export enum ActionAskForChallengeBenefits {
        name = "askForChallengeBenefits",
        paramTitle = "title",
        paramDescription = "description",
        paramAvoidableEmissionsPerDay = "avoidableEmissionsPerDay"
    }

    export interface ActionAskForChallengeBenefitsParams {
        title: string;
        description: string;
        avoidableEmissionsPerDay: string;
    }

    export type ActionAskForChallengeBenefitsReturn = GPTAnswer;

    export enum ActionAskForHabitRecommendation {
        name = "askForHabitRecommendation",
        paramQuestion = "question",
        paramCurrentHabit = "currentHabit",
        paramHabitSummaries = "habitSummaries"
    }

    export interface ActionAskForHabitRecommendationParams {
        question: string;
        currentHabit: string;
        habitSummaries: IHabitSummary[];
    }

    export type ActionAskForHabitRecommendationReturn = GPTAnswer;

    export enum ActionStartChallenge {
        name = "startChallenge",
        paramAccount = "account",
        paramChallengeId = "challengeId"
    }

    export interface ActionStartChallengeParams {
        account: string;
        challengeId: string;
    }

    export type ActionStartChallengeReturn = unknown;

    export enum ActionCancelChallenge {
        name = "cancelChallenge",
        paramId = "id"
    }

    export interface ActionCancelChallengeParams {
        id: string;
    }

    export enum ActionCompleteChallenge {
        name = "completeChallenge",
        paramId = "id"
    }

    export interface ActionCompleteChallengeParams {
        id: string;
    }

    export enum Entity {
        Transactions = "ConverterService.Transactions",
        AccountHabits = "ConverterService.AccountHabits",
        Accounts = "ConverterService.Accounts",
        Habits = "ConverterService.Habits",
        Challenges = "ConverterService.Challenges",
        ChallengesUsers = "ConverterService.ChallengesUsers",
        Categories = "ConverterService.Categories",
        MCC = "ConverterService.MCC",
        HabitCategories = "ConverterService.HabitCategories",
        Equivalencies = "ConverterService.Equivalencies",
        ISuggestion = "ConverterService.ISuggestion",
        IMonthlyCO2 = "ConverterService.IMonthlyCO2",
        ICategorizedCO2 = "ConverterService.ICategorizedCO2",
        IHabitSummary = "ConverterService.IHabitSummary",
        GPTAnswer = "ConverterService.GPTAnswer",
        HabitCategoriesMCC = "ConverterService.HabitCategoriesMCC"
    }

    export enum SanitizedEntity {
        Transactions = "Transactions",
        AccountHabits = "AccountHabits",
        Accounts = "Accounts",
        Habits = "Habits",
        Challenges = "Challenges",
        ChallengesUsers = "ChallengesUsers",
        Categories = "Categories",
        MCC = "MCC",
        HabitCategories = "HabitCategories",
        Equivalencies = "Equivalencies",
        ISuggestion = "ISuggestion",
        IMonthlyCO2 = "IMonthlyCO2",
        ICategorizedCO2 = "ICategorizedCO2",
        IHabitSummary = "IHabitSummary",
        GPTAnswer = "GPTAnswer",
        HabitCategoriesMCC = "HabitCategoriesMCC"
    }
}

export type User = string;

export enum Entity {
}

export enum SanitizedEntity {
}
