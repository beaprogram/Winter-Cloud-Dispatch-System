import {
    signUp as amplifySignUp,
    signIn as amplifySignIn,
    signOut as amplifySignOut,
    confirmSignIn as amplifyConfirmSignIn,
} from 'aws-amplify/auth';

export const signUp = async (email: string, password: string) => {
    const result = await amplifySignUp({
        username: email,
        password,
    });

    console.log('User signed up:', result);
    return result;
};

export const signIn = async (email: string, password: string) => {
    console.log('User signing in:', email, password);

    const results = await amplifySignIn({
        username: email,
        password,
        options: {
            authFlowType: 'CUSTOM_WITH_SRP',
        },
    });

    return results;
};

export const submitChallengeAnswer = async (
    answer: string,
    metadata?: Record<string, string>,
) => {
    console.log(`Submitting challenge answer: ${answer}`, metadata);
    const options = metadata ? { clientMetadata: metadata } : undefined;

    const result = await amplifyConfirmSignIn({
        challengeResponse: answer,
        options,
    });

    console.log('Challenge result:', result);
    return result;
};

export const signOut = async () => {
    await amplifySignOut();
};
