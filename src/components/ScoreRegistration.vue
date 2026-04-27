<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { guardarPuntuacion } from '../services/ranking'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  gameName: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const playerName = ref('')
const roomName = ref('')
const scoreSaved = ref(false)
const isSaving = ref(false)
const saveError = ref(null)

const handleSaveScore = async () => {
  if (!playerName.value.trim()) return
  
  isSaving.value = true
  saveError.value = null
  
  try {
    // Nota: El campo 'juego' es opcional, si no has actualizado el SQL 
    // puedes quitarlo o simplemente enviarlo (Supabase ignorará campos extra si no existen, 
    // a menos que tengas RLS muy estricto).
    const result = await guardarPuntuacion(
      playerName.value, 
      Math.round(props.score), 
      roomName.value
    )
    
    if (result) {
      scoreSaved.value = true
    } else {
      saveError.value = "No se pudo guardar. Verifica tu conexión o el SQL de Supabase."
    }
  } catch (err) {
    saveError.value = "Error de conexión"
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="registration-container">
    <div class="registration-box" v-if="!scoreSaved">
      <h4>🏆 ¡Registra tu puntuación!</h4>
      <p class="score-display">Puntaje a guardar: <strong>{{ Math.round(score) }} px</strong></p>
      
      <div class="form-group">
        <label>Tu Nombre o Apodo</label>
        <input v-model="playerName" placeholder="Ej: Juan Pérez" class="input-field" />
        
        <label>Nombre de la Sala / Grupo</label>
        <input v-model="roomName" placeholder="Ej: Sala A (opcional)" class="input-field" />
      </div>

      <p v-if="saveError" class="error-msg">{{ saveError }}</p>
      
      <button @click="handleSaveScore" :disabled="isSaving || !playerName" class="btn-save">
        {{ isSaving ? 'Guardando...' : 'Guardar en el Ranking' }}
      </button>
    </div>

    <div class="registration-success" v-else>
      <div class="success-icon">✅</div>
      <p>¡Tu puntuación ha sido registrada!</p>
      <button @click="router.push('/ranking')" class="btn-view-ranking">Ver Tabla de Líderes</button>
    </div>
  </div>
</template>

<style scoped>
.registration-container {
  margin: 2rem 0;
  width: 100%;
}

.registration-box {
  background: #f0f9ff;
  padding: 1.5rem;
  border-radius: 20px;
  border: 2px solid #bae6fd;
  text-align: left;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.registration-box h4 {
  margin-top: 0;
  color: #0369a1;
  font-size: 1.3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
}

.score-display {
  text-align: center;
  color: #0c4a6e;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  margin-left: 0.5rem;
}

.input-field {
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  outline: none;
  background: white;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

.btn-save {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: 0.2s;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(2, 132, 199, 0.4);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.registration-success {
  background: #dcfce7;
  padding: 2rem;
  border-radius: 20px;
  border: 2px solid #bbf7d0;
  text-align: center;
  color: #166534;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

.success-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.registration-success p {
  font-weight: 800;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.btn-view-ranking {
  background: #166534;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  transition: 0.2s;
}

.btn-view-ranking:hover {
  background: #14532d;
  transform: scale(1.05);
}

.error-msg {
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-align: center;
}
</style>
