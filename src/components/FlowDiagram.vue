<template>
  <div id="flow-diagram-container" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-8 transition-all">
    <!-- Section Title -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
      <div>
        <span class="text-xs font-bold tracking-wider text-emerald-600 uppercase">Integración en Tiempo Real</span>
        <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <span>Frontend</span>
          <span class="text-emerald-500 font-normal">⟷</span>
          <span>Backend</span>
          <span class="text-emerald-500 font-normal">⟷</span>
          <span class="text-emerald-700">MongoDB</span>
        </h2>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Evidencia de Flujo Activo
        </span>
      </div>
    </div>

    <!-- 5-Step Flow Visualizer (Exact reproduction of the architecture in the assignment) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 relative">
      <!-- Step 1 -->
      <div 
        id="flow-step-1"
        :class="[
          'relative rounded-xl p-4 transition-all duration-300 border',
          activeStep === 1 
            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-md transform -translate-y-0.5' 
            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors',
            activeStep === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-700 text-white'
          ]">
            1
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Paso 1</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800">Profesor completa</h3>
        <p class="text-xs text-slate-500 mt-1">Formulario de registro o login en interfaz Vue</p>
      </div>

      <!-- Step 2 -->
      <div 
        id="flow-step-2"
        :class="[
          'relative rounded-xl p-4 transition-all duration-300 border',
          activeStep === 2 
            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-md transform -translate-y-0.5' 
            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors',
            activeStep === 2 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-700 text-white'
          ]">
            2
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Paso 2</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800">Vue envía JSON</h3>
        <p class="text-xs text-slate-500 mt-1">Solicitud fetch HTTP con payload estructurado</p>
      </div>

      <!-- Step 3 -->
      <div 
        id="flow-step-3"
        :class="[
          'relative rounded-xl p-4 transition-all duration-300 border',
          activeStep === 3 
            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-md transform -translate-y-0.5' 
            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors',
            activeStep === 3 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-700 text-white'
          ]">
            3
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Paso 3</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800">Express valida</h3>
        <p class="text-xs text-slate-500 mt-1">Sanitización, bcrypt hashing y verificación de middleware</p>
      </div>

      <!-- Step 4 -->
      <div 
        id="flow-step-4"
        :class="[
          'relative rounded-xl p-4 transition-all duration-300 border',
          activeStep === 4 
            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-md transform -translate-y-0.5' 
            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors',
            activeStep === 4 ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-800 text-white'
          ]">
            4
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Paso 4</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800">MongoDB guarda / consulta</h3>
        <p class="text-xs text-slate-500 mt-1">Colección "profesores" con persistencia BSON</p>
      </div>

      <!-- Step 5 -->
      <div 
        id="flow-step-5"
        :class="[
          'relative rounded-xl p-4 transition-all duration-300 border',
          activeStep === 5 
            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200 shadow-md transform -translate-y-0.5' 
            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors',
            activeStep === 5 ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-600 text-white'
          ]">
            5
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Paso 5</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800">JWT + respuesta</h3>
        <p class="text-xs text-slate-500 mt-1">Firma criptográfica entregada para proteger vistas</p>
      </div>
    </div>

    <!-- Active Telemetry Banner -->
    <div 
      v-if="latestLog" 
      id="flow-telemetry-banner"
      class="bg-slate-900 text-slate-100 rounded-xl p-3 px-4 font-mono text-xs flex items-center justify-between gap-3 shadow-inner"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold uppercase tracking-wider text-[10px]">
          Live Event
        </span>
        <span class="text-slate-300 truncate">{{ latestLog.message }}</span>
      </div>
      <span class="text-slate-400 text-[10px] shrink-0">{{ latestLog.time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { registerStepListener } from '../services/api';

const activeStep = ref<number>(1);
const latestLog = ref<{ message: string; time: string } | null>({
  message: 'Sistema listo para recibir solicitudes en Vue.js',
  time: new Date().toLocaleTimeString(),
});

let timer: any = null;

onMounted(() => {
  registerStepListener((step: number, label: string) => {
    activeStep.value = step;
    latestLog.value = {
      message: `[Paso ${step}] ${label}`,
      time: new Date().toLocaleTimeString(),
    };

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // Keep highlighted for a moment then return to neutral
    }, 4000);
  });
});

onUnmounted(() => {
  registerStepListener(null);
  if (timer) clearTimeout(timer);
});
</script>
