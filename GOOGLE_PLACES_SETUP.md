# Podešavanje Google Places API za Live Recenzije

## Korak 1: Omogući Places API u Google Cloud Console

1. Idite na [Google Cloud Console](https://console.cloud.google.com/)
2. Izaberite projekat "ProjekatBelgradeRiverHouse" (ili kreirajte novi)
3. U pretrazi na vrhu, kucajte "Places API"
4. Kliknite na **"Places API (New)"** ili **"Places API"**
5. Kliknite na dugme **"ENABLE"** ili **"OMOGUĆI"**

## Korak 2: Kreiraj API Ključ

1. Idite na **"APIs & Services"** → **"Credentials"** u levom meniju
2. Kliknite na **"+ CREATE CREDENTIALS"** → **"API key"**
3. Kopirajte kreirani API ključ
4. **VAŽNO**: Kliknite na kreirani API ključ da ga edit-ujete:
   - U sekciji **"API restrictions"**, izaberite **"Restrict key"**
   - Izaberite **"Places API"** i **"Places API (New)"**
   - U sekciji **"Application restrictions"**, možete ograničiti na vaš domen (opciono)
   - Kliknite **"SAVE"**

## Korak 3: Pronađi Place ID za Belgrade River House

### Opcija A: Preko Google Maps
1. Idite na [Google Maps](https://www.google.com/maps)
2. Pretražite "Belgrade River House" ili vašu tačnu adresu
3. Kliknite na vašu lokaciju
4. U URL-u će biti nešto kao: `.../place/Belgrade+River+House/@44.xxxx,20.xxxx,...`
5. Place ID je deo posle `/place/` i pre `/@`

### Opcija B: Preko Place ID Finder
1. Idite na [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Unesite adresu ili naziv lokacije
3. Kopirajte Place ID

## Korak 4: Dodaj Environment Varijable

1. U root folderu projekta, kreirajte ili otvorite `.env.local` fajl
2. Dodajte sledeće linije:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=your_place_id_here
```

**Primer:**
```env
GOOGLE_PLACES_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_PLACE_ID=ChIJNxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **VAŽNO**: Dodajte `.env.local` u `.gitignore` da ne commit-ujete API ključ!

## Korak 5: Restart Development Server

Nakon dodavanja environment varijabli:
1. Zaustavite development server (Ctrl+C)
2. Pokrenite ponovo: `npm run dev`

## Korak 6: Proveri da li radi

1. Otvorite sajt u browser-u
2. Idite na sekciju "Recenzije"
3. Trebalo bi da se prikažu stvarne Google recenzije umesto mock podataka

## Troubleshooting

### Problem: "REQUEST_DENIED" greška
- **Rešenje**: Proverite da li je Places API omogućen u Google Cloud Console
- Proverite da li je API ključ ograničen samo na Places API

### Problem: "INVALID_REQUEST" greška
- **Rešenje**: Proverite da li je Place ID ispravan
- Place ID mora biti u formatu: `ChIJ...` ili `Eip...`

### Problem: "OVER_QUERY_LIMIT" greška
- **Rešenje**: Google Places API ima dnevni limit za besplatni plan
- Možete povećati limit u Google Cloud Console → Billing

### Problem: Recenzije se ne prikazuju
- **Rešenje**: 
  1. Proverite browser console za greške
  2. Proverite server logs (`npm run dev` terminal)
  3. Proverite da li su environment varijable pravilno postavljene
  4. Proverite da li je Place ID ispravan i da lokacija ima recenzije na Google-u

## Napomena o Billing-u

- Google Places API ima **$200 besplatnih kredita** mesečno
- Nakon toga, cena je ~$0.017 po zahtevu
- Za prikaz recenzija, koristi se **Place Details API** koji košta $0.017 po zahtevu
- Sa cache-om od 1 sata, nećete imati puno zahteva

## Dodatne Informacije

- [Google Places API Dokumentacija](https://developers.google.com/maps/documentation/places/web-service)
- [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
- [Google Cloud Console](https://console.cloud.google.com/)

