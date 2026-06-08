# Sistema de Certificados Tadano

Sistema interno de emisión y validación de certificados de garantía digitales con verificación mediante código QR.

---

## ¿Qué hace?

Permite emitir certificados de garantía en PDF con diseño profesional, registrarlos automáticamente en base de datos y validarlos mediante un código QR único que cualquier persona puede escanear.

---

## Archivos del proyecto

```
├── index.html        # Formulario de emisión de certificados
├── verify.html       # Página de validación por QR
├── style.css         # Estilos globales y diseño del certificado
├── script.js         # Lógica de emisión, generación de PDF y QR
├── logo.png          # Logo utilizado en el certificado PDF
├── faviconlogo.jpeg  # Favicon del sistema
└── README.md
```

---

## Tecnologías utilizadas

| Librería | Uso |
|----------|-----|
| [Supabase](https://supabase.com) | Base de datos y almacenamiento de certificados |
| [QRCode.js](https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js) | Generación del código QR |
| [jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js) | Exportación del certificado en PDF |
| [html2canvas](https://html2canvas.hertzen.com) | Captura visual del certificado para PDF |

No requiere instalación de dependencias — todo se carga vía CDN.

---

## Cómo usar

### Emitir un certificado

1. Abrir `index.html` en el navegador
2. Completar el formulario con los datos del cliente
3. Hacer clic en **Generar Certificado**
4. El sistema registra el certificado en Supabase y descarga el PDF automáticamente

### Validar un certificado

- Escanear el QR del certificado PDF, o
- Acceder directamente a `verify.html?id=CERT-xxxx`

La página muestra el estado del certificado: **Válido**, **Caducado** o **Revocado**.

---

## Base de datos (Supabase)

La tabla `certificados` requiere las siguientes columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | text (PK) | Identificador único del certificado |
| `nome` | text | Nombre del cliente |
| `empresa` | text | Empresa responsable |
| `curso` | text | Tipo de garantía |
| `emissao` | text | Fecha de emisión |
| `validade` | text | Fecha de caducidad |
| `ativo` | boolean | `true` = válido, `false` = revocado |
| `hash` | text | Hash SHA-256 de integridad |

---

## Configuración

Las credenciales de Supabase están definidas directamente en `script.js` y `verify.html`:

```js
const SUPABASE_URL = "https://xxxx.supabase.co";
const SUPABASE_KEY = "eyJ...";
```

> ⚠️ Por tratarse de un proyecto interno, las credenciales están incluidas en el código. No exponer públicamente.

---

## Estados de un certificado

| Estado | Condición |
|--------|-----------|
| ✅ Válido | `ativo = true` y fecha de caducidad futura |
| ⚠️ Caducado | `ativo = true` pero fecha de caducidad pasada |
| 🚫 Revocado | `ativo = false` |
| ❌ No encontrado | ID no existe en la base de datos |
