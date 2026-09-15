<template>
  <div id="vue-app-root" class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <!-- Navbar -->
    <Navbar 
      :current-user="currentUser" 
      :db-status="dbStatus" 
      @logout="handleLogout" 
    />

    <!-- Main Content Container -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 1. Interactive 5-Step Flow Diagram (Reproducing user requirement) -->
      <FlowDiagram />

      <!-- 2. Test Navigation Tabs (A. Registro, B. Login, C. Ruta protegida, MongoDB) -->
      <div class="flex items-center justify-between border-b border-slate-200 mb-8 overflow-x-auto gap-2 pb-px">
        <nav class="flex space-x-2 sm:space-x-4" aria-label="Tabs">
          <!-- Tab: Login (Prueba B) -->
          <button
            id="tab-btn-login"
            type="button"
            @click="activeTab = 'login'"
            :class="[
              'py-2.5 px-3.5 sm:px-4 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap',
              activeTab === 'login'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            ]"
          >
            <LogIn class="w-4 h-4" />
            <span>Login de Profesor</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Prueba B
            </span>
          </button>

          <!-- Tab: Registro (Prueba A) -->
          <button
            id="tab-btn-register"
            type="button"
            @click="activeTab = 'register'"
            :class="[
              'py-2.5 px-3.5 sm:px-4 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap',
              activeTab === 'register'
                ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            ]"
          >
            <UserPlus class="w-4 h-4" />
            <span>Registro de Profesor</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Prueba A
            </span>
          </button>

          <!-- Tab: Ruta Protegida (Prueba C) -->
          <button
            id="tab-btn-protected"
            type="button"
            @click="activeTab = 'protected'"
            :class="[
              'py-2.5 px-3.5 sm:px-4 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap',
              activeTab === 'protected'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            ]"
          >
            <ShieldCheck class="w-4 h-4" />
            <span>Vista Protegida /api/users/me</span>
            <span 
              :class="[
                'text-[10px] px-1.5 py-0.5 rounded font-mono font-bold',
                currentUser ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              ]"
            >
              Prueba C
            </span>
          </button>

          <!-- Tab: Verificación MongoDB -->
          <button
            id="tab-btn-mongo"
            type="button"
            @click="activeTab = 'mongo'"
            :class="[
              'py-2.5 px-3.5 sm:px-4 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap',
              activeTab === 'mongo'
                ? 'border-slate-800 text-slate-900 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            ]"
          >
            <Database class="w-4 h-4" />
            <span>Colección MongoDB</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Docs
            </span>
          </button>
        </nav>
      </div>

      <!-- 3. Dynamic Tab Content -->
      <div>
        <!-- Login Form (Prueba B) -->
        <div v-if="activeTab === 'login'">
          <LoginForm 
            @login-success="onLoginSuccess" 
            @switch-to-register="activeTab = 'register'" 
          />
        </div>

        <!-- Register Form (Prueba A) -->
        <div v-else-if="activeTab === 'register'">
          <RegisterForm 
            @register-success="onRegisterSuccess" 
            @switch-to-login="activeTab = 'login'" 
            @verify-mongo="activeTab = 'mongo'"
          />
        </div>

        <!-- Protected Dashboard (Prueba C) -->
        <div v-else-if="activeTab === 'protected'">
          <div v-if="!currentUser" class="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
              <Lock class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-800">Ruta Protegida por Token JWT</h3>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              Debe registrarse o iniciar sesión primero para generar el token y acceder a los datos del profesor en 
              <code class="px-1.5 py-0.5 bg-slate-100 font-mono font-bold text-slate-700">/api/users/me</code>.
            </p>
            <div class="mt-5 flex gap-2 justify-center">
              <button
                @click="activeTab = 'login'"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Iniciar Sesión (Login)
              </button>
              <button
                @click="activeTab = 'register'"
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Crear Cuenta (Registro)
              </button>
            </div>
          </div>
          <ProtectedDashboard 
            v-else 
            @view-mongo="activeTab = 'mongo'" 
          />
        </div>

        <!-- MongoDB Collection Inspector -->
        <div v-else-if="activeTab === 'mongo'">
          <MongoInspector />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="font-medium text-slate-700">Flujo completo: Vue.js ↔ Express.js ↔ MongoDB (BSON & JWT)</span>
        </div>
        <div class="flex items-center gap-4 text-slate-400 text-[11px]">
          <span>Endpoint: <code class="text-slate-600 font-mono">/api/users/me</code></span>
          <span>•</span>
          <span>Hash: <code class="text-slate-600 font-mono">bcryptjs</code></span>
          <span>•</span>
          <span>Auth: <code class="text-slate-600 font-mono">JWT Bearer</code></span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LogIn, UserPlus, ShieldCheck, Database, Lock } from 'lucide-vue-next';
import Navbar from './components/Navbar.vue';
import FlowDiagram from './components/FlowDiagram.vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import ProtectedDashboard from './components/ProtectedDashboard.vue';
import MongoInspector from './components/MongoInspector.vue';
import { api, authStorage } from './services/api';
import { Profesor, DBStatus, AuthResponse } from './types';

const activeTab = ref<'login' | 'register' | 'protected' | 'mongo'>('login');
const currentUser = ref<Profesor | null>(null);
const dbStatus = ref<DBStatus | null>(null);

function onLoginSuccess(res: AuthResponse) {
  if (res.user) {
    currentUser.value = res.user;
    activeTab.value = 'protected';
  }
}

function onRegisterSuccess(res: AuthResponse) {
  if (res.user) {
    currentUser.value = res.user;
    activeTab.value = 'protected';
  }
}

function handleLogout() {
  authStorage.clear();
  currentUser.value = null;
  activeTab.value = 'login';
}

async function loadDBStatus() {
  try {
    const status = await api.getDatabaseStatus();
    dbStatus.value = status;
  } catch (e) {
    console.error('Error fetching DB status:', e);
  }
}

onMounted(() => {
  // Check if session exists in localStorage
  const savedUser = authStorage.getUser();
  const token = authStorage.getToken();
  if (token && savedUser) {
    currentUser.value = savedUser;
  }
  loadDBStatus();
});
</script>
