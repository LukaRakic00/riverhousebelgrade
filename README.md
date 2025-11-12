# 🏡 River House Belgrade

Moderna web aplikacija za prezentaciju i rezervaciju premium vikendice River House u Beogradu. Aplikacija omogućava gostima da pregledaju galeriju slika, saznaju više o lokaciji i pogodnostima, i rezervišu svoj boravak putem kontakt forme.

## ✨ Funkcionalnosti

- 🎨 **Moderna i responzivna prezentacija** - Elegantan dizajn sa animacijama i optimizovanim performansama
- 📸 **Dinamička galerija slika** - Integracija sa Cloudinary za upravljanje slikama
- 📝 **Sistem rezervacija** - Kontakt forma za prijavu interesovanja za rezervaciju
- 🔐 **Admin panel** - Administrativni interfejs za upravljanje sadržajem
- 📧 **Email notifikacije** - Automatsko slanje email obaveštenja putem Resend servisa
- 🌐 **SEO optimizacija** - Next.js SEO integracija za bolje rangiranje u pretraživačima

## 🛠️ Tehnologije

- **Framework**: [Next.js 14](https://nextjs.org/) sa TypeScript
- **UI Biblioteka**: [Chakra UI](https://chakra-ui.com/) i [Saas UI](https://saas-ui.dev/)
- **Animacije**: [Framer Motion](https://www.framer.com/motion/)
- **Baza podataka**: [MongoDB](https://www.mongodb.com/) sa [Mongoose](https://mongoosejs.com/)
- **Autentifikacija**: JWT (JSON Web Tokens) sa bcryptjs
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) za upravljanje slikama
- **Email Servis**: [Resend](https://resend.com/)
- **Ikonice**: [React Icons](https://react-icons.github.io/react-icons/)

## 📋 Preduslovi

Pre pokretanja projekta, potrebno je imati instalirano:

- [Node.js](https://nodejs.org/) (verzija 18 ili novija)
- [npm](https://www.npmjs.com/) ili [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) baza podataka (lokalno ili MongoDB Atlas)
- Naloge za:
  - Cloudinary (za upravljanje slikama)
  - Resend (za slanje emailova)

## 🚀 Instalacija

1. **Klonirajte repozitorijum**
   ```bash
   git clone <repository-url>
   cd riverHouse
   ```

2. **Instalirajte zavisnosti**
   ```bash
   npm install
   # ili
   yarn install
   ```

3. **Kreirajte `.env` fajl u root direktorijumu**
   
   Kopirajte sledeći template i popunite sa svojim vrednostima:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/riverhouse
   MONGODB_DB=riverhouse

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Resend (Email)
   RESEND_API_KEY=your-resend-api-key

   # Admin Credentials (opciono - za kreiranje admin korisnika)
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

4. **Pokrenite development server**
   ```bash
   npm run dev
   # ili
   yarn dev
   ```

5. **Otvorite aplikaciju u browseru**
   
   Aplikacija će biti dostupna na [http://localhost:3000](http://localhost:3000)

## 📁 Struktura projekta

```
riverHouse/
├── app/                    # Next.js App Router stranice
│   ├── (auth)/            # Auth rute
│   ├── (marketing)/       # Marketing stranice
│   ├── admin/             # Admin panel
│   ├── api/               # API rute
│   └── page.tsx           # Glavna stranica
├── components/            # React komponente
│   ├── marketing/        # Marketing komponente
│   └── ...
├── data/                 # Statički podaci i konfiguracija
├── lib/                  # Utility funkcije
│   ├── db.ts            # MongoDB konekcija
│   └── cloudinary.ts    # Cloudinary integracija
├── models/              # Mongoose modeli
├── public/              # Statički fajlovi
├── scripts/             # Helper skripte
├── theme/               # Chakra UI tema
└── types/               # TypeScript tipovi
```

## 🔧 Konfiguracija

### MongoDB Setup

Za lokalni razvoj, možete koristiti MongoDB lokalno ili MongoDB Atlas:

**Lokalno:**
```env
MONGODB_URI=mongodb://localhost:27017/riverhouse
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/riverhouse
```

### Cloudinary Setup

1. Kreirajte nalog na [Cloudinary](https://cloudinary.com/)
2. U Dashboard-u, kopirajte Cloud Name, API Key i API Secret
3. Dodajte ih u `.env` fajl

### Resend Setup

1. Kreirajte nalog na [Resend](https://resend.com/)
2. Generišite API ključ
3. Dodajte ga u `.env` fajl kao `RESEND_API_KEY`

## 🐳 Docker Deployment

Projekat podržava Docker deployment. Za više informacija o Docker konfiguraciji, pogledajte Dockerfile i docker-compose.yml fajlove.

## 📜 Dostupne komande

```bash
# Development server
npm run dev

# Production build
npm run build

# Pokretanje production build-a
npm start

# Linting
npm run lint
```

## 🔐 Admin Panel

Admin panel je dostupan na `/admin` ruti. Za pristup, potrebno je kreirati admin korisnika preko API endpoint-a ili direktno u bazi podataka.

**Login endpoint:** `POST /api/admin/login`

## 📝 API Endpoints

- `GET /api/images` - Vraća konfiguraciju slika za galeriju
- `POST /api/register` - Šalje rezervaciju/prijavu interesovanja
- `POST /api/admin/login` - Admin autentifikacija
- `POST /api/admin/logout` - Admin odjava
- `POST /api/send-email` - Slanje email notifikacija
- `POST /api/upload` - Upload slika na Cloudinary

## 🎨 Customizacija

### Tema

Tema aplikacije se može prilagoditi u `theme/` direktorijumu. Chakra UI tema je konfigurisana u `theme/index.ts`.

### Komponente

Sve komponente se nalaze u `components/` direktorijumu i mogu se lako prilagoditi prema potrebama.

## 🤝 Doprinos

Doprinos projektu je dobrodošao! Molimo vas da:

1. Fork-ujete projekat
2. Kreirate feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit-ujete izmene (`git commit -m 'Add some AmazingFeature'`)
4. Push-ujete na branch (`git push origin feature/AmazingFeature`)
5. Otvorite Pull Request

## 📄 Licenca

Ovaj projekat je privatni i vlasništvo River House Belgrade.

## 📞 Kontakt

Za dodatne informacije ili podršku, kontaktirajte nas putem aplikacije ili direktno.

---

**Napravljeno sa ❤️ za River House Belgrade**

