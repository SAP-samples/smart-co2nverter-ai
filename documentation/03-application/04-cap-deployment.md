# Deploy CAP API to Cloud Foundry

1. Set a custom _API_KEY_ (preferably a string generated on your machine) in your `mta.yaml` which will be used as simple authorization for the React Native app (and as well during testing via an API Platform like Postman setting the _API_KEY_ as header `api-key`).

   ```yaml
   ...
   modules:
   - name: smart-converter-api-srv
      type: nodejs
      path: gen/srv
      parameters:
         buildpack: nodejs_buildpack
      build-parameters:
         builder: npm-ci
      provides:
         - name: srv-api # required by consumers of CAP services (e.g. approuter)
         properties:
            srv-url: ${default-url}
      requires:
         - name: smart-converter-api-db
         - name: smart-converter-api-auth
         - name: smart-converter-aicore-dest
      properties:
         API_KEY: <YOUR_API_KEY>
      ...
   ```

2. Via the [Clound Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) login to your Cloud Foundry space to which you want to deploy the CAP API
3. Change to the respective directory of the CAP API sample (`/api`) and deploy the API through:

   ```console
   $ npm run deploy # using NPM
   $ yarn deploy # using yarn
   ```

   If all entitlements of your SAP BTP Subaccount are set correctly, you should get the following output at the end of the deployment:

   ```console
    ...
    Application "smart-converter-api-srv" staged
    Starting application "smart-converter-api-srv"...
    Application "smart-converter-api-srv" started and available at "your-subaccount-smart-conve70da6a68.cfapps.eu10.hana.ondemand.com"
    ...
    Process finished.
    ...
   ```

Success, you made it. The CAP backend should now be available on SAP BTP, Cloud Foundry Runtime via the outputted URL. This URL will be used in the React Native application to connect to the CAP backend.

Before we can jump on this, tiny adjustments are necessary to accomplish the deployment of the CAP backend and attach the SAP BTP, AI Core deployment to it. This will be covered in the next step. For that, we will leverage an existing tutorial as a reference point to guide us through the process. Although the tutorial may use different names for the services we need to work with, the overall procedure will be the same. We can use the tutorial as a framework to understand the general steps and concepts involved and adapt the specific actions to fit the unique context of our project.
