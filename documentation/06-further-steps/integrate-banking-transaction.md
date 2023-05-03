# Integrate Banking Transactions

TBD

Your banking system will need to provide the bank transactions or allow access from the smart co2nverter application. Here your specific Enterprise Architecture needs to be taken into account. In the following, we are just mentioning some of the relevant questions in this context, their solution will always be customer specific. But of course the solution can be well suppported by BTP and some of their components, e.g. Connectivity, Cloud Integration, DataSphere

Technical Access Options (not limited to)
- API
- Regular export of flat files
- Existing data lake

Architecture Aspects
- Multiple systems? Maybe current accounts and credit cards and loans might be in different systems and different formats
- Delivery of deltas instead of full data set

In case of an existing banking mobile application, those questions might already be solved for the regular banking part and the smart co2nverter can nicely sneak into the existing architecture patterns and not create any overhead, be it on the design side or at runtime.