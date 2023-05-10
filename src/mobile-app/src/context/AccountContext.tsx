import "react-native-get-random-values";
import { createContext, useEffect, useState } from "react";
import moment, { Moment } from "moment";
import {
    Accounts as IAccount,
    Transactions as ITransaction,
    Categories as ICategory,
    Challenges as IChallenge,
    ChallengesUsers as IActiveChallenge,
    HabitCategories as IHabitCategory,
    AccountHabits as IAccountHabit
} from "../types/entities";
import { Alert } from "react-native";
import {
    categoriesQuery,
    accountDataQuery,
    availableChallengesQuery,
    activeChallengesQuery,
    startChallengeQuery,
    cancelChallengeQuery,
    habitCategoriesQuery,
    setHabitQuery,
    accountHabitsQuery
} from "../queries";

interface IAccountContext {
    state: IAccount;
    monthlySummary: IMonthlySummary;
    getConsideredMonth: () => Moment;
    setConsideredMonth: (consideredMonth: Moment) => void;
    isLoading: boolean;
    getCurrentKey: () => string;
    isChangingMonth: boolean;
    getCategories: () => ICategory[];
    getCategoryById: (categoryId: string) => ICategory;
    getChallenges: () => IChallenge[];
    getHabitCategories: () => IHabitCategory[];
    getForecast: () => number;
    startChallenge: (id: string) => Promise<Response>;
    cancelChallenge: (id: string) => Promise<Response>;
    fetchActiveChallenges: () => Promise<void>;
    setHabit: (habitCategory: string, habit: string, transaction?: string) => Promise<Response>;
    fetchAccountData: () => Promise<void>;
}

export interface IMonthlySummary {
    transactionSummary: ITransactionSummary;
    categorizedSummary: ICategorizedSummary;
    lastMonths: Array<ITransactionSummary>;
}

export interface ITransactionSummary {
    spendings: number;
    CO2Score: number;
    transactions: Array<ITransaction>;
}

export interface ICategorizedSummary {
    [categoryId: string]: ITransactionSummary;
}

const initialAccountState: IAccount = {} as IAccount;

const AccountContext = createContext<IAccountContext>({} as IAccountContext);

