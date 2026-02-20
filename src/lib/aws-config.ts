/**
 * AWS Amplify configuration for Cognito authentication.
 * Values from CloudFormation stack outputs (marrty-ifr31-dev).
 * Uses Vite environment variables (VITE_ prefix).
 */

import { Amplify } from "aws-amplify";

const awsConfig = {
    // API Gateway
    apiUrl: import.meta.env.VITE_API_URL || "https://e87ejp57k4.execute-api.ap-south-1.amazonaws.com/dev",

    // Cognito
    cognito: {
        userPoolId: import.meta.env.VITE_USER_POOL_ID || "",
        userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || "",
        region: "ap-south-1",
    },

    // S3
    s3: {
        bucket: import.meta.env.VITE_S3_BUCKET || "",
        region: "ap-south-1",
    },
};

// Initialize Amplify with Cognito
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: awsConfig.cognito.userPoolId,
            userPoolClientId: awsConfig.cognito.userPoolClientId,
        },
    },
});

export default awsConfig;
