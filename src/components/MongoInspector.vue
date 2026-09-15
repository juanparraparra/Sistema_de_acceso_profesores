<template>
  <div id="mongo-inspector-view" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Prueba A: Verificación en Base de Datos
          </span>
          <span class="text-xs text-slate-500 font-mono">db.profesores.find()</span>
        </div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
          <Database class="w-6 h-6 text-emerald-600" />
          <span>Colección MongoDB: <span class="text-emerald-700 font-mono">profesores</span></span>
        </h2>
        <p class="text-xs text-slate-500 mt-1">
          Inspeccione y verifique directamente los documentos persistidos en la base de datos de MongoDB.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          id="btn-refresh-mongo-docs"
          @click="loadDocuments"
          :disabled="loading"
          class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-200"
        >
          <RefreshCw :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" />
          <span>Actualizar Colección</span>
        </button>
      </div>
    </div>

    <!-- Status Stats Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <span class="text-slate-500 font-medium block">Total de Profesores</span>
        <span class="text-lg font-black text-slate-900 mt-0.5 block font-mono">{{ documents.length }}</span>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <span class="text-slate-500 font-medium block">Base de Datos</span>
        <span class="text-sm font-bold text-emerald-800 mt-1 block font-mono truncate">{{ dbName }}</span>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <span class="text-slate-500 font-medium block">Modo de Conexión</span>
        <span class="text-xs font-bold text-slate-800 mt-1 inline-flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          {{ connMode === 'MONGODB_ATLAS' ? 'MongoDB Atlas (Remoto)' : 'MongoDB Emulado BSON (Persistente)' }}
        </span>
      </div>
    </div>

    <!-- Filter & View Controls -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="relative w-full sm:w-72">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Filtrar por nombre, correo o área..."
          class="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      <!-- View Toggle -->
      <div class="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-stretch sm:self-auto justify-center">
        <button
          type="button"
          @click="viewMode = 'cards'"
          :class="[
            'px-3 py-1 rounded text-xs font-bold transition-all',
            viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          Vista Documentos
        </button>
        <button
          type="button"
          @click="viewMode = 'json'"
          :class="[
            'px-3 py-1 rounded text-xs font-bold transition-all',
            viewMode === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          JSON / BSON Crudo
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredDocuments.length === 0 && !loading" class="text-center py-10 border border-dashed border-slate-200 rounded-xl">
      <p class="text-sm font-bold text-slate-600">No se encontraron documentos en la colección</p>
      <p class="text-xs text-slate-400 mt-1">Registre un profesor desde el formulario de registro para verlo aquí.</p>
    </div>

    <!-- Cards View -->
    <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="doc in filteredDocuments"
        :key="doc._id"
        :id="`mongo-doc-${doc._id}`"
        class="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 hover:bg-slate-50"
      >
        <!-- Document Title & _id -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 class="text-sm font-extrabold text-slate-900 leading-snug">{{ doc.nombre }}</h4>
            <span class="text-xs text-slate-500 font-mono">{{ doc.email }}</span>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono shrink-0">
            ObjectId
          </span>
        </div>

        <!-- Details -->
        <div class="space-y-1.5 mt-3 pt-3 border-t border-slate-200/70 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">_id:</span>
            <span class="font-mono font-bold text-slate-800 text-[11px] select-all">{{ doc._id }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">Área:</span>
            <span class="font-bold text-emerald-800">{{ doc.area }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">Password Hash:</span>
            <span class="font-mono text-slate-600 text-[10px] bg-slate-200/60 px-1.5 py-0.5 rounded truncate max-w-[160px]">
              {{ doc.password }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">createdAt:</span>
            <span class="text-slate-500 text-[11px] font-mono">{{ doc.createdAt }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON / BSON Raw View -->
    <div v-else class="relative">
      <pre class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 max-h-96 leading-relaxed">{{ rawJson }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Database, RefreshCw, Search } from 'lucide-vue-next';
import { api } from '../services/api';
import { MongoDocPreview } from '../types';

const documents = ref<MongoDocPreview[]>([]);
const dbName = ref<string>('profesores_db');
const connMode = ref<string>('EMBEDDED_MONGODB');
const loading = ref<boolean>(false);
const searchTerm = ref<string>('');
const viewMode = ref<'cards' | 'json'>('cards');

const filteredDocuments = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  if (!term) return documents.value;
  return documents.value.filter(
    d =>
      d.nombre.toLowerCase().includes(term) ||
      d.email.toLowerCase().includes(term) ||
      d.area.toLowerCase().includes(term) ||
      d._id.includes(term)
  );
});

const rawJson = computed(() => {
  return JSON.stringify(filteredDocuments.value, null, 2);
});

async function loadDocuments() {
  loading.value = true;
  try {
    const data = await api.getMongoDocuments();
    documents.value = data.documents;
    dbName.value = data.database;
    connMode.value = data.mode;
  } catch (err) {
    console.error('Error loading documents:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadDocuments();
});

defineExpose({
  loadDocuments,
});
</script>
