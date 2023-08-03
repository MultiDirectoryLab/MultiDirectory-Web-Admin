export class TokenStorageHelper {
    static clear() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    static getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    static setAccessToken(token: string) {
        localStorage.setItem('access_token', token);
    }

    static setRefreshToken(token: string) {
        localStorage.setItem('refresh_token', token);
    }
}