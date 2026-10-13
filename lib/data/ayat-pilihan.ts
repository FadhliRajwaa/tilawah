/* — Ayat pilihan untuk kartu "Ayat hari ini" di beranda.
 *
 * Teks Arab dan terjemahan DISALIN dari data equran.id (Kemenag), bukan diketik
 * ulang — ini konten suci, satu huruf pun tidak boleh meleset. Kalau ingin
 * menambah ayat, ambil dari sumber yang sama.
 */

export interface AyatPilihan {
  s: number;
  a: number;
  ar: string;
  id: string;
}

export const AYAT_PILIHAN: readonly AyatPilihan[] = [
  { s: 2, a: 152, ar: "فَاذْكُرُوْنِيْٓ اَذْكُرْكُمْ وَاشْكُرُوْا لِيْ وَلَا تَكْفُرُوْنِ ࣖ ", id: "Maka, ingatlah kepada-Ku, Aku pun akan ingat kepadamu. Bersyukurlah kepada-Ku dan janganlah kamu ingkar kepada-Ku." },
  { s: 2, a: 153, ar: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوا اسْتَعِيْنُوْا بِالصَّبْرِ وَالصَّلٰوةِ ۗ اِنَّ اللّٰهَ مَعَ الصّٰبِرِيْنَ", id: "Wahai orang-orang yang beriman, mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sesungguhnya Allah beserta orang-orang yang sabar." },
  { s: 2, a: 186, ar: "وَاِذَا سَاَلَكَ عِبَادِيْ عَنِّيْ فَاِنِّيْ قَرِيْبٌ ۗ اُجِيْبُ دَعْوَةَ الدَّاعِ اِذَا دَعَانِۙ فَلْيَسْتَجِيْبُوْا لِيْ وَلْيُؤْمِنُوْا بِيْ لَعَلَّهُمْ يَرْشُدُوْنَ ", id: "Apabila hamba-hamba-Ku bertanya kepadamu (Nabi Muhammad) tentang Aku, sesungguhnya Aku dekat. Aku mengabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku. Maka, hendaklah mereka memenuhi (perintah)-Ku dan beriman kepada-Ku agar mereka selalu berada dalam kebenaran." },
  { s: 2, a: 201, ar: "وَمِنْهُمْ مَّنْ يَّقُوْلُ رَبَّنَآ اٰتِنَا فِى الدُّنْيَا حَسَنَةً وَّفِى الْاٰخِرَةِ حَسَنَةً وَّقِنَا عَذَابَ النَّارِ ", id: "Di antara mereka ada juga yang berdoa, “Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat serta lindungilah kami dari azab neraka.”" },
  { s: 2, a: 286, ar: "لَا يُكَلِّفُ اللّٰهُ نَفْسًا اِلَّا وُسْعَهَا ۗ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ اِنْ نَّسِيْنَآ اَوْ اَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ اِصْرًا كَمَا حَمَلْتَهٗ عَلَى الَّذِيْنَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهٖۚ وَاعْفُ عَنَّاۗ وَاغْفِرْ لَنَاۗ وَارْحَمْنَا ۗ اَنْتَ مَوْلٰىنَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكٰفِرِيْنَ ࣖ", id: "Allah tidak membebani seseorang, kecuali menurut kesanggupannya. Baginya ada sesuatu (pahala) dari (kebajikan) yang diusahakannya dan terhadapnya ada (pula) sesuatu (siksa) atas (kejahatan) yang diperbuatnya. (Mereka berdoa,) “Wahai Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami salah. Wahai Tuhan kami, janganlah Engkau bebani kami dengan beban yang berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami. Wahai Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tidak sanggup kami memikulnya. Maafkanlah kami, ampunilah kami, dan rahmatilah kami. Engkaulah pelindung kami. Maka, tolonglah kami dalam menghadapi kaum kafir.”" },
  { s: 3, a: 8, ar: "رَبَّنَا لَا تُزِغْ قُلُوْبَنَا بَعْدَ اِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَّدُنْكَ رَحْمَةً ۚاِنَّكَ اَنْتَ الْوَهَّابُ ", id: "(Mereka berdoa,) “Wahai Tuhan kami, janganlah Engkau jadikan hati kami berpaling setelah Engkau berikan petunjuk kepada kami dan anugerahkanlah kepada kami rahmat dari hadirat-Mu. Sesungguhnya Engkau Maha Pemberi." },
  { s: 3, a: 139, ar: "وَلَا تَهِنُوْا وَلَا تَحْزَنُوْا وَاَنْتُمُ الْاَعْلَوْنَ اِنْ كُنْتُمْ مُّؤْمِنِيْنَ ", id: "Janganlah kamu (merasa) lemah dan jangan (pula) bersedih hati, padahal kamu paling tinggi (derajatnya) jika kamu orang-orang mukmin." },
  { s: 3, a: 200, ar: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوا اصْبِرُوْا وَصَابِرُوْا وَرَابِطُوْاۗ وَاتَّقُوا اللّٰهَ لَعَلَّكُمْ تُفْلِحُوْنَ ࣖ", id: "Wahai orang-orang yang beriman, bersabarlah kamu, kuatkanlah kesabaranmu, tetaplah bersiap siaga di perbatasan (negerimu), dan bertakwalah kepada Allah agar kamu beruntung." },
  { s: 13, a: 28, ar: "الَّذِيْنَ اٰمَنُوْا وَتَطْمَىِٕنُّ قُلُوْبُهُمْ بِذِكْرِ اللّٰهِ ۗ اَلَا بِذِكْرِ اللّٰهِ تَطْمَىِٕنُّ الْقُلُوْبُ ۗ   ", id: "(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, bahwa hanya dengan mengingat Allah hati akan selalu tenteram." },
  { s: 14, a: 7, ar: "وَاِذْ تَاَذَّنَ رَبُّكُمْ لَىِٕنْ شَكَرْتُمْ لَاَزِيْدَنَّكُمْ وَلَىِٕنْ كَفَرْتُمْ اِنَّ عَذَابِيْ لَشَدِيْدٌ ", id: "(Ingatlah) ketika Tuhanmu memaklumkan, “Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu, tetapi jika kamu mengingkari (nikmat-Ku), sesungguhnya azab-Ku benar-benar sangat keras.”" },
  { s: 20, a: 114, ar: "فَتَعٰلَى اللّٰهُ الْمَلِكُ الْحَقُّۚ وَلَا تَعْجَلْ بِالْقُرْاٰنِ مِنْ قَبْلِ اَنْ يُّقْضٰٓى اِلَيْكَ وَحْيُهٗ ۖوَقُلْ رَّبِّ زِدْنِيْ عِلْمًا ", id: "Maha Tinggi Allah, Raja yang sebenar-benarnya. Janganlah engkau (Nabi Muhammad) tergesa-gesa (membaca) Al-Qur’an sebelum selesai pewahyuannya kepadamu dan katakanlah, “Ya Tuhanku, tambahkanlah ilmu kepadaku.”" },
  { s: 21, a: 87, ar: "وَذَا النُّوْنِ اِذْ ذَّهَبَ مُغَاضِبًا فَظَنَّ اَنْ لَّنْ نَّقْدِرَ عَلَيْهِ فَنَادٰى فِى الظُّلُمٰتِ اَنْ لَّآ اِلٰهَ اِلَّآ اَنْتَ سُبْحٰنَكَ اِنِّيْ كُنْتُ مِنَ الظّٰلِمِيْنَ ۚ", id: "(Ingatlah pula) Zun Nun (Yunus) ketika dia pergi dalam keadaan marah, lalu dia menyangka bahwa Kami tidak akan menyulitkannya. Maka, dia berdoa dalam kegelapan yang berlapis-lapis, “Tidak ada tuhan selain Engkau. Maha Suci Engkau. Sesungguhnya aku termasuk orang-orang zalim.”" },
  { s: 29, a: 69, ar: "وَالَّذِيْنَ جَاهَدُوْا فِيْنَا لَنَهْدِيَنَّهُمْ سُبُلَنَاۗ وَاِنَّ اللّٰهَ لَمَعَ الْمُحْسِنِيْنَ ࣖ ", id: "Orang-orang yang berusaha dengan sungguh-sungguh untuk (mencari keridaan) Kami benar-benar akan Kami tunjukkan kepada mereka jalan-jalan Kami. Sesungguhnya Allah benar-benar bersama orang-orang yang berbuat kebaikan." },
  { s: 33, a: 41, ar: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوا اذْكُرُوا اللّٰهَ ذِكْرًا كَثِيْرًاۙ ", id: "Wahai orang-orang yang beriman, ingatlah Allah dengan zikir sebanyak-banyaknya" },
  { s: 39, a: 53, ar: "۞ قُلْ يٰعِبَادِيَ الَّذِيْنَ اَسْرَفُوْا عَلٰٓى اَنْفُسِهِمْ لَا تَقْنَطُوْا مِنْ رَّحْمَةِ اللّٰهِ ۗاِنَّ اللّٰهَ يَغْفِرُ الذُّنُوْبَ جَمِيْعًا ۗاِنَّهٗ هُوَ الْغَفُوْرُ الرَّحِيْمُ", id: "Katakanlah (Nabi Muhammad), “Wahai hamba-hamba-Ku yang melampaui batas (dengan menzalimi) dirinya sendiri, janganlah berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa semuanya. Sesungguhnya Dialah Yang Maha Pengampun lagi Maha Penyayang." },
  { s: 40, a: 60, ar: "وَقَالَ رَبُّكُمُ ادْعُوْنِيْٓ اَسْتَجِبْ لَكُمْ ۗاِنَّ الَّذِيْنَ يَسْتَكْبِرُوْنَ عَنْ عِبَادَتِيْ سَيَدْخُلُوْنَ جَهَنَّمَ دَاخِرِيْنَ ࣖ ", id: "Tuhanmu berfirman, “Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu (apa yang kamu harapkan). Sesungguhnya orang-orang yang menyombongkan diri tidak mau beribadah kepada-Ku akan masuk (neraka) Jahanam dalam keadaan hina dina.”" },
  { s: 50, a: 16, ar: "وَلَقَدْ خَلَقْنَا الْاِنْسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهٖ نَفْسُهٗ ۖوَنَحْنُ اَقْرَبُ اِلَيْهِ مِنْ حَبْلِ الْوَرِيْدِ ", id: "Sungguh, Kami benar-benar telah menciptakan manusia dan mengetahui apa yang dibisikkan oleh dirinya. Kami lebih dekat kepadanya daripada urat lehernya." },
  { s: 54, a: 17, ar: "وَلَقَدْ يَسَّرْنَا الْقُرْاٰنَ لِلذِّكْرِ فَهَلْ مِنْ مُّدَّكِرٍ ", id: "Sungguh, Kami benar-benar telah memudahkan Al-Qur’an sebagai pelajaran. Maka, adakah orang yang mau mengambil pelajaran?" },
  { s: 55, a: 13, ar: "فَبِاَيِّ اٰلَاۤءِ رَبِّكُمَا تُكَذِّبٰنِ ", id: "Maka, nikmat Tuhanmu manakah yang kamu dustakan (wahai jin dan manusia)?" },
  { s: 65, a: 3, ar: "وَّيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُۗ وَمَنْ يَّتَوَكَّلْ عَلَى اللّٰهِ فَهُوَ حَسْبُهٗ ۗاِنَّ اللّٰهَ بَالِغُ اَمْرِهٖۗ قَدْ جَعَلَ اللّٰهُ لِكُلِّ شَيْءٍ قَدْرًا ", id: "dan menganugerahkan kepadanya rezeki dari arah yang tidak dia duga. Siapa yang bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)-nya. Sesungguhnya Allahlah yang menuntaskan urusan-Nya. Sungguh, Allah telah membuat ketentuan bagi setiap sesuatu." },
  { s: 93, a: 5, ar: "وَلَسَوْفَ يُعْطِيْكَ رَبُّكَ فَتَرْضٰىۗ", id: "Sungguh, kelak (di akhirat nanti) Tuhanmu pasti memberikan karunia-Nya kepadamu sehingga engkau rida." },
  { s: 94, a: 5, ar: "فَاِنَّ مَعَ الْعُسْرِ يُسْرًاۙ", id: "Maka, sesungguhnya beserta kesulitan ada kemudahan." },
  { s: 94, a: 6, ar: "اِنَّ مَعَ الْعُسْرِ يُسْرًاۗ", id: "Sesungguhnya beserta kesulitan ada kemudahan." },
  { s: 112, a: 1, ar: "قُلْ هُوَ اللّٰهُ اَحَدٌۚ", id: "Katakanlah (Nabi Muhammad), “Dialah Allah Yang Maha Esa." },
  { s: 1, a: 5, ar: "اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ", id: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan." },
  { s: 17, a: 24, ar: "وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ وَقُلْ رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيٰنِيْ صَغِيْرًاۗ", id: "Rendahkanlah dirimu terhadap keduanya dengan penuh kasih sayang dan ucapkanlah, “Wahai Tuhanku, sayangilah keduanya sebagaimana mereka berdua (menyayangiku ketika) mendidik aku pada waktu kecil.”" },
  { s: 2, a: 45, ar: "وَاسْتَعِيْنُوْا بِالصَّبْرِ وَالصَّلٰوةِ ۗ وَاِنَّهَا لَكَبِيْرَةٌ اِلَّا عَلَى الْخٰشِعِيْنَۙ", id: "Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sesungguhnya (salat) itu benar-benar berat, kecuali bagi orang-orang yang khusyuk," },
  { s: 8, a: 46, ar: "وَاَطِيْعُوا اللّٰهَ وَرَسُوْلَهٗ وَلَا تَنَازَعُوْا فَتَفْشَلُوْا وَتَذْهَبَ رِيْحُكُمْ وَاصْبِرُوْاۗ اِنَّ اللّٰهَ مَعَ الصّٰبِرِيْنَۚ ", id: "Taatilah Allah dan Rasul-Nya, janganlah kamu berbantah-bantahan yang menyebabkan kamu menjadi gentar dan kekuatanmu hilang, serta bersabarlah. Sesungguhnya Allah bersama orang-orang yang sabar." },
  { s: 11, a: 115, ar: "وَاصْبِرْ فَاِنَّ اللّٰهَ لَا يُضِيْعُ اَجْرَ الْمُحْسِنِيْنَ", id: "Bersabarlah, karena sesungguhnya Allah tidak akan menyia-nyiakan pahala orang yang berbuat kebaikan." },
  { s: 16, a: 128, ar: "اِنَّ اللّٰهَ مَعَ الَّذِيْنَ اتَّقَوْا وَّالَّذِيْنَ هُمْ مُّحْسِنُوْنَ ࣖ   ۔", id: "Sesungguhnya Allah bersama orang-orang yang bertakwa dan yang berbuat kebaikan." },
];

/** Ayat untuk tanggal tertentu — bergilir harian, sama untuk semua pengunjung
 *  di hari yang sama (dihitung dalam WIB). */
export function ayatHariIni(now = new Date()): AyatPilihan {
  const wib = new Date(now.getTime() + 7 * 3600_000);
  const hari = Math.floor(wib.getTime() / 86_400_000);
  return AYAT_PILIHAN[hari % AYAT_PILIHAN.length];
}
