import { makeAutoObservable } from 'mobx';
import { AuthUser } from 'aws-amplify/auth';

export type ViewState =
    | 'signIn'
    | 'signUp'
    | 'confirm'
    | 'loggedIn'
    | 'challenge';

class AuthStore {
    // User State
    currentUser: AuthUser | null = null;
    view: ViewState = 'signIn';
    error: string = '';

    // Form Data
    email: string = 'vghoghari82@gmail.com';
    password: string = 'Test123%';
    confirmationCode: string = '';

    // MFA State
    challengeTriggerType: string = '';
    securityQuestion: string = '';
    customAnswer: string = '';
    cipherText: string = '';
    cipherKey: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    resetChallengeState() {
        this.customAnswer = '';
        this.challengeTriggerType = '';
        this.securityQuestion = '';
        this.cipherText = '';
        this.cipherKey = '';
    }
}

export const authStore = new AuthStore();
