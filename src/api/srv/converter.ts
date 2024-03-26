import cds, { ApplicationService } from "@sap/cds";
import { Request } from "@sap/cds/apis/services";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { ConverterService as cs } from "./types/entities";

// AI LAUNCHPAD RESOURCES
const RESOURCE_GROUP_ID = cds.env.requires["GENERATIVE_AI_HUB"]["RESOURCE_GROUP_ID"];
const DEPLOYMENT_ID = cds.env.requires["GENERATIVE_AI_HUB"]["DEPLOYMENTS"]["CHAT_COMPLETION_ID"];
interface MCCHabitMapping {
    [mccId: string]: string;
}
export class ConverterService extends ApplicationService {
    async init(): Promise<void> {
        await super.init();
        this.on(cs.FuncGetEquivalencies.name, this.getEquivalencies);
        this.on(cs.ActionAiProxy.name, this.aiProxy);
        this.on(cs.ActionGenerateSuggestions.name, this.generateSuggestions);
        this.on(cs.ActionGenerateCategorizedSummary.name, this.generateCategorizedSummary);
        this.on(cs.ActionGenerateHistoricalSummary.name, this.generateHistoricalSummary);
        this.on(cs.ActionStartChallenge.name, this.startChallenge);
        this.on(cs.ActionCancelChallenge.name, this.cancelChallenge);
        this.on(cs.ActionCompleteChallenge.name, this.completeChallenge);
        this.on(cs.ActionSetHabit.name, this.setHabit);
        this.on(cs.ActionAskForComposition.name, this.askForComposition);
        this.on(cs.ActionAskForGreenContract.name, this.askForGreenContract);
        this.on(cs.ActionAskForChallengeBenefits.name, this.askForChallengeBenefits);
        this.on(cs.ActionAskForHabitRecommendation.name, this.askForHabitRecommendation);
        this.on(cs.FuncGetAccountData.name, this.getAccountData);
    }

    /**
     * Action forwarding prompt to Azure OpenAI services through SAP AI Core provided proxy
     *
     * @param {Request} req
     * @returns GPTTextResponse { text : string }
     */
    private aiProxy = async (req: Request): Promise<{ text: string } | undefined> => {
        const { prompt } = req.data;
        const response = await this.callAIProxy(prompt);
        return { text: response["choices"][0].message.content };
    };

    /**
     * Forwards prompt of the payload via a destination (mapped as AICoreAzureOpenAIDestination) through an SAP AI Core deployed service to Azure OpenAI services
     *
     * @param {string} prompt
     * @returns raw response from Azure OpenAI services for Completions (see https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference#example-response-2)
     */
    private callAIProxy = async (prompt: string): Promise<any | undefined> => {
        const openai = await cds.connect.to("AICoreAzureOpenAIDestination");
        const payload = {
            messages: [
                { role: "system", content: "Assistant is a large language model trained by OpenAI" },
                { role: "user", content: prompt }
            ]
        };
        // @ts-ignore
        const response = await openai.send({
            // @ts-ignore
            query: "POST /v2/chat-completion",
            data: payload
        });
        return response;
    };

    private callLargeLanguageModelDestination = async (prompt: string) => {
        try {
            const aiCore = await cds.connect.to("GENERATIVE_AI_HUB_DESTINATION");
            const payload = {
                messages: [
                    {
                        role: "system",
                        content: "Answer the questions to the human generated prompt"
                    },
                    { role: "user", content: prompt }
                ]
            };
            console.log(payload);
            const response = await aiCore.send({
                //@ts-ignore
                query: `POST /inference/deployments/${DEPLOYMENT_ID}/chat/completions?api-version=2023-05-15`,
                data: payload,
                headers: {
                    "Content-Type": "application/json",
                    "AI-Resource-Group": RESOURCE_GROUP_ID
                }
            });
            return (response["choices"][0].message.content || "").trim();
        } catch (error) {
            console.error(error);
            return "Something went wrong";
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
        const response = await this.callLargeLanguageModelDestination(prompt);
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
        const response = await this.callLargeLanguageModelDestination(prompt);
        return { text: response } as cs.ActionGenerateHistoricalSummaryReturn;
    };

    private askForComposition = async (req: Request): Promise<cs.ActionAskForCompositionReturn> => {
        const { name, contract, address, provider } = req.data as cs.ActionAskForCompositionParams;
        const prompt = `Write an email with the following purpose: ask my energy provider ${provider} about my current contract, how much of the electricity is renewable. Keep it short but polite. Address the provider in a neutral form, not by name.
        In the email, use the following placeholders: ${name} for my name, ${contract} for my contract number, ${address} for my address, no more.`;
        const response = await this.callLargeLanguageModelDestination(prompt);
        return { text: response } as cs.ActionAskForCompositionReturn;
    };
    private askForGreenContract = async (req: Request): Promise<cs.ActionAskForGreenContractReturn> => {
        const { name, contract, address, provider } = req.data as cs.ActionAskForCompositionParams;
        const prompt = `Write an email with the following purpose: ask my energy provider ${provider} about my current contract for an alternate more environmental friendly contract for electricity. Keep it short but polite. Address the provider in a neutral form, not by name.
        In the email, use the following placeholders: ${name} for my name, ${contract} for my contract number, ${address} for my address, no more.`;
        const response = await this.callLargeLanguageModelDestination(prompt);
        return { text: response } as cs.ActionAskForGreenContractReturn;
    };

    private askForChallengeBenefits = async (req: Request): Promise<cs.ActionAskForChallengeBenefitsReturn> => {
        const { title, description, avoidableEmissionsPerDay } = req.data as cs.ActionAskForChallengeBenefitsParams;
        const prompt = `Generate a motivation for a ${title} to reduce co2 emissions. The challenge covers the following by avoiding ${avoidableEmissionsPerDay} kg co2 per fullfilled day: ${description}. Why should I do this challenge?`;
        const response = await this.callLargeLanguageModelDestination(prompt);
        return { text: response } as cs.ActionAskForChallengeBenefitsReturn;
    };

    private askForHabitRecommendation = async (req: Request): Promise<cs.ActionAskForHabitRecommendationReturn> => {
        const { question, currentHabit, habitSummaries } = req.data as cs.ActionAskForHabitRecommendationParams;
        let prompt = `Imagine a user gets asked the following question: ${question}
The following options are avaialble:
Option | Habit | Percentage of CO2 consumption compared to default habit
-----+-------+---\n`;

        habitSummaries.forEach(({ option, context, factor }) => {
            prompt += `${option} | ${context} | ${Math.round(factor * 100)}% |\n`;
        });

        prompt += `
Give the user a summary of the options, recommendation and step by step guide in one flowing text on how its co2 emissions could be reduced, if its current habit is ${currentHabit}`;
        const response = await this.callLargeLanguageModelDestination(prompt);
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

            const response = await this.callLargeLanguageModelDestination(prompt);
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
                    ah.habit((h: any) => h("*"));
                });
            const habits = accountHabits.map((ah: cs.AccountHabits) => ah.habit!.code);
            const isVegan: boolean = habits.some((habit: cs.HabitsCode) => habit === cs.HabitsCode.VEGAN);
            const bucket: cs.EquivalenciesBucket | null = this.excludeBucket(co2);
            const filter = { bucket: { "!=": bucket }, ...(isVegan && { vegan: true }) };
            const rawEquivalencies = await SELECT.from(Equivalencies).where(filter).limit(5).orderBy("RAND()");

