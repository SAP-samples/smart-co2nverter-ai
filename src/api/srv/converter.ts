import { ApplicationService } from "@sap/cds";
import { Request } from "@sap/cds/apis/services";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { ConverterService as cs } from "./types/entities";

// PARAMETERS FOR AZURE OPENAI SERVICES
const ENGINE = "SCE_EMEA";
const MAX_TOKENS = 500;
const TEMPERATURE = 0.8;
const FREQUENCY_PENALTY = 0;
const PRESENCE_PENALTY = 0;
const TOP_P = 0.5;
const BEST_OF = 1;
const STOP_SEQUENCE: any = null;

const GPT_PARAMS = {
    engine: ENGINE,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    frequency_penalty: FREQUENCY_PENALTY,
    presence_penalty: PRESENCE_PENALTY,
    top_p: TOP_P,
    best_of: BEST_OF,
    stop: STOP_SEQUENCE
};
const READ = "READ";

interface MCCHabitMapping {
    [mccId: string]: string;
}

export class ConverterService extends ApplicationService {
    async init(): Promise<void> {
        await super.init();
        this.after(READ, cs.SanitizedEntity.Accounts, this.aggregateAccountTransactionsWithCO2Score);
        this.on(cs.FuncGetEquivalencies.name, this.getEquivalencies);
        this.on(cs.ActionAiProxy.name, this.aiProxy);
        this.on(cs.ActionGenerateSuggestions.name, this.generateSuggestions);
        this.on(cs.ActionGenerateCategorizedSummary.name, this.generateCategorizedSummary);
        this.on(cs.ActionGenerateHistoricalSummary.name, this.generateHistoricalSummary);
        this.on(cs.ActionStartChallenge.name, this.startChallenge);
        this.on(cs.ActionCancelChallenge.name, this.cancelChallenge);
        this.on(cs.ActionCompleteChallenge.name, this.completeChallenge);
        this.on(cs.ActionAskForComposition.name, this.askForComposition);
        this.on(cs.ActionAskForGreenContract.name, this.askForGreenContract);
        this.on(cs.ActionAskForChallengeBenefits.name, this.askForChallengeBenefits);
        this.on(cs.ActionAskForHabitRecommendation.name, this.askForHabitRecommendation);
    }

    private aiProxy = async (req: Request): Promise<cs.ActionAiProxyReturn> => {
        const { prompt } = req.data as cs.ActionAiProxyParams;
        const openai = await cds.connect.to("AICoreAzureOpenAIDestination");
        const payload: any = {
            ...GPT_PARAMS,
            prompt: prompt
        };

        // @ts-ignore
        const response: any = await openai.send({
            // @ts-ignore
            query: "POST /v2/completion",
            data: payload
        });
        return { text: response["choices"][0]["text"] } as cs.ActionAiProxyReturn;
    };

    private callAICoreAzureOpenAIDestination = async (prompt: string) => {
        try {
            const openai = await cds.connect.to("AICoreAzureOpenAIDestination");
            const payload: any = {
                ...GPT_PARAMS,
                prompt: prompt
            };

            // @ts-ignore
            const response: any = await openai.send({
                // @ts-ignore
                query: "POST /v2/completion",
                data: payload
            });
            return (response["choices"][0]["text"] || "").trim(); //replace(/^\s+|\s+$/g, ""); //replace leading or trailing new lines and whitespaces
        } catch (e) {
            console.error(e);
            return "Error: Something went wrong";
        }
    };

    private generateCategorizedSummary = async (req: Request): Promise<cs.ActionGenerateCategorizedSummaryReturn> => {
        const { categorizedSummary } = req.data as cs.ActionGenerateCategorizedSummaryParams;
        let prompt = `The following is a table of my CO2 consumption of the current month for different categories of spendings: 
Category | CO2 consumption in kg 
---+--- 
        `;
        // filter out zeros
        const relevantCategories = categorizedSummary.filter(({ category: _, co2 }: any) => co2 > 0);

        // generate table content inside prompt
        relevantCategories.forEach(({ category, co2 }: any) => {
            prompt += `${category} | ${co2}\n`;
        });

        prompt += `
            Tell me which category has the highest consumption.
            Also propose three measures how I could decrease the CO2 consumption fo this category.
            No table please, just a plain text which I can listen to in spoken speech and numbers rounded.`;
        const response = await this.callAICoreAzureOpenAIDestination(prompt);
        return { text: response } as cs.ActionGenerateCategorizedSummaryReturn;
    };

    private generateHistoricalSummary = async (req: Request): Promise<cs.ActionGenerateHistoricalSummaryReturn> => {
        let { historicalSummary } = req.data as cs.ActionGenerateHistoricalSummaryParams;

        let prompt = `The following is a table with my CO2 consumption in the previous months, last one is the current month:
Year | Month | CO2 consumption in kg
-----+-------+---\n`;

        historicalSummary.forEach(({ year, month, co2 }) => {
            prompt += `${year} | ${month} | ${co2} |\n`;
        });

        prompt += `
Give me a summary on how my consumption has evolved over the past months.
Then give me a trend over the last three months only.
Finally, rate my progress whether it is improving or worsening.
No table please, just a plain text which I can listen to in spoken speech and numbers rounded.

Your CO2 consumption...

The trend over the last three months...

Your progress...`;
        const response = await this.callAICoreAzureOpenAIDestination(prompt);
        return { text: response } as cs.ActionGenerateHistoricalSummaryReturn;
    };

