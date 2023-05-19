# Preparatory Steps

Please clone this repository [SAP-samples/smart-co2nverter-ai](https://github.com/SAP-samples/smart-co2nverter-ai) to further proceed if not done yet. To configure and deploy, kindly copy the `.sample` files as listed below and remove the `.sample` extension from each file:

- `src/api/mta.yaml.sample` &rarr; `src/api/mta.yaml`
- `src/api/package.json.sample` &rarr; `src/api/package.json`
- `src/api/.cdsrc-private.json.sample` &rarr; `src/api/.cdsrc-private.json`
- `src/mobile-app/app.json.sample` &rarr; `src/mobile-app/app.json`

Those renamed files will be refered to throughout the steps to enter personal configuration details.

Make sure that all necessary entitlements are set on the Subaccount you want to deploy the CAP backend to and [add the remaining entitlements](https://developers.sap.com/tutorials/cp-cf-entitlements-add.html) if missing:

- SAP BTP, Cloud Foundry Runtime
- SAP HANA Cloud (and create a database)
- Destination
- SAP Authorization and Trust Management Service
