import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue'

// Vistas
import CallbackView from '@/views/CallbackView.vue'
import DashboardView from '@/views/DashboardView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const routes: RouteRecordRaw[] = [
    // 1. RUTAS PÚBLICAS
    {
        path: '/',
        redirect: '/admin/dashboard'
    },
    {
        path: '/callback',
        name: 'callback',
        component: CallbackView
    },
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: UnauthorizedView
    },

    // 2. RUTAS PROTEGIDAS
    {
        path: '/admin',
        component: AdminLayout,
        meta: {
            requiresAuth: true,
            permission: 'app_asamblea'
        },
        children: [
            {
                path: 'carga-datos/clientes',
                name: 'admin-carga-clientes',
                component: () => import('@/views/carga-datos/ClientesImportView.vue'),
                meta: {
                    title: 'Carga de Clientes'
                }
            },
            {
                path: 'carga-datos/colocacion',
                name: 'admin-carga-colocacion',
                component: () => import('@/views/carga-datos/ColocacionImportView.vue'),
                meta: {
                    title: 'Carga de Colocación'
                }
            },
            {
                path: 'consultas/busqueda-cliente',
                name: 'admin-busqueda-cliente',
                component: () => import('@/views/consultas/BusquedaClienteView.vue'),
                meta: {
                    title: 'Búsqueda de Cliente'
                }
            },
            {
                path: 'consultas/asistencias',
                name: 'admin-asistencia-reporte',
                component: () => import('@/views/consultas/AsistenciaReporteView.vue'),
                meta: {
                    title: 'Registro de Asistencias'
                }
            },
            {
                path: 'urnas',
                name: 'admin-urnas-gestion',
                component: () => import('@/views/admin/UrnasGestionView.vue'),
                meta: {
                    title: 'Gestión de Urnas'
                }
            },
            {
                path: 'votos/registrar',
                name: 'admin-registrar-votos',
                component: () => import('@/views/admin/RegistrarVotosView.vue'),
                meta: {
                    title: 'Registrar Votos'
                }
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardView,
                meta: {
                    title: 'Gestiones'
                }
            }
        ]
    },

    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// --- GUARDIA DE NAVEGACIÓN ---
router.beforeEach(async (to, _from) => {
    const authStore = useAuthStore()

    // 0. Callback o Unauthorized → siempre pasar
    if (to.name === 'callback' || to.name === 'unauthorized') {
        return true
    }

    const isAuthenticated = !!authStore.token

    // Caso 1: Ruta protegida sin token
    if (to.matched.some(record => record.meta.requiresAuth) || to.path === '/') {
        if (!isAuthenticated) {
            console.log('🔒 Acceso Hija: Usuario sin sesión. Iniciando flujo SSO...')
            authStore.login()
            return false
        }
    }

    // Caso 2: Usuario autenticado
    if (isAuthenticated) {
        if (!authStore.isReady) {
            try {
                await authStore.fetchUser()
            } catch {
                return false
            }
        }

        // Verificar permiso
        if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
            // const motherAppUrl =
            //     import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'

            console.warn(
                `⛔ Acceso denegado: Usuario no tiene el permiso '${to.meta.permission}'.`
            )

            // window.location.href = `${motherAppUrl}/apps`
            return false
        }

        // Verificar rol
        if (to.meta.role && !authStore.hasRole(to.meta.role)) {
            // const motherAppUrl =
            //     import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'

            console.warn(
                `⛔ Acceso denegado: Usuario no tiene el rol '${to.meta.role}'.`
            )

            // window.location.href = `${motherAppUrl}/apps`
            return false
        }
    }

    return true
})

export default router
