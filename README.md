# RareMatch - Rarity Certificate Generator

Eine Full-Stack-Webanwendung, die personalisierte "Seltenheitszertifikate" basierend auf einzigartigen körperlichen Eigenschaften der Benutzer generiert.

## 🚀 Deployment mit Vercel

### Schritt 1: Repository auf GitHub erstellen
1. Erstellen Sie ein neues Repository auf GitHub
2. Pushen Sie Ihren Code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/IhrUsername/rarematch.git
git push -u origin main
```

### Schritt 2: Mit Vercel verbinden
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Registrieren Sie sich mit Ihrem GitHub-Account
3. Klicken Sie auf "New Project"
4. Wählen Sie Ihr RareMatch Repository
5. Vercel erkennt automatisch die Konfiguration

### Schritt 3: Environment Variables setzen (optional)
Falls Sie API-Keys verwenden:
- OPENAI_API_KEY
- DATABASE_URL

### Schritt 4: Deploy
Klicken Sie auf "Deploy" - Vercel baut und deployed automatisch!

## 🌐 Custom Domain einrichten

Nach dem Deployment:
1. Gehen Sie zu Ihrem Projekt-Dashboard
2. Klicken Sie auf "Settings" → "Domains"
3. Fügen Sie "rarematch.com" hinzu
4. Folgen Sie den DNS-Anweisungen

## 🛠 Lokale Entwicklung

```bash
npm install
npm run dev
```

## 📁 Projektstruktur

- `/client` - React Frontend
- `/server` - Express.js Backend  
- `/api` - Vercel Serverless Functions
- `/shared` - Geteilte TypeScript Typen

## 🎨 Features

- ✅ Foto-Upload und KI-Analyse
- ✅ Seltene körperliche Fähigkeiten
- ✅ Seltenheits-Berechnung
- ✅ Zertifikat-Generierung
- ✅ Responsive Design mit RareMatch Logo-Farben