            const equivalencies = rawEquivalencies.map((e: cs.Equivalencies) => ({
                ID: e.ID,
                amount:
                    Math.round(co2 / e.co2PerKg) > 10
                        ? Math.round(co2 / e.co2PerKg)
                        : Math.round((co2 / e.co2PerKg) * 100) / 100,
                description: e.description,
                image: e.image
            }));
            return equivalencies;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    private excludeBucket(value: number) {
        if (value < 500) return cs.EquivalenciesBucket.XL;
        if (value > 10) return cs.EquivalenciesBucket.XS;
        return null;
    }

    /*
        CO2 Footprint inclusive user habits could be calculated using
        Connect Earth - Connect Insights API (Transaction Emissions).
        For more information follow the link to
        https://docs.connect.earth/?id=-nbsp-connect-insights-transaction-emissions
    */
    private getAccountData = async (req: Request): Promise<cs.FuncGetAccountDataReturn> => {
        const { account: accountId } = req.data as cs.FuncGetAccountDataParams;
        const { Accounts, HabitCategoriesMCC } = this.entities;

        const account: cs.Accounts = await SELECT.one
            .from(Accounts)
            .where({ ID: accountId })
            .columns((account: any) => {
                account("*");
                // expand AccountHabits
                account.habits((ah: any) => {
                    ah("*");
                    // expand Habits inside AccountHabits
                    ah.habit((h: any) => h("*"));
                });
                account.challenges((c: any) => {
                    c("*");
                    c.challenge((c: any) => c("*"));
                });
                account.transactions((t: any) => {
                    t("*");
                    t.mcc((mcc: any) => {
                        mcc("*");
                        mcc.category((category: any) => category("*"));
                    });
                });
            });

        const transactions = account.transactions;
        const offset = this.getOffsetToAddInDays();
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
                            habit.habit?.habitCategory_ID === mccHabitMapping[transaction.mcc_ID!]
                    );
                    // check the relevant personal habits, set the factor but break if any personal habit was overriden wrt a transaction
                    for (const habit of relevantAccountHabits) {
                        habitFactor = habit.habit!.factor;
                        if (habit.transaction_ID === transaction.ID) {
                            console.log("transaction based habit found");
                            break;
                        } else {
                            console.log("mcc based habit found");
                        }
                    }
                }
            } catch (e) {
                console.log("Something went wrong calculating the individual habit factor", e);
            }
            transaction.CO2Score! *= habitFactor;
            transaction.CO2Score = Math.round(transaction.CO2Score! * 100) / 100;
        }
        return account;
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

    private setHabit = async (req: Request): Promise<void> => {
        const { account, habitCategory, habit, transaction } = req.data;
        // defaults for diet and fuel habit
        const DEFAULT_HABITS = ["740fcc4f-518d-4bb0-9b69-697a38361926", "59ee24e3-3f1e-48a3-99f3-144d0dc48258"];
        const isDefault: boolean = DEFAULT_HABITS.includes(habit);
        const accountHabits = await SELECT`from carbon.AccountHabits {*, habit.habitCategory_ID}`;
        const relevantAccountHabit = accountHabits.find(
            (ah: any) =>
                ah.habitCategory_ID == habitCategory && ah.transaction_ID == transaction && ah.account_ID == account
        );
        if (!isDefault) {
            if (relevantAccountHabit) {
                await cds
                    .update(cs.Entity.AccountHabits)
                    .where({ ID: relevantAccountHabit.ID })
                    .with({ habit_ID: habit });
            } else {
                await cds.create(cs.Entity.AccountHabits, {
                    account_ID: account,
                    transaction_ID: transaction,
                    habit_ID: habit
                });
            }
        } else if (isDefault && relevantAccountHabit) {
            // delete account habit to indicate that default habit should be used in co2 calculation
            await cds.delete(cs.Entity.AccountHabits, relevantAccountHabit.ID);
        }
    };
}