const AccountProvider = ({ children }: any) => {
    const [state, setState] = useState<IAccount>(initialAccountState);
    const [monthlySummary, setMonthlySummary] = useState<IMonthlySummary>({} as IMonthlySummary);
    const [transactionSummaries, setTransactionSummaries] = useState<{ [month: string]: ITransactionSummary }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [consideredMonth, setConsideredMonth] = useState<Moment>(moment());
    const [categories, setCategories] = useState<{ [categoryId: string]: ICategory }>({});
    const [challenges, setChallenges] = useState<Array<IChallenge>>([]);
    const [habitCategories, setHabitCategories] = useState<Array<IHabitCategory>>([]);
    const [isChangingMonth, setIsChangingMonth] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [forecast, setForecast] = useState<number>();

    const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([fetchHabitCategories(), fetchCategories(), fetchAccountData(), fetchChallenges()]);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        if (isLoading) {
            setHasError(false);
        }
    }, [isLoading]);

    useEffect(() => {
        fetchData().catch(console.error);
    }, [hasError]);

    useEffect(() => {
        setIsChangingMonth(true);
        createMonthlySummary();
        const timer = setTimeout(() => {
            setIsChangingMonth(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [consideredMonth, transactionSummaries]);

    useEffect(() => {
        if (!forecast) {
            const co2LastMonths = monthlySummary.lastMonths?.reduce(
                (co2LastMonths: number, summary: ITransactionSummary) => (co2LastMonths += summary.CO2Score),
                0
            );
            if (co2LastMonths) {
                const yearlyForecast = Math.round((co2LastMonths / monthlySummary.lastMonths.length) * 12);
                setForecast(yearlyForecast);
            }
        }
    }, [monthlySummary]);

    const getConsideredMonth = () => {
        return moment(consideredMonth);
    };

    const fetchCategories = async () => {
        try {
            const response: any = await fetch(categoriesQuery());
            if (response.ok) {
                const data = (await response.json()).value as Array<ICategory>;
                const mappedCategories = data.reduce(
                    (result: { [categoryId: string]: ICategory }, category: ICategory) => ({
                        ...result,
                        [category.ID]: category
                    }),
                    {}
                );
                setCategories(mappedCategories);
            }
        } catch (e) {
            console.log(e);
            setHasError(true);
        }
    };

    // Fetch all the transactions of the logged in user
    const fetchAccountData = async () => {
        try {
            const response: any = await fetch(accountDataQuery());
            if (response.ok) {
                const data = (await response.json()) as IAccount;
                createTransactionSummaries(data);
                setState(data);
            }
        } catch (e) {
            console.log(e);
            setHasError(true);
        }
    };

    const createTransactionSummaries = (data: IAccount) => {
        // Create dummy summaries from now until Jan 2020
        const summaries: { [month: string]: ITransactionSummary } = {};
        const monthlyIterator = moment();
        do {
            const keyForMonth = getKeyForMonth(monthlyIterator);
            if (summaries[keyForMonth] === undefined) {
                summaries[keyForMonth] = {
                    transactions: new Array<ITransaction>(),
                    CO2Score: 0,
                    spendings: 0
                };
            }
        } while (monthlyIterator.subtract(1, "month").isAfter(moment("2020-01-01", "YYYY-MM-DD")));
        data.transactions?.forEach((tx: ITransaction) => {
            const keyForMonth = getKeyForMonth(moment(tx.date));

            const month = summaries[keyForMonth];
            month.CO2Score += tx.CO2Score!;
            month.spendings += tx.amount!;
            month.transactions.push(tx);
        });
        setTransactionSummaries(summaries);
    };

    const fetchHabitCategories = async () => {
        try {
            const response: Response = await fetch(habitCategoriesQuery());
            if (response.ok) {
                const data = (await response.json()).value as Array<IHabitCategory>;
                setHabitCategories(data);
            }
        } catch (e) {
            console.error(e);
            setHasError(true);
        }
    };

    const fetchAccountHabits = async () => {
        try {
            const response = await fetch(accountHabitsQuery());
            if (response.ok) {
                const data = (await response.json()).habits as Array<IAccountHabit>;
                setState({ ...state, habits: data });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const setHabit = (habitCategory: string, habit: string, transaction?: string): Promise<Response> => {
        if (transaction) {
            return fetch(setHabitQuery(habitCategory, habit, transaction));
        }
        return fetch(setHabitQuery(habitCategory, habit));
    };

    // fetch generally available challenges (not the active ones)
    const fetchChallenges = async () => {
        try {
            const response: Response = await fetch(availableChallengesQuery());
            if (response.ok) {
                const data = (await response.json()).value as Array<IChallenge>;
                setChallenges(data);
            }
        } catch (e) {
            console.error(e);
            setHasError(true);
        }
    };

    const fetchActiveChallenges = async () => {
        const response: Response = await fetch(activeChallengesQuery());
        if (response.ok) {
            const data = (await response.json()).challenges as Array<IActiveChallenge>;
            setState({ ...state, challenges: data });
        }
    };

    const startChallenge = (id: string): Promise<Response> => {
        return fetch(startChallengeQuery(id));
    };

    const cancelChallenge = (id: string): Promise<Response> => {
        return fetch(cancelChallengeQuery(id));
    };

    useEffect(() => {
        if (hasError) {
            Alert.alert(
                "Error",
                "There was an error while loading the data",
                [
                    {
                        text: "Retry",
                        onPress: async () => {
                            setIsLoading(true);
                            await fetchData();
                            setIsLoading(false);
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }, [hasError]);

    const createMonthlySummary = () => {
        const currentMonthKey = getKeyForMonth(consideredMonth);
        const transactionSummary = transactionSummaries[currentMonthKey];
        if (transactionSummary) {
            const categorizedSummary = createCategorizedSummary(transactionSummary);
            const lastMonths = getTransactionsLastMonth(moment(consideredMonth));
            setMonthlySummary({
                transactionSummary,
                categorizedSummary,
                lastMonths
            });
        }
    };

    const createCategorizedSummary = (transactionSummary: ITransactionSummary): ICategorizedSummary => {
        if (transactionSummary.transactions) {
            const categorizedTransactions = Object.values(categories).reduce(
                (mapping: ICategorizedSummary, category: ICategory) => ({
                    ...mapping,
                    [category.ID]: {
                        transactions: new Array<ITransaction>(),
                        CO2Score: 0,
                        spendings: 0
                    }
                }),
                {}
            );
            transactionSummary.transactions.forEach((tx: ITransaction) => {
                const relatedCategory = categorizedTransactions[tx.mcc!.category_ID!];
                relatedCategory.transactions.push(tx);
                relatedCategory.spendings += tx.amount;
                relatedCategory.CO2Score += tx.CO2Score!;
                categorizedTransactions[tx.mcc!.category_ID!] = relatedCategory;
            });
            return categorizedTransactions;
        }
        return {};
    };

    const getTransactionsLastMonth = (startMonth: Moment, amount: number = 8) => {
        const monthlyTransactions: Array<ITransactionSummary> = [];
        for (let i = 0; i < amount; i++) {
            const properMonth = moment(startMonth).subtract(i, "month");
            const keyForMonth = getKeyForMonth(properMonth);
            const summaryToAdd =
                transactionSummaries[keyForMonth] !== undefined
                    ? transactionSummaries[keyForMonth]
                    : { transactions: new Array<ITransaction>(), CO2Score: 0, spendings: 0 };
            monthlyTransactions.push(summaryToAdd);
        }
        return monthlyTransactions.reverse();
    };

    const getKeyForMonth = (date: Moment) => {
        return (date.year() * 12 + date.month()).toString();
    };

    const getCurrentKey = () => {
        return getKeyForMonth(consideredMonth);
    };

    const getCategories = () => {
        return Object.values(categories);
    };

    const getCategoryById = (categoryId: string) => {
        return categories[categoryId];
    };

    const getHabitCategories = (): Array<IHabitCategory> => {
        return habitCategories;
    };

    const getChallenges = (): Array<IChallenge> => {
        return challenges;
    };

    const getForecast = (): number => {
        return forecast || 0;
    };

    return (
        <AccountContext.Provider
            value={{
                state,
                isLoading,
                monthlySummary,
                getConsideredMonth,
                setConsideredMonth,
                getCurrentKey,
                isChangingMonth,
                getCategories,
                getChallenges,
                getForecast,
                getCategoryById,
                getHabitCategories,
                startChallenge,
                cancelChallenge,
                fetchActiveChallenges,
                setHabit,
                fetchAccountData
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};

export { AccountProvider, AccountContext };