    private askForComposition = async (req: Request): Promise<cs.ActionAskForCompositionReturn> => {
        const { name, contract, address, provider } = req.data as cs.ActionAskForCompositionParams;
        const prompt = `Write an email with the following purpose: ask my energy provider ${provider} about my current contract, how much of the electricity is renewable. Keep it short but polite. Address the provider in a neutral form, not by name.
        In the email, use the following placeholders: ${name} for my name, ${contract} for my contract number, ${address} for my address, no more.`;
        const response = await this.callAICoreAzureOpenAIDestination(prompt);
        return { text: response } as cs.ActionAskForCompositionReturn;
    };
    private askForGreenContract = async (req: Request): Promise<cs.ActionAskForGreenContractReturn> => {
        const { name, contract, address, provider } = req.data as cs.ActionAskForCompositionParams;
        const prompt = `Write an email with the following purpose: ask my energy provider ${provider} about my current contract for an alternate more environmental friendly contract for electricity. Keep it short but polite. Address the provider in a neutral form, not by name.
        In the email, use the following placeholders: ${name} for my name, ${contract} for my contract number, ${address} for my address, no more.`;
        const response = await this.callAICoreAzureOpenAIDestination(prompt);
        return { text: response } as cs.ActionAskForGreenContractReturn;
    };

    private askForChallengeBenefits = async (req: Request): Promise<cs.ActionAskForChallengeBenefitsReturn> => {
        const { title, description, avoidableEmissionsPerDay } = req.data as cs.ActionAskForChallengeBenefitsParams;
        const prompt = `Generate a motivation for a ${title} to reduce co2 emissions. The challenge covers the following by avoiding ${avoidableEmissionsPerDay} kg co2 per fullfilled day: ${description}. Why should I do this challenge?`;
        const response = await this.callAICoreAzureOpenAIDestination(prompt);
        return { text: response } as cs.ActionAskForChallengeBenefitsReturn;
    };

    private askForHabitRecommendation = async (req: Request): Promise<cs.ActionAskForHabitRecommendationReturn> => {
        const { question, currentHabit, habitSummaries } = req.data as cs.ActionAskForHabitRecommendationParams;
        let prompt = `Imagine a user gets asked the following question: ${question}
The following options are avaialble:
Option | Habit | Percentage of CO2 consumption compared to default habit
-----+-------+---\n`;

        habitSummaries.forEach(({ option, context, factor }) => {
            prompt += `${option} | ${context} | ${factor * 100}% |\n`;
        });

        prompt += `
Give the user a summary of the options, recommendation and step by step guide in one flowing text on how its co2 emissions could be reduced, if its current habit is ${currentHabit}`;
        const response = await this.callAICoreAzureOpenAIDestination(prompt);
        return { text: response } as cs.ActionAskForHabitRecommendationReturn;
    };

