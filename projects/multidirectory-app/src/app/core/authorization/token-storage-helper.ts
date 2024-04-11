export class TokenStorageHelper {
    static getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (!!parts && parts.length === 2) {
             const cookie= parts.pop();
             if(cookie) {
                return cookie.split(';').shift();
             }
        }
        return '';
    }

    static setCookie(cname: string, cvalue: string, exdays: number) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static clear() {
        TokenStorageHelper.setCookie('access_token', '', -1)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    static getAccessToken(): string | null {
        const cookieToken = this.getCookie('access_token')
        if(cookieToken) {
            return cookieToken;
        }
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