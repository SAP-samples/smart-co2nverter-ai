namespace carbon;

using {cuid} from '@sap/cds/common';

entity Transactions : cuid {
    account          : Association to Accounts;
    currency         : String;
    amount           : Double;
    date             : Timestamp;
    description      : String;
    mcc              : Association to MCC;
    virtual CO2Score : Double default 0.0;
}

entity Challenges : cuid {
    title                    : String;
    description              : LargeString;
    icon                     : String;
    category                 : String;
    mcc                      : Association to MCC;
    daysToMark               : Integer;
    avoidableEmissionsPerDay : Double;
}

entity ChallengesUsers : cuid {
    account     :      Association to Accounts;
    challenge   :      Association to Challenges;
    startDate   :      Date;
    dueDate     :      Date;
    markedDates : many Date;
    isCompleted :      Boolean;
}

entity Equivalencies : cuid {
    vegan          : Boolean;
    bucket         : String enum {
        XS = 'XS';
        S  = 'S';
        M  = 'M';
        L  = 'L';
        XL = 'XL';
    };
    co2PerKg       : Double;
    activity       : String;
    description    : String;
    image          : String;
    virtual amount : Integer default -1;
}

entity Accounts : cuid {
    name         : String;
    transactions : Composition of many Transactions
                       on transactions.account = $self;
    challenges   : Composition of many ChallengesUsers
                       on challenges.account = $self;
    habits       : Composition of many AccountHabits
                       on habits.account = $self;
}

entity Categories : cuid {
    description : String;
    icon        : String;
    mccs        : Composition of many MCC
                      on mccs.category = $self
}

entity MCC : cuid {
    MCC         : String;
    description : String;
    factor      : Double;
    category    : Association to Categories;
}

entity HabitCategories : cuid {
    question              : String;
    additionalInformation : String;
    options               : Association to many Habits
                                on options.habitCategory = $self;
    mccs                  : Composition of many HabitCategoriesMCC
                                on mccs.habitCategory = $self;
    icon                  : String;
    category              : String;
}

entity HabitCategoriesMCC {
    key habitCategory : Association to HabitCategories;
    key mcc           : Association to MCC;
}

entity Habits : cuid {
    habitCategory         : Association to HabitCategories;
    code                  : String enum {
        VEGAN           = 'VEGAN';
        VEGETARIAN      = 'VEGETARIAN';
        PESCATARIAN     = 'PESCATARIAN';
        LOW_MEAT_EATER  = 'LOW_MEAT_EATER';
        DIET_AVERAGE    = 'DIET_AVERAGE';
        HIGH_MEAT_EATER = 'HIGH_MEAT_EATER';
        DIESEL          = 'DIESEL';
        PETROL          = 'PETROL';
        FOOD            = 'FOOD';
        ELECTRICITY     = 'ELECTRICITY';
        DEFAULT         = 'DEFAULT'
    };
    tag                   : String;
    option                : String;
    additionalInformation : String;
    factor                : Double;
    default               : Boolean
}

entity AccountHabits : cuid {
    account     : Association to Accounts;
    habit       : Association to Habits;
    transaction : Association to Transactions;
}
