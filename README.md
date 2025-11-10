## 💤 Roomie 

> **Roomie** is an intelligent, interactive smart-room dashboard designed for parents to monitor and interact with their child’s environment — including light, temperature, humidity, sound levels, camera & microphone control, bedtime stories, and emergency alerts — all in one beautiful interface.

---

### 🖥️ Preview  
A modern, fully responsive dashboard built with **Next.js**, **React**, and **Tailwind CSS**, featuring:  
- Dynamic authentication  
- Real-time simulated sensors  
- Interactive components (light control, camera, audio, stories, logs)  
- Framer Motion animations  
- Modular, reusable components  

---

## ⚙️ Tech Stack  

| Technology | Purpose |
|-------------|----------|
| **Next.js 14+** | Full-stack React framework |
| **React 18** | UI library for building the interactive dashboard |
| **Tailwind CSS** | Modern utility-first styling |
| **Lucide React** | Beautiful icon set |
| **Framer Motion** | Smooth animations and transitions |
| **bcryptjs** | Secure password hashing for login |
| **Vercel / Node.js runtime** | Backend & deployment support |

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mohamadmatar7/Roomie.git
cd Roomie
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create a `.env.local` file
```bash
# Optional: override default credentials
ADMIN_USER=admin
ADMIN_PASS_HASH='$2b$10$FV3gt4o7LdK2.bj29n8Gie9rD3zewOezZk72DBzJSaG2NiJa0WHWe'
```

> 💡 You can generate a new password hash using:
> ```bash
> node -e "import('bcryptjs').then(async b=>{const h=await b.hash('yourpassword',10);console.log(h)})"
> ```

### 4️⃣ Run the development server
```bash
npm run dev
```
Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 Authentication  

- The login route is defined in:  
  ```
  app/api/login/route.js
  ```
- Default credentials:
  ```
  username: admin
  password: admin
  ```
- The login system uses bcryptjs hashing for validation.  
- After successful login, a session token is saved in `localStorage`.

---

## 🧩 Project Structure  

```
app/
 ├─ api/
 │   └─ login/
 │       └─ route.js            # Login API (POST)
 │   └─ validate/
 │       └─ route.js            
 │
 ├─ dashboard/
 │   └─ page.js                 # Main dashboard page
 │
components/
 └─ dashboard/
     ├─ Header.js               # Top bar (logo, emergency, logout)
     ├─ OverviewTab.js          # Overview cards (lights, stats, story)
     ├─ StoriesTab.js           # Stories management and scheduling
     ├─ CameraTab.js            # Camera & audio controls
     ├─ SensorsTab.js           # Temperature, humidity, sound, light
     ├─ LogTab.js               # Night log and sleep summary
     └─ EmergencyOverlay.js     # Alert screen for emergencies
```

Each tab component is self-contained and imported dynamically inside `page.js`.

---

## 🌈 Features Overview  

### 🧠 Authentication
- Secure login using `bcryptjs`
- Token stored in `localStorage`
- Auth check on page load with a short loading screen

### 💡 Light Control
- Toggle night light
- Adjust brightness and color dynamically
- Real-time visual preview

### 🔊 Camera & Audio
- Simulated live feed view
- Microphone & intercom controls
- Visual sound level indicator

### 🌡 Sensors
- Real-time simulated temperature, humidity, light, and sound updates
- Animated progress bars
- Dynamic color scales and tooltips

### 📖 Stories
- Upload or play bedtime stories
- Schedule nightly playback
- Visual story cards with play controls

### 🪶 Night Log
- Timeline of nightly events (sound, motion, stories)
- Sleep quality summary
- Insights and suggestions

### 🚨 Emergency System
- Full-screen red overlay when triggered
- Options for microphone or camera activation
- Close or respond instantly

### 🧭 Responsive Design
- Fully optimized for desktop, tablet, and mobile
- Buttons and cards resize smoothly
- Glassmorphism style maintained across devices

---

## 🧱 Styling  

- Tailwind CSS with gradients, blurs, rounded cards, and shadows.  
- Consistent use of soft glass UI and vibrant purple/pink accent colors.  
- Reusable design system via Tailwind utility classes.

---

## 🔄 Animations  

- **Framer Motion** for:
  - Smooth tab transitions
  - Progress bar and card fade-ins
  - Subtle hover and load effects  
- Lightweight and performance-friendly.

---

## 🛠 Commands  

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start the production server |
| `npm run lint` | Lint all files |

---

## 🧑‍💻 Author  

**Developed by:** Mohamad Matar
**Concept:** Roomie – Smart Room Dashboard  


