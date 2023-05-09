# Outlook & Further Steps

In this section, we want to mention some further steps which can need to be gone in order to come up with a productive implementation of smart co2nverter. Common for all of those steps is, that SAP organization and SAP BTP with its components can be of great help to execute on them.

- [Emission factors by ConnectEarth](#calculating-emission-factors)
- [Integrate Banking Transactions](#integrate-banking-transactions)
- [AI Core and OpenAI](./ai-core-openai.md)

## Calculating Emission Factors

The emission factors are the main basis for calculating the CO2 to the bankong transaction

Connect Earth provides an API called [Connect Insights API (Transaction Emissions)](https://docs.connect.earth/?id=-nbsp-connect-insights-transaction-emissions) which is our recommendation to calculate CO2 footprints including personal habits, providing Challenges and Suggestions to reduce ones footprint and also delivering Equivalencies to throw more light on the personal CO2 footprint.

Application at hand has sample factors in the data, no connection to ConnectEarch is implemented to make it runnable without partnering.

## Integrate Banking Transactions

Your banking system will need to provide the bank transactions or allow access from the Smart Co2nverter application. Here your specific Enterprise Architecture needs to be taken into account. In the following, we are just mentioning some of the relevant questions in this context, their solution will always be customer specific. But of course the solution can be well suppported by BTP and some of their components, e.g. Connectivity, Cloud Integration, DataSphere

### Technical Access Options (not limited to)

- API
- Regular export of flat files
- Existing data lake

### Architecture Aspects

- Multiple systems? Maybe current accounts and credit cards and loans might be in different systems and different formats
- Delivery of deltas instead of full data set

In case of an existing banking mobile application, those questions might already be solved for the regular banking part and the smart co2nverter can nicely sneak into the existing architecture patterns and not create any overhead, be it on the design side or at runtime.
