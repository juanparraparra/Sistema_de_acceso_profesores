<template>
  <header id="app-navbar" class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand & Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <GraduationCap class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                Portal Docente
              </h1>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 tracking-wide">
                Vue 3 + Node
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium">Autenticación & Persistencia MongoDB</p>
          </div>
        </div>

        <!-- Right Side: DB Badge & Auth Profile -->
        <div class="flex items-center gap-3">
          <!-- MongoDB Status Indicator -->
          <div 
            id="mongo-status-badge"
            class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-slate-50 border-slate-200 text-xs font-medium text-slate-700"
            :title="`MongoDB: ${dbStatus?.database || 'profesores_db'}`"
          >
            <Database class="w-3.5 h-3.5 text-emerald-600" />
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-semibold text-slate-800">MongoDB:</span>
            <span class="text-emerald-700 font-mono">{{ dbStatus?.mode === 'MONGODB_ATLAS' ? 'Atlas' : 'Activo' }}</span>
            <span class="text-slate-400 text-[11px]">({{ dbStatus?.totalDocuments ?? '...' }} docs)</span>
          </div>

          <!-- User State -->
          <div v-if="currentUser" class="flex items-center gap-2">
            <div class="hidden sm:flex flex-col text-right">
              <span class="text-xs font-bold text-slate-800 leading-tight">{{ currentUser.nombre }}</span>
              <span class="text-[11px] text-emerald-700 font-medium leading-tight">{{ currentUser.area }}</span>
            </div>
            <button
              id="btn-logout"
              @click="$emit('logout')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span class="text-xs text-slate-500 hidden sm:inline">Sin sesión activa</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { GraduationCap, Database, LogOut } from 'lucide-vue-next';
import { Profesor, DBStatus } from '../types';

defineProps<{
  currentUser: Profesor | null;
  dbStatus: DBStatus | null;
}>();

defineEmits<{
  (e: 'logout'): void;
}>();
</script>
