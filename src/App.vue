<template>
  <div id="vue-app-root" class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <!-- Navbar -->
    <Navbar 
      :current-user="currentUser" 
      :db-status="dbStatus" 
      @logout="handleLogout" 
    />

    <!-- Main Content Container -->
    <main class="flex-1 flex items-center justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
      <!-- 1. Not logged in: Show Login Form (or Register toggle) -->
      <div v-if="!currentUser" class="w-full">
        <div v-if="authView === 'login'">
          <LoginForm 
            @login-success="onLoginSuccess" 
            @switch-to-register="authView = 'register'" 
          />
        </div>

        <div v-else>
          <RegisterForm 
            @register-success="onRegisterSuccess" 
            @switch-to-login="authView = 'login'" 
          />
        </div>
      </div>

      <!-- 2. Logged in: Show Protected View (/api/users/me) -->
      <div v-else class="w-full">
        <ProtectedDashboard 
          @logout="handleLogout" 
        />
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
import Navbar from './components/Navbar.vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import ProtectedDashboard from './components/ProtectedDashboard.vue';
import { api, authStorage } from './services/api';
import { Profesor, DBStatus, AuthResponse } from './types';

const authView = ref<'login' | 'register'>('login');
const currentUser = ref<Profesor | null>(null);
const dbStatus = ref<DBStatus | null>(null);

function onLoginSuccess(res: AuthResponse) {
  if (res.user) {
    currentUser.value = res.user;
  }
}

function onRegisterSuccess(res: AuthResponse) {
  if (res.user) {
    currentUser.value = res.user;
  }
}

function handleLogout() {
  authStorage.clear();
  currentUser.value = null;
  authView.value = 'login';
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
