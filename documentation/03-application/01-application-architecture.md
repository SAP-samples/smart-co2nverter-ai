![architecture](./assets/architecture.png)

## **Core Application**

The following covers the core parts of the Smart Co2nverter application based on SAP BTP's Cloud Foundry Runtime, including the SAP Cloud Application Programming Model (CAP) backend, SAP HANA Cloud for data storage, a React Native mobile app and the SAP Destination service for resolving connections to external services.

### SAP BTP, Cloud Foundry runtime

SAP BTP, Cloud Foundry Runtime serves for deploying SAP Cloud Application Programming Model (CAP) applications. It offers a scalable and flexible environment for running cloud-native applications, allowing developers to focus on building their applications without worrying about the underlying infrastructure.

### SAP Cloud Application Programming Model (CAP)

The SAP Cloud Application Programming Model (CAP) serves as the backend of the application and connects various components. It defines the data model and enables features such as calculating CO2 scores based on bank transactions. Additionally, it offers challenges to reduce CO2 footprint and provides equivalencies to compare CO2 footprints. The data related to CO2 scores, challenges, and equivalencies can be delivered via an API provided by Connect Earth, which is connected to the CAP backend through the destination service. AI features are also enabled through the destination service, which connects the CAP backend to SAP AI Core and with that to Azure OpenAI Services.

### React Native Application

The React Native Application provides the actual user interface as a mobile application, allowing users to interact with the backend which facilitates features like CO2 scores, challenges and suggestions as well as equivalencies and AI.

### SAP HANA Cloud

SAP HANA Cloud is used to store the data related to transactions, accounts and personal habits, as described in [Data Model and provided Data](./03-application/02-data-model.md).

### SAP Destination Service

The Destination service lets you retrieve the backend destination details you need to resolve connections to SAP AI Core (and with that to Azure OpenAI Services) and Connect Earth. It helps to manage and simplify the communication between the backend and external services.

### SAP Cloud Identity Service

This service issues a JWT token to authenticate to the destinations service instance.

### Business Application Studio

The Business Application Studio is used for the development and deployment of the CAP backend and is designed to work seamlessly with Cloud Foundry and BTP services. It offers an easy-to-use environment for developers to build and deploy their applications to SAP Business Technology Platform.

## **AI**

These following provides an overview of the AI services used in the Smart Co2nverter project. SAP AI Core offers access to Microsoft Azure OpenAI Services and SAP AI Launchpad provides a monitoring UI. The project uses GPT-3 of Azure OpenAI Services to enable AI based features.

### SAP AI Core

With an deployment on SAP AI Core as a proxy for Azure OpenAI Services, we are able to offer API access to Microsoft Azure OpenAI Services to abstract the model API and perform additional prompt engineering, e.g. to add more context in the form of (SAP) documents or to perform input validation.

### SAP AI Launchpad

SAP AI Launchpad provides a user interface for inspecting and monitoring SAP AI Core deployments. It helps to manage and monitor the AI models deployed in the system, providing insights and analytics on their performance.

### Microsoft Azure with OpenAI Service

For the Smart Co2nverter, we leverage the capabilties of GPT-3 to e.g., generate suggestions based on the CO2 footprint or summarize the history of your CO2 emissions. In principal, we could use any LLM or similar powerful service available as an offering by one of the hyperscalers. In this case, we are referring to GPT-3 or newer instances of GPT originating from OpenAI via Azure OpenAI Services.

## **Connect Earth**

Connect Earth provides an API called [Connect Insights API (Transaction Emissions)](https://docs.connect.earth/?id=-nbsp-connect-insights-transaction-emissions) which is our recommendation to calculate CO2 footprints including personal habits, providing Challenges and Suggestions to reduce ones footprint and also delivering Equivalencies to throw more light on the personal CO2 footprint.
