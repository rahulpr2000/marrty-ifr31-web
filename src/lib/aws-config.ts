/**
 * AWS configuration for the Marrty IFR31 frontend.
 * Values from CloudFormation stack outputs (marrty-ifr31-dev).
 */

const awsConfig = {
    // API Gateway
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://e87ejp57k4.execute-api.ap-south-1.amazonaws.com/dev",

    // Cognito
    cognito: {
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
        region: "ap-south-1",
    },

    // S3
    s3: {
        bucket: process.env.NEXT_PUBLIC_S3_BUCKET || "",
        region: "ap-south-1",
    },
};

export default awsConfig;
