import motherApi from '@/api/axios-mother';

// Variables de entorno
const MOTHER_APP_URL = import.meta.env.VITE_MOTHER_APP_URL;

export interface UserData {
    [key: string]: any;
}

export interface TokenResponse {
    access_token: string;
    user?: UserData;
}

export default {
    /**
     * 1. INICIAR LOGIN (Navegador)
     */
    async login(): Promise<void> {
        window.location.href = `${MOTHER_APP_URL}`;
    },

    /**
     * 2. PROCESAR TOKEN DIRECTO (SSO Implícito)
     */
    processDirectToken(token: string, userData: any = null): TokenResponse {
        if (!token) throw new Error('Token no proporcionado.');

        localStorage.setItem('access_token', token);

        if (userData) {
            const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
            localStorage.setItem('user_data', JSON.stringify(user));
            return { access_token: token, user };
        }

        return { access_token: token };
    },

    /**
     * 3. OBTENER USUARIO (API Madre)
     */
    async getUser(): Promise<any> {
        const response = await motherApi.get('/api/user');
        return response.data;
    },

    /**
     * 4. LOGOUT CENTRALIZADO (Desde App Madre)
     */
    logout(): void {
        this.logoutLocal();
        window.location.href = `${MOTHER_APP_URL}/logout`;
    },

    logoutLocal(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('pkce_verifier');
    }
};
