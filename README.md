# 🌱 Tuproq tarkibini intellektual tahlil qilish asosida ekin tavfsiya qilish ilovasi

Tuproq sensori (yoki qo'lda kiritilgan) ma'lumotlari asosida, oldindan
o'qitilgan XGBoost klassifikatsiya modeli yordamida 7 ta ekindan (Bug'doy,
Kartoshka, Loviya, Makkajo'xori, Paxta, Qalampir, Sabzi) qaysi biri tuproqqa
eng mos kelishini foiz ko'rsatkichida aniqlaydigan React Native (Expo SDK 54)
mobil ilovasi.

Model **butunlay qurilma ichida (on-device)** ishlaydi — internetga yoki
serverga ehtiyoj yo'q. Model original `crop_recommendation_model_v1.joblib`
(XGBoost, 300 ta boosting round × 7 klass = 2100 ta daraxt) fayli asosida
`assets/model/model_data.dat` ga eksport qilingan va JavaScript'da 1:1 qayta
amalga oshirilgan (Python model bilan solishtirilganda ~1e-6 aniqlikda mos
keladi).

## 📱 Ishga tushirish (Expo Go orqali)

1. Talablar: kompyuteringizda **Node.js 18+** va **npm** o'rnatilgan bo'lishi
   kerak. Telefoningizga **Expo Go** ilovasini o'rnating (Play Store / App
   Store).
2. Loyiha papkasida terminalni oching va kerakli paketlarni o'rnating:

   ```bash
   npm install
   ```

3. Development serverni ishga tushiring:

   ```bash
   npx expo start
   ```

4. Terminalda chiqqan QR kodni Expo Go ilovasi orqali skanerlang (Android'da
   Expo Go ichidagi "Scan QR code" tugmasi orqali, iOS'da esa Camera ilovasi
   orqali). Ilova telefoningizda ochiladi.

   > Birinchi ochilishda model fayli (~10 MB) qurilmaga yuklanadi, shuning
   > uchun bir necha soniya kutish talab qilinishi mumkin — bu vaqtda
   > yuklanish ekrani ko'rsatiladi.

### Muhim: bir xil Wi-Fi tarmog'i

Telefon va kompyuter bir xil Wi-Fi tarmog'ida bo'lishi kerak. Agar ulanishda
muammo bo'lsa, `npx expo start --tunnel` buyrug'ini ishlatib ko'ring (bu
sekinroq, lekin turli tarmoqlarda ham ishlaydi).

## 🧠 Model qanday ishlaydi

1. **Kirish (input):** 18 ta tuproq ko'rsatkichi — shundan **5 tasi**
   (`pH`, `EC`, `N`, `P`, `K`) 8-in-1 sensor orqali o'lchanadi, qolgan
   **13 tasi** (Gumus, Mg, S, Zn, Mn, B, Fe, Cu, Mikroorganizmlar, Dala nam
   sig'imi, Tuproq zichligi, Qatlam chuqurligi, Mexanik tarkib) sensor orqali
   o'lchanmaydi.
2. **Standart qiymatlar:** o'lchanmagan 13 ta ko'rsatkich uchun ilova
   agronomik bog'liqliklar asosida (masalan, Gumus va Mikroorganizmlar azot
   miqdoriga, mikroelementlar esa pH darajasiga bog'liq holda taxminiy
   hisoblanadi) boshlang'ich qiymat taklif qiladi. Bu qiymatlar **"Taxminiy"**
   belgisi bilan ko'rsatiladi va istalgan vaqt qo'lda o'zgartirilishi mumkin
   ("O'zgartirilgan" belgisiga aylanadi).
3. **Bashorat:** barcha 18 ta qiymat kodlanadi (kategorik ustunlar uchun) va
   0–1 oralig'iga normallashtiriladi (MinMaxScaler), so'ng 2100 ta daraxt
   orqali o'tkazilib, softmax funksiyasi yordamida har bir ekin uchun foiz
   ko'rinishidagi moslik darajasi hisoblanadi.

## 📊 Excel fayl formati (yuklash uchun)

"Soil Detector" kabi ilovalar orqali eksport qilingan faylda quyidagi
ustunlar bo'lishi kerak (ustun nomlari va tartibi biroz farq qilishi mumkin,
ilova ularni avtomatik taniydi):

| Ustun | Misol | Izoh |
|---|---|---|
| pH | `5.0` | to'g'ridan-to'g'ri qiymat |
| Conductivity (EC) | `790.0us/cm` | µS/cm yoki mS/cm bo'lishi mumkin — avtomatik mS/cm ga o'giriladi |
| N | `39mg/kg` | azot |
| P | `55mg/kg` | fosfor |
| K | `126mg/kg` | kaliy |

Boshqa ustunlar (Temp, Moisture, Fertility, No., Desc, Time) mavjud bo'lishi
mumkin, lekin ilova ularni **e'tiborga olmaydi** — faqat yuqoridagi 5 ta
qiymat ajratib olinadi.

## 🗂️ Loyiha tuzilishi

```
App.js                     — ildiz komponent (provider'lar, yuklanish holati)
src/
  i18n/                    — 3 tilli tarjimalar (uz, en, ru) va til konteksti
  context/ModelContext.js  — model faylini yuklash va keshlash
  ml/
    modelData.js           — .dat faylni o'qish (expo-asset + expo-file-system)
    preprocessing.js        — kategorik kodlash + MinMax scaling
    predictor.js            — XGBoost daraxtlarini JS'da qayta tiklash + softmax
    defaults.js              — 13 ta qo'shimcha ko'rsatkich uchun aqlli standart qiymatlar
    featureUtils.js
  data/featureSchema.js     — 18 ta xususiyat haqida metama'lumot
  utils/
    excelParser.js          — Excel/.xls fayldan qiymatlarni ajratib olish
    unitConversion.js        — birlik konversiyalari (µS/cm ↔ mS/cm va h.k.)
    storage.js               — AsyncStorage orqali tahlil tarixi
  screens/                  — barcha ekranlar (Home, Upload, ManualEntry, Results, History, ...)
  components/               — qayta ishlatiladigan UI qismlari
assets/model/model_data.dat — eksport qilingan model (~10 MB)
```


