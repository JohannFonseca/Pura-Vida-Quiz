<script setup>
/**
 * App.vue
 * Pura Vida Quiz - aca se ve la pagina principal
 */
</script>

<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="nav-content">
        <div class="brand">Pura Vida Quiz 🇨🇷</div>
        <div class="nav-links">
          <a href="#" class="nav-btn active">Inicio</a>
          <a href="#" class="nav-btn">Jugar</a>
          <a href="#" class="nav-btn">Ranking</a>
          <a href="#" class="nav-btn">Acerca de</a>
        </div>
        <!-- Boton del menu -->
        <button class="mobile-menu-btn" aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>

    <main class="main-content">
      <div class="hero">
        <h1 class="title">¡Descubre <span class="highlight">Costa Rica!</span></h1>
        <p class="subtitle">Pon a prueba tu conocimiento sobre nuestra cultura, historia y biodiversidad en este divertido juego interactivo.</p>
        <button class="cta-button">Empezar a Jugar</button>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>Creado por Johann Fonseca</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ============================================
   Layout Principal
   ============================================ */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ============================================
   Navbar
   ============================================ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-nav);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.brand:hover {
  transform: scale(1.02);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-btn {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-btn:hover {
  color: var(--accent-green-dark);
  background-color: rgba(34, 197, 94, 0.1); /* Fondo verde */
}

.nav-btn.active {
  color: var(--accent-green-dark);
}

.nav-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 3px;
  background-color: var(--accent-green);
  border-radius: 3px 3px 0 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
}

/* ============================================
   Contenido Principal
   ============================================ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px; /* Compensa el navbar fijo */
  padding: 2rem;
}

.hero {
  text-align: center;
  max-width: 850px;
  padding: 4rem 2rem;
  background: #ffffff; /* Fondo blanco para hacer pop al texto */
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05); /* Sombra */
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--text-main);
}

.highlight {
  color: var(--accent-green-dark);
  position: relative;
  display: inline-block;
  padding: 0 0.5rem;
}

/* Efecto tipo subrayado de marcador "verde" en el texto */
.highlight::after {
  content: '';
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 100%;
  height: 30%;
  background-color: var(--accent-green-light);
  z-index: -1;
  opacity: 0.5;
  border-radius: 4px;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-button {
  background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%);
  color: #ffffff;
  border: none;
  padding: 1.25rem 3.5rem;
  font-size: 1.125rem;
  font-weight: 800;
  border-radius: 9999px; /* Forma */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(34, 197, 94, 0.4);
}

.cta-button:active {
  transform: translateY(1px);
}

/* ============================================
   Footer
   ============================================ */
.footer {
  background-color: #ffffff;
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  text-align: center;
  margin-top: auto;
}

.footer-content p {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ============================================
   Responsive (Mobile)
   ============================================ */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }
  
  .hero {
    padding: 3rem 1.5rem;
  }
}
</style>
