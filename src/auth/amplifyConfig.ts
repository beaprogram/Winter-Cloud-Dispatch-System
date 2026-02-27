import { ResourcesConfig } from 'aws-amplify';

export const amplifyConfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_2JF4frJeR',
            userPoolClientId: '3mlnllhlhq7gqd22pssun2ruc6',
            loginWith: {
                email: true,
            },
        },
    },
};
