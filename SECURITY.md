# 🔐 Guía de Seguridad - API Keys

## ⚠️ IMPORTANTE: Protección de claves API

### ✅ Lo que DEBES hacer:

1. **Mantener las claves en `.env.local`** (ya configurado)
2. **NUNCA compartir claves en:**
   - Chats públicos
   - Código fuente
   - Repositorios de GitHub
   - Capturas de pantalla
   - Mensajes de Slack/Discord

3. **Revocar inmediatamente** cualquier clave que se haya expuesto
   - Anthropic: https://console.anthropic.com/settings/keys

### 🔄 Cómo configurar correctamente:

```bash
# 1. Copia el archivo de ejemplo
cp .env.example .env.local

# 2. Edita .env.local con tu clave real
# ANTHROPIC_API_KEY=tu-clave-real-aqui

# 3. Verifica que .env.local NO aparezca en git
git status
# .env.local NO debe aparecer en la lista
```

### 🚨 Si expusiste una clave:

1. **Revoca la clave inmediatamente** en https://console.anthropic.com/settings/keys
2. **Genera una nueva clave**
3. **Actualiza `.env.local`** con la nueva clave
4. **NO commites el cambio** (el archivo ya está en .gitignore)

### 📁 Archivos protegidos por `.gitignore`:

- ✅ `.env.local` - Tu archivo con claves reales (NUNCA se sube a git)
- ✅ `.env` - Variables de entorno generales
- ✅ `.env*.local` - Cualquier variación local

### 📄 Archivo seguro para compartir:

- ✅ `.env.example` - Plantilla SIN claves reales (se puede subir a git)

---

## 🛡️ Estado actual de tu configuración:

- ✅ `.gitignore` configurado correctamente
- ✅ `.env.local` creado y protegido
- ✅ `.env.example` disponible como plantilla
- ⚠️ **RECUERDA**: La clave que compartiste públicamente DEBE ser revocada

---

### 🔗 Enlaces útiles:

- [Anthropic API Keys](https://console.anthropic.com/settings/keys)
- [Documentación de Claude](https://docs.anthropic.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
