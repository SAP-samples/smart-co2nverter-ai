# Deploy CAP API to Cloud Foundry

1. Add the deployment ID of the SAP BTP, AI Core based proxy for Azure OpenAI Services to the related destination in the `package.json` of CAP to the _path_.

   ```jsonc
   {
       ...
       "cds": {
           "requires": {
               ...
               "AICoreAzureOpenAIDestination": {
                   "kind": "rest",
                   "credentials": {
                       "destination": "openai-aicore-api",
                       "path": "/v2/inference/deployments/<DEPLOYMENT_ID>" // enter deployment id here
                   }
               }
           }
       }
   }
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