    private generateSuggestions = async (req: Request): Promise<cs.ActionGenerateSuggestionsReturn> => {
        try {
            const { category, spendings, CO2Score, amountOfTransactions } =
                req.data as cs.ActionGenerateSuggestionsParams;
            const prompt = `Provide 5 suggestions with a title and description (2-3 sentences) as a JSON array in the format [{"title": "", "description": "" }] without any additional text to help me reduce my CO2 footprint of ${CO2Score.toFixed(
                0
            )} kg related to ${category} (MCC parent category). My monthly spending is over ${spendings.toFixed(
                0
            )} Euro with ${amountOfTransactions} transactions. Act as a REST API with Content-Type application/json.`;

            const response = await this.callAICoreAzureOpenAIDestination(prompt);
            return JSON.parse(response) as cs.ActionGenerateSuggestionsReturn;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    /*
        Equivalencies / Similarities could be taken from
        Connect Earth - Connect Insights API (Transaction Emissions).
        For more information follow the link to
        https://docs.connect.earth/?id=-nbsp-connect-insights-transaction-emissions
    */
    private getEquivalencies = async (req: Request): Promise<cs.FuncGetEquivalenciesReturn> => {
        try {
            const { co2, account } = req.data as cs.FuncGetEquivalenciesParams;
            const { AccountHabits, Equivalencies } = this.entities;
            const accountHabits: Array<cs.AccountHabits> = await SELECT.from(AccountHabits)
                .where({ account_ID: account, transaction: null })
                .columns((ah: any) => {
                    ah("*");
                    ah.habits((h: any) => h("*"));
                });
            const habits = accountHabits.map((ah: cs.AccountHabits) => ah.habits!.code);
            const isVegan: boolean = habits.some((habit: cs.HabitsCode) => habit === cs.HabitsCode.VEGAN);
            const filter = { ...(isVegan && { vegan: true }) };
            const rawEquivalencies = await SELECT.from(Equivalencies).where(filter).limit(3).orderBy("RAND()");

            const equivalencies = rawEquivalencies.map((e: cs.Equivalencies) => ({
                ID: e.ID,
                amount: Math.round(co2 / e.co2PerKg),
                description: e.description,
                image: e.image
            }));
            return equivalencies;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    private getBucket(value: number) {
        if (value < 20) return cs.EquivalenciesBucket.XS;
        if (value < 50) return cs.EquivalenciesBucket.S;
        if (value < 200) return cs.EquivalenciesBucket.M;
        if (value < 1000) return cs.EquivalenciesBucket.L;
        return cs.EquivalenciesBucket.XL;
    }

    /*
        CO2 Footprint inclusive user habits could be calculated using
        Connect Earth - Connect Insights API (Transaction Emissions).
        For more information follow the link to
        https://docs.connect.earth/?id=-nbsp-connect-insights-transaction-emissions
    */
    private aggregateAccountTransactionsWithCO2Score = async (
        accounts: cs.Accounts | Array<cs.Accounts>,
        req: Request
    ): Promise<any> => {
        try {
            // */converter/Accounts(8fbaa8ca-6cf3-4ea4-9764-82e6b841480d)?$expand=habits,transactions($expand=mcc($expand=category;$select=ID,factor))
            if (!Array.isArray(accounts)) {
                const account = accounts;
                const transactions = account.transactions;
                const offset = this.getOffsetToAddInDays();
                if (account.transactions) {
                    const { HabitCategoriesMCC } = this.entities;
                    const accountHabits: Array<cs.AccountHabits> = account.habits;
                    const habitCategoriesMCC: Array<cs.HabitCategoriesMCC> = await SELECT.from(HabitCategoriesMCC);
                    // create mapping for MCC => HabitCategory for further O(1) access
                    const mccHabitMapping: MCCHabitMapping = habitCategoriesMCC.reduce(
                        (mapping: MCCHabitMapping, v: cs.HabitCategoriesMCC) =>
                            v.mcc_ID
                                ? {
                                      ...mapping,
                                      [v.mcc_ID!]: v.habitCategory_ID!
                                  }
                                : mapping,
                        {}
                    );

                    for (const transaction of transactions) {
                        transaction.date = moment(transaction.date).add(offset, "d").toDate();
                        let habitFactor = 1.0; // default if no habit is set
                        // check if MCC is part of any habit category
                        try {
                            if (transaction.mcc_ID! in mccHabitMapping) {
                                // filter account based habits for relevant habit categories based on MCC
                                const relevantAccountHabits: Array<cs.AccountHabits> = accountHabits.filter(
                                    (habit: cs.AccountHabits) =>
                                        habit.habits_ID === mccHabitMapping[transaction.mcc_ID!]
                                );
                                // check the relevant personal habits, set the factor but break if any personal habit was overriden wrt a transaction
                                for (const habit of relevantAccountHabits) {
                                    habitFactor = habit.habits!.factor;
                                    if (habit.transaction_ID) {
                                        console.log("transaction based habit found");
                                        break;
                                    } else {
                                        console.log("mcc based habit found", habit);
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("Something went wrong calculating the individual habit factor", e);
                        }
                        transaction.CO2Score! *= habitFactor;
                        transaction.CO2Score = Math.round(transaction.CO2Score! * 100) / 100;
                    }
                    account.transactions = transactions;
                    accounts = account;
                    req.reply(accounts);
                }
            }
        } catch (e) {
            const error: Error = e as Error;
            console.log(error.name, error.message);
        }
    };

    private getOffsetToAddInDays = () => {
        const lastTxMonth = moment("04-01-2023", "MM-DD-YYYY");
        const currentMonth = moment();
        return Math.round(currentMonth.diff(lastTxMonth, "days", true));
    };

    private startChallenge = async (req: Request): Promise<{ challengeId: string }> => {
        const CHALLENGE_DURATION = 1000 * 3600 * 24 * 30; // 30 days
        const { account, challengeId } = req.data;
        const uuid = uuidv4();
        await INSERT.into(cs.Entity.ChallengesUsers).entries({
            ID: uuid,
            account_ID: account,
            challenge_ID: challengeId,
            markedDates: "[]",
            startDate: new Date().toISOString().split("T")[0],
            // challenge due date is 30 days from today
            dueDate: new Date(Date.now() + CHALLENGE_DURATION).toISOString().split("T")[0],
            isCompleted: false
        });
        return { challengeId: uuid };
    };

    private cancelChallenge = async (req: Request): Promise<void> => {
        const { id } = req.data;
        await DELETE.from(cs.Entity.ChallengesUsers, { ID: id });
    };

    private completeChallenge = async (req: Request): Promise<void> => {
        const { id } = req.data;
        await UPDATE(cs.Entity.ChallengesUsers).where({ ID: id }).with({ isCompleted: true });
    };
}
