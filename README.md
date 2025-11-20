# Chatbot UI

Una interfaz de chatbot moderna, responsiva y rica en funciones construida con Next.js 16, React 19 y Tailwind CSS 4. Diseñada para interactuar con LLMs locales a través de Ollama.

![Chatbot UI Screenshot](https://via.placeholder.com/800x400?text=Vista+Previa+Chatbot+UI)

## ✨ Características

- **💬 Chat en Tiempo Real**: Interacción fluida basada en texto con la IA.
- **🎙️ Entrada de Audio**: Graba y envía mensajes de voz directamente desde la interfaz.
- **🔊 Respuesta de Audio**: Soporte para reproducir respuestas de audio de la IA.
- **📁 Subida de Archivos**: Sube archivos para que la IA los procese (soporta arrastrar y soltar).
- **🎨 Diseño Moderno**:
  - UI limpia y minimalista usando **Tailwind CSS 4**.
  - Soporte para **Modo Oscuro** con detección automática.
  - Animaciones fluidas impulsadas por **Framer Motion**.
- **📝 Soporte Markdown**: Renderiza bloques de código, tablas y texto formateado de manera hermosa.
- **📱 Responsivo**: Totalmente optimizado para dispositivos de escritorio y móviles.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Librería**: [React 19](https://react.dev/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Gestión de Estado**: [Zustand](https://github.com/pmndrs/zustand)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/)
- **Runtime**: [Bun](https://bun.sh/) (recomendado) o Node.js

## 🚀 Comenzando

### Prerrequisitos

- **Node.js** (v18+ recomendado) o **Bun**.
- **Ollama** ejecutándose localmente (o un endpoint de API compatible).

### Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/chat-ui.git
   cd chat-ui
   ```

2. **Instalar dependencias:**

   ```bash
   bun install
   # o
   npm install
   ```

3. **Configuración de Entorno:**
   Crea un archivo `.env` en el directorio raíz (o renombra `.env.example` si está disponible) y configura tu endpoint de API:
   ```env
   NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
   ```

### Ejecutando la Aplicación

Inicia el servidor de desarrollo:

```bash
bun dev
# o
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📂 Estructura del Proyecto

```
src/
├── app/              # Páginas y layouts del App Router de Next.js
├── components/       # Componentes de UI reutilizables
│   ├── ui/           # Elementos básicos de UI (Botones, Inputs, etc.)
│   ├── ChatInput.tsx # Área principal de entrada (Texto, Audio, Archivo)
│   ├── ChatMessage.tsx # Componente de burbuja de mensaje
│   ├── Sidebar.tsx   # Barra lateral con historial de chat
│   └── ...
├── lib/              # Utilidades y gestión de estado (Store de Zustand)
└── styles/           # Estilos globales y configuración de Tailwind
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de enviar un Pull Request.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).
