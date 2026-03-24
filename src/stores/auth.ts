import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '../services/AuthService'
import { getAvatarUrl } from '../utils/imageUtils'
import axios from 'axios'
import axiosInstance from '../api/axios'

const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export interface User {
    [key: string]: any;
    roles?: string[];
    permissions?: string[];
    permisos?: string[];
    avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
    // MIGRACIÓN DE ALMACENAMIENTO (Limpia cachés viejas si cambias de arquitectura)
    // IMPORTANTE: Asegúrate de que esta versión sea ÚNICA para cada App Hija
    const STORAGE_VERSION = 'v3_asamblea_clean'; 

    if (localStorage.getItem('yk_storage_version') !== STORAGE_VERSION) {
        const keysToRemove = ['access_token', 'user_data', 'pkce_verifier'];
        keysToRemove.forEach(k => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
        localStorage.setItem('yk_storage_version', STORAGE_VERSION);
    }

    // --- STATE ---
    const user = ref<User | null>(JSON.parse(sessionStorage.getItem('user_data') || 'null'))
    const token = ref<string | null>(sessionStorage.getItem('access_token') || null)
    const processingSSO = ref<boolean>(false)
    const isReady = ref<boolean>(false)

    // --- GETTERS ---
    const userAvatar = computed(() => {
        return getAvatarUrl(user.value?.avatar)
    })

    // --- ACTIONS ---

    /**
     * Inicia el flujo de redirección a la Madre
     * @param {string} redirectTo URL a la que volver tras el login (opcional)
     */
    async function login(redirectTo: string | null = null): Promise<void> {
        if (processingSSO.value) return; // Evitar múltiples redirecciones
        processingSSO.value = true;
        
        if (redirectTo) {
            sessionStorage.setItem('auth_redirect_to', redirectTo);
        }
        
        await AuthService.login();
        // processingSSO se reseteará al volver del callback o en catch
    }

    async function handlePKCECallback(code: string): Promise<void> {
        const verifier = sessionStorage.getItem('pkce_verifier')
        if (!verifier) throw new Error('No se encontró el verifier PKCE')

        processingSSO.value = true
        try {
            const response = await axios.post(`${MOTHER_API_URL}/oauth/token`, {
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                code_verifier: verifier,
                code: code
            });

            token.value = response.data.access_token;
            sessionStorage.setItem('access_token', token.value as string);
            sessionStorage.removeItem('pkce_verifier');

            await fetchUser(true); // Forzar descarga de perfil limpio tras login
        } catch (error) {
            console.error('Error canjeando PKCE:', error)
            throw error
        } finally {
            processingSSO.value = false
        }
    }

    function logout(): void {
        user.value = null
        token.value = null
        isReady.value = false
        AuthService.logout()
    }

    /**
     * Obtiene usuario desde Backend LOCAL (que sincroniza JIT con la Madre)
     * @param {boolean} force Si es true, ignora la caché y descarga de nuevo
     */
    async function fetchUser(force = false): Promise<void> {
        if (!token.value) {
            isReady.value = true
            return
        }

        // Si ya tenemos el usuario cargado, no volvemos a pedirlo a menos que se fuerce
        if (!force && user.value) {
            isReady.value = true
            return
        }

        try {
            const response = await axiosInstance.get('/me')
            const userData = response.data

            user.value = userData
            sessionStorage.setItem('user_data', JSON.stringify(userData))
        } catch (error) {
            console.warn('Sesión expirada o inválida, o error al conectar con Api Local', error)
            // En caso de error 401, el interceptor de axios se encargará del logout
        } finally {
            isReady.value = true
        }
    }

    function hasPermission(permission: string): boolean {
        if (!user.value) return false

        if (user.value.roles && user.value.roles.includes('Super Admin')) return true

        const userPerms = user.value.permissions || user.value.permisos || []
        if (Array.isArray(userPerms)) {
            return userPerms.includes(permission)
        }

        return false
    }

    function hasRole(role: string): boolean {
        if (!user.value) return false
        return !!(user.value.roles && user.value.roles.includes(role))
    }

    async function checkAuth(): Promise<void> {
        await fetchUser()
    }

    return {
        user,
        token,
        processingSSO,
        isReady,
        userAvatar,
        login,
        handlePKCECallback,
        logout,
        fetchUser,
        checkAuth,
        hasPermission,
        hasRole
    }
})

