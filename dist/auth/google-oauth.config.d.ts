export declare const GSC_SCOPES: string[];
export declare const getAuthUrl: () => string;
export declare const getTokensFromCode: (code: string) => Promise<import("google-auth-library").Credentials>;
