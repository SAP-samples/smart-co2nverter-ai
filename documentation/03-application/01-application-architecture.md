![architecture](./assets/architecture.png)

## **Core Application**

The following covers the core parts of the Smart Co2nverter application based on SAP BTP's Cloud Foundry Runtime, including the SAP Cloud Application Programming Model (CAP) backend, SAP HANA Cloud for data storage, a React Native mobile app and the SAP Destination service for resolving connections to external services.

### SAP BTP, Cloud Foundry Runtime

SAP BTP, Cloud Foundry Runtime serves for deploying SAP Cloud Application Programming Model (CAP) applications. It offers a scalable and flexible environment for running cloud-native applications, allowing developers to focus on building their applications without worrying about the underlying infrastructure.

### SAP Cloud Application Programming Model (CAP)

The SAP Cloud Application Programming Model (CAP) serves as the backend of the application and connects various components. It defines the data model and enables features such as calculating CO2 scores based on bank transactions. Additionally, it offers challenges to reduce CO2 footprint and provides equivalencies to compare CO2 footprints. The data related to CO2 scores, challenges, and equivalencies can be delivered via an API provided by Connect Earth, which is connected to the CAP backend through the destination service. AI features are also enabled through the destination service, which connects the CAP backend to AI Core and with that to Azure OpenAI Services.

### SAP Cloud Identity Service

- needed for destination service

### SAP HANA Cloud

SAP HANA Cloud is used to store the data related to transactions, accounts and personal habits, as described in [Data Model and provided Data](./03-application/02-data-model.md).

### React Native Application

- actual user interface to interact with the backend as mobile application

### SAP Destination Service

- proxy to resolve connections to AI Core/OpenAI Services and Connect Earth

### Business Application Studio

- used for development of CAP and deployment
- easy to use in combination with cloud foundry and btp services

## **AI**

- ai parts like suggestions, summarization etc.

### SAP BTP, AI Core

- summarize tutorial of reference architecture and why ai core is used

### SAP BTP, AI Launchpad

- ui to inspect and monitor ai core deployments

### Microsoft Azure with OpenAI Service

- gpt deployment on azure for enterprise

## **Connect Earth**

Connect Earth provides an API called [Connect Insights API (Transaction Emissions)](https://docs.connect.earth/?id=-nbsp-connect-insights-transaction-emissions) which is our recommendation to calculate CO2 footprints including personal habits, providing Challenges and Suggestions to reduce ones footprint and also delivering Equivalencies to throw more light on the personal CO2 footprint.
