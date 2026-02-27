import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from './mobx/authStore';
import { getCurrentUser, confirmSignUp } from 'aws-amplify/auth';
import {
    signIn,
    signOut,
    signUp,
    submitChallengeAnswer,
} from './auth/authServices';

const App = () => {
    const {
        view,
        error,
        currentUser,
        email,
        password,
        confirmationCode,
        challengeTriggerType,
        securityQuestion,
        customAnswer,
        cipherText,
        cipherKey,
    } = authStore;

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const user = await getCurrentUser();
            console.log('>>> User found:', user);
            authStore.currentUser = user;
            authStore.view = 'loggedIn';
        } catch (err) {
            console.log('No user signed in');
            authStore.currentUser = null;
        }
    };

    const handleCustomChallenge = (stepResult: any) => {
        const info = stepResult.nextStep.additionalInfo || {};
        const triggerType = info.triggerType || 'VERIFY_SECURITY_QUESTION';

        authStore.challengeTriggerType = triggerType;

        if (triggerType === 'SETUP_SECURITY_QUESTION') {
            authStore.securityQuestion = "What is your pet's name?";
        } else if (triggerType === 'VERIFY_SECURITY_QUESTION') {
            authStore.securityQuestion = info.questionLabel;
        } else if (triggerType === 'CAESAR_CIPHER') {
            authStore.cipherText = info.cipherText;
            authStore.cipherKey = info.cipherKey;
        }

        authStore.customAnswer = ''; // Reset answer
        authStore.view = 'challenge';
    };

    // --- Handlers (Business Logic) ---

    const handleSignIn = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        authStore.error = '';

        try {
            const result = await signIn(email, password);

            if (result && result.isSignedIn) {
                await checkUser();
            } else if (
                result.nextStep.signInStep ===
                'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
            ) {
                handleCustomChallenge(result);
            } else {
                console.log('Sign in next step:', result?.nextStep);
            }
        } catch (error: any) {
            authStore.error = error.message || JSON.stringify(error);
        }
    };

    const handleSignUp = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        authStore.error = '';

        try {
            const result = await signUp(email, password);
            if (result && result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                authStore.view = 'confirm';
            } else if (result && result.isSignUpComplete) {
                authStore.view = 'signIn';
            }
        } catch (error: any) {
            authStore.error = error.message || JSON.stringify(error);
        }
    };

    const handleConfirm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        authStore.error = '';

        try {
            await confirmSignUp({
                username: email,
                confirmationCode: confirmationCode,
            });
            authStore.view = 'signIn';
        } catch (error: any) {
            authStore.error = error.message || JSON.stringify(error);
        }
    };

    const handleChallengeSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        authStore.error = '';

        try {
            let result;
            if (challengeTriggerType === 'SETUP_SECURITY_QUESTION') {
                result = await submitChallengeAnswer(customAnswer, {
                    securityQuestion: securityQuestion,
                });
            } else {
                // For VERIFY_SECURITY_QUESTION and CAESAR_CIPHER, we just send the answer
                result = await submitChallengeAnswer(customAnswer);
            }

            if (result.isSignedIn) {
                await checkUser();
                authStore.view = 'loggedIn';
                authStore.customAnswer = '';
            } else if (
                result.nextStep.signInStep ===
                'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
            ) {
                handleCustomChallenge(result);
            } else {
                authStore.error = 'Authentication failed or incomplete.';
            }
        } catch (error: any) {
            authStore.error = error.message || JSON.stringify(error);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        authStore.currentUser = null;
        authStore.view = 'signIn';
    };

    return (
        <div className="App" style={{ padding: '20px' }}>
            <h1>Cognito Auth</h1>
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}

            {view === 'loggedIn' && (
                <div>
                    <h2>Welcome, {currentUser?.username}</h2>
                    {currentUser && (
                        <div>
                            <h3>Attributes:</h3>
                            <pre>{JSON.stringify(currentUser, null, 2)}</pre>
                        </div>
                    )}
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            )}

            {view === 'signIn' && (
                <form onSubmit={handleSignIn}>
                    <h2>Sign In</h2>
                    <input
                        type="email"
                        placeholder="Email (Username)"
                        value={email}
                        onChange={(e) => (authStore.email = e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => (authStore.password = e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Sign In</button>
                    <p>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => (authStore.view = 'signUp')}
                        >
                            Sign Up
                        </button>
                    </p>
                </form>
            )}

            {view === 'signUp' && (
                <form onSubmit={handleSignUp}>
                    <h2>Sign Up</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => (authStore.email = e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => (authStore.password = e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Sign Up</button>
                    <p>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => (authStore.view = 'signIn')}
                        >
                            Sign In
                        </button>
                    </p>
                </form>
            )}

            {view === 'confirm' && (
                <form onSubmit={handleConfirm}>
                    <h2>Confirm Sign Up</h2>
                    <p>Enter the code sent to your email ({email}).</p>
                    <input
                        type="text"
                        placeholder="Confirmation Code"
                        value={confirmationCode}
                        onChange={(e) =>
                            (authStore.confirmationCode = e.target.value)
                        }
                        required
                    />
                    <br />
                    <button type="submit">Confirm</button>
                    <button
                        type="button"
                        onClick={() => (authStore.view = 'signIn')}
                    >
                        Back to Sign In
                    </button>
                </form>
            )}

            {view === 'challenge' && (
                <form onSubmit={handleChallengeSubmit}>
                    <h2>
                        {challengeTriggerType === 'SETUP_SECURITY_QUESTION' &&
                            'Set Up Security'}
                        {challengeTriggerType === 'VERIFY_SECURITY_QUESTION' &&
                            'Security Check'}
                        {challengeTriggerType === 'CAESAR_CIPHER' &&
                            'Caesar Cipher Challenge'}
                    </h2>

                    {challengeTriggerType === 'SETUP_SECURITY_QUESTION' && (
                        <>
                            <input
                                type="text"
                                placeholder="e.g. What is your pet's name?"
                                value={securityQuestion}
                                onChange={(e) =>
                                    (authStore.securityQuestion =
                                        e.target.value)
                                }
                                required
                                style={{ width: '300px', marginBottom: '10px' }}
                            />
                            <br />
                        </>
                    )}

                    {challengeTriggerType === 'VERIFY_SECURITY_QUESTION' && (
                        <p>{securityQuestion}</p>
                    )}

                    {challengeTriggerType === 'CAESAR_CIPHER' && (
                        <div>
                            <p>
                                <strong>Decrypt this text:</strong> {cipherText}
                            </p>
                            <p>
                                <strong>Shift Key:</strong> {cipherKey}
                            </p>
                            <p>
                                <em>
                                    (Move each letter forward by {cipherKey}{' '}
                                    positions)
                                </em>
                            </p>
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder={
                            challengeTriggerType === 'CAESAR_CIPHER'
                                ? 'Decrypted Answer'
                                : 'Your Answer'
                        }
                        value={customAnswer}
                        onChange={(e) =>
                            (authStore.customAnswer =
                                e.target.value.toUpperCase())
                        }
                        required
                    />
                    <br />
                    <button type="submit">Submit Answer</button>
                    <button
                        type="button"
                        onClick={() => (authStore.view = 'signIn')}
                    >
                        Back to Sign In
                    </button>
                </form>
            )}
        </div>
    );
};

export default observer(App);
