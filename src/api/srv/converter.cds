using {carbon} from '../db/carbon';

service ConverterService {


    entity Transactions    as projection on carbon.Transactions {
        *,
        amount * mcc.factor as CO2Score : Double
    }

    entity AccountHabits   as projection on carbon.AccountHabits;
    entity Accounts        as projection on carbon.Accounts;
    entity Habits          as projection on carbon.Habits;
    entity Challenges      as projection on carbon.Challenges;
    entity ChallengesUsers as projection on carbon.ChallengesUsers;

    @readonly
    entity Categories      as projection on carbon.Categories;

    @readonly
    entity MCC             as projection on carbon.MCC;

    @readonly
    entity HabitCategories as projection on carbon.HabitCategories;

    @readonly
    entity Equivalencies   as projection on carbon.Equivalencies;

    // ACTIONS & FUNCTIONS
    function getEquivalencies(co2 : Integer, account : UUID)                                                              returns array of Equivalencies;
    action   aiProxy(prompt : String)                                                                                     returns GPTAnswer;

    entity ISuggestion {
        title       : String;
        description : String;
    }

    entity IMonthlyCO2 {
        year  : String;
        month : String;
        co2   : Double;
    }

    entity ICategorizedCO2 {
        category : String;
        co2      : Double;
    }

    entity IHabitSummary {
        option  : String;
        context : String;
        factor  : Double;
    }

    entity GPTAnswer {
        text : String;
    }

    action   generateSuggestions(category : String, spendings : Double, CO2Score : Double, amountOfTransactions : Double) returns array of ISuggestion;
    action   generateCategorizedSummary(categorizedSummary : array of ICategorizedCO2)                                    returns GPTAnswer;
    action   generateHistoricalSummary(historicalSummary : array of IMonthlyCO2)                                          returns GPTAnswer;
    action   askForComposition(name : String, contract : String, address : String, provider : String)                     returns GPTAnswer;
    action   askForGreenContract(name : String, contract : String, address : String, provider : String)                   returns GPTAnswer;
    action   askForChallengeBenefits(title : String, description : String, avoidableEmissionsPerDay : String)             returns GPTAnswer;
    action   askForHabitRecommendation(question : String, currentHabit : String, habitSummaries : array of IHabitSummary) returns GPTAnswer;

    action   startChallenge(account : String, challengeId : UUID)                                                         returns {
        challengeId : String
    };

    action   cancelChallenge(id : UUID);
    action   completeChallenge(id : UUID);
    action   setHabit(account : String, habitCategory : String, habit : String, transaction : String);
}
