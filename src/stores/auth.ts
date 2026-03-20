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
    // MIGRACIÓN DE ALMACENAMIENTO
    const STORAGE_VERSION = 'v2_pkce'; 
    if (localStorage.getItem('yk_storage_version') !== STORAGE_VERSION) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        sessionStorage.removeItem('user_data');
        localStorage.setItem('yk_storage_version', STORAGE_VERSION);
    }

    // --- STATE ---
    const user = ref<User | null>(JSON.parse(sessionStorage.getItem('user_data') || 'null'))
    const token = ref<string | null>(localStorage.getItem('access_token') || null)
    const processingSSO = ref<boolean>(false)
    const isReady = ref<boolean>(false)

    // --- GETTERS ---
    const userAvatar = computed(() => {
        return getAvatarUrl(user.value?.avatar)
    })

    // --- ACTIONS ---

    async function login(): Promise<void> {
        processingSSO.value = true
        await AuthService.login()
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
            localStorage.setItem('access_token', token.value as string);
            sessionStorage.removeItem('pkce_verifier');

            await fetchUser();
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

    async function fetchUser(): Promise<void> {
        if (!token.value) {
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

