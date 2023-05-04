![architecture](./assets/architecture.png)

TODO

## Core Application

- describing the core parts of the smart converter

### SAP BTP, Cloud Foundry Runtime

- runtime where backend (CAP) is deployed on

### SAP Cloud Application Programming (CAP)

- remove typo in architecture ("Programm")
- backend part which connects the dots
- defines data model (link to next card)
- calculation of co2 scores
  - Connect Earth
- challenges & equivalencies
  - Connect Earth
- ai features
  - via destination service to AI Core/OpenAI Service

### SAP Cloud Identity Service

- needed for destination service

### SAP HANA Cloud

- holds the data...

### React Native Application

- actual user interface to interact with the backend as mobile application

### SAP Destination Service

- proxy to resolve connections to AI Core/OpenAI Services and Connect Earth

### Business Application Studio

- used for development of CAP and deployment
- easy to use in combination with cloud foundry and btp services

## AI

- ai parts like suggestions, summarization etc.

### SAP BTP, AI Core

- summarize tutorial of reference architecture and why ai core is used

### SAP BTP, AI Launchpad

- ui to inspect and monitor ai core deployments

### Microsoft Azure with OpenAI Service

- gpt deployment on azure for enterprise

## Connect Earth

- api to get co2 factors, challenges, suggestions and equivalencies
