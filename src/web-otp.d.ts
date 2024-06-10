interface OTPCredential extends Credential {
  readonly code: string
  type: `otp`
}

interface ExtendedCredentialRequestOptions extends CredentialRequestOptions {
  otp: { transport: [`sms`] }
}

declare global {
  interface CredentialsContainer {
    get(options?: ExtendedCredentialRequestOptions): Promise<OTPCredential>
  }
}

export {}
