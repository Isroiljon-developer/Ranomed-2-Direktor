// Mock Data - Ranomed -2  Director Panel

export const filiallar = [
  { id: 1, nom: "Чилонзор филиали", manzil: "Чилонзор, 9-квартал", telefon: "+998 71 123 45 67", rasm: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop" },
  { id: 2, nom: "Сергели филиали", manzil: "Сергели, 5-квартал", telefon: "+998 71 234 56 78", rasm: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop" },
  { id: 3, nom: "Юнусобод филиали", manzil: "Юнусобод, 7-квартал", telefon: "+998 71 345 67 89", rasm: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=200&fit=crop" },
  { id: 4, nom: "Миробод филиали", manzil: "Миробод, Амир Темур кўчаси", telefon: "+998 71 456 78 90", rasm: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop" },
];

export const shifokorlar = [
  { id: 1, ism: "Каримов Алишер", mutaxassislik: "Терапевт", filialId: 1, reyting: 4.8, bemorlarSoni: 156, tushum: 45000000, telefon: "+998 90 123 45 67", lavozim: "Олий тоифали шифокор" },
  { id: 2, ism: "Рахимова Дилноза", mutaxassislik: "Кардиолог", filialId: 1, reyting: 4.9, bemorlarSoni: 134, tushum: 52000000, telefon: "+998 90 234 56 78", lavozim: "Олий тоифали шифокор" },
  { id: 3, ism: "Исмоилов Бахтиёр", mutaxassislik: "Невролог", filialId: 2, reyting: 4.7, bemorlarSoni: 98, tushum: 38000000, telefon: "+998 90 345 67 89", lavozim: "Биринчи тоифали шифокор" },
  { id: 4, ism: "Холматова Гулнора", mutaxassislik: "Педиатр", filialId: 2, reyting: 4.6, bemorlarSoni: 187, tushum: 41000000, telefon: "+998 90 456 78 90", lavozim: "Олий тоифали шифокор" },
  { id: 5, ism: "Тошматов Санжар", mutaxassislik: "Хирург", filialId: 3, reyting: 4.9, bemorlarSoni: 76, tushum: 89000000, telefon: "+998 90 567 89 01", lavozim: "Олий тоифали шифокор" },
  { id: 6, ism: "Нурматова Севара", mutaxassislik: "Гинеколог", filialId: 3, reyting: 4.8, bemorlarSoni: 145, tushum: 56000000, telefon: "+998 90 678 90 12", lavozim: "Биринчи тоифали шифокор" },
  { id: 7, ism: "Юсупов Жамшид", mutaxassislik: "Офталмолог", filialId: 4, reyting: 4.5, bemorlarSoni: 112, tushum: 34000000, telefon: "+998 90 789 01 23", lavozim: "Иккинчи тоифали шифокор" },
  { id: 8, ism: "Мирзаева Лола", mutaxassislik: "Дерматолог", filialId: 4, reyting: 4.7, bemorlarSoni: 167, tushum: 47000000, telefon: "+998 90 890 12 34", lavozim: "Олий тоифали шифокор" },
];

export const xodimlar = [
  { id: 1, ism: "Каримова Мадина", lavozim: "Ҳамшира", filialId: 1, ishVaqti: "08:00", holat: "Ишда", bemorlar: 45 },
  { id: 2, ism: "Тўйчиев Бобур", lavozim: "Қабулхона", filialId: 1, ishVaqti: "08:30", holat: "Ишда", bemorlar: 67 },
  { id: 3, ism: "Рустамова Зулфия", lavozim: "Кассир", filialId: 1, ishVaqti: "09:00", holat: "Ишда", bemorlar: 52 },
  { id: 4, ism: "Олимов Шерзод", lavozim: "Лаборант", filialId: 2, ishVaqti: "08:00", holat: "Ишда", bemorlar: 89 },
  { id: 5, ism: "Назарова Нилуфар", lavozim: "Ҳамшира", filialId: 2, ishVaqti: "07:30", holat: "Ишда", bemorlar: 56 },
  { id: 6, ism: "Худойберганов Аҳмад", lavozim: "Қабулхона", filialId: 3, ishVaqti: "08:00", holat: "Тушликда", bemorlar: 43 },
  { id: 7, ism: "Эргашева Малика", lavozim: "Кассир", filialId: 3, ishVaqti: "09:00", holat: "Ишда", bemorlar: 38 },
  { id: 8, ism: "Сафаров Отабек", lavozim: "Лаборант", filialId: 4, ishVaqti: "08:00", holat: "Ишда", bemorlar: 71 },
];

export const bemorlar = [
  { id: 1, ism: "Абдуллаев Камол", yosh: 45, jins: "Эркак", telefon: "+998 91 111 22 33", filialId: 1, shifokorId: 1, sana: "2024-01-15", xizmat: "Текширув", summa: 150000, holat: "Тугалланган" },
  { id: 2, ism: "Содикова Нигора", yosh: 32, jins: "Аёл", telefon: "+998 91 222 33 44", filialId: 1, shifokorId: 2, sana: "2024-01-15", xizmat: "ЭКГ", summa: 250000, holat: "Тугалланган" },
  { id: 3, ism: "Эргашев Бахром", yosh: 58, jins: "Эркак", telefon: "+998 91 333 44 55", filialId: 2, shifokorId: 3, sana: "2024-01-15", xizmat: "МРТ", summa: 850000, holat: "Кутилмоқда" },
  { id: 4, ism: "Хамидова Дилбар", yosh: 28, jins: "Аёл", telefon: "+998 91 444 55 66", filialId: 2, shifokorId: 4, sana: "2024-01-15", xizmat: "Текширув", summa: 120000, holat: "Тугалланган" },
  { id: 5, ism: "Рахматов Улуғбек", yosh: 67, jins: "Эркак", telefon: "+998 91 555 66 77", filialId: 3, shifokorId: 5, sana: "2024-01-15", xizmat: "Операция", summa: 3500000, holat: "Даволанишда" },
  { id: 6, ism: "Мирзаева Шахноза", yosh: 35, jins: "Аёл", telefon: "+998 91 666 77 88", filialId: 3, shifokorId: 6, sana: "2024-01-14", xizmat: "УЗИ", summa: 180000, holat: "Тугалланган" },
  { id: 7, ism: "Усмонов Фарход", yosh: 41, jins: "Эркак", telefon: "+998 91 777 88 99", filialId: 4, shifokorId: 7, sana: "2024-01-14", xizmat: "Кўрик", summa: 200000, holat: "Тугалланган" },
  { id: 8, ism: "Каримова Зарина", yosh: 25, jins: "Аёл", telefon: "+998 91 888 99 00", filialId: 4, shifokorId: 8, sana: "2024-01-14", xizmat: "Консултация", summa: 100000, holat: "Кутилмоқда" },
];

export const palatalar = [
  { id: 1, raqam: "101", filialId: 1, turi: "Стандарт", sigimi: 2, band: 2, narx: 500000, bemorlar: ["Абдуллаев Камол", "Эргашев Бахром"] },
  { id: 2, raqam: "102", filialId: 1, turi: "Люкс", sigimi: 1, band: 1, narx: 1200000, bemorlar: ["Содикова Нигора"] },
  { id: 3, raqam: "103", filialId: 1, turi: "Стандарт", sigimi: 2, band: 0, narx: 500000, bemorlar: [] },
  { id: 4, raqam: "201", filialId: 2, turi: "Стандарт", sigimi: 2, band: 1, narx: 450000, bemorlar: ["Хамидова Дилбар"] },
  { id: 5, raqam: "202", filialId: 2, turi: "Люкс", sigimi: 1, band: 1, narx: 1100000, bemorlar: ["Рахматов Улуғбек"] },
  { id: 6, raqam: "301", filialId: 3, turi: "VIP", sigimi: 1, band: 0, narx: 2000000, bemorlar: [] },
  { id: 7, raqam: "302", filialId: 3, turi: "Стандарт", sigimi: 3, band: 2, narx: 400000, bemorlar: ["Мирзаева Шахноза", "Усмонов Фарход"] },
  { id: 8, raqam: "401", filialId: 4, turi: "Стандарт", sigimi: 2, band: 1, narx: 480000, bemorlar: ["Каримова Зарина"] },
];

export const navbatlar = [
  { id: 1, bemor: "Юсупов Аҳмад", shifokorId: 1, filialId: 1, vaqt: "09:00", holat: "Кутмоқда", navbatRaqam: 1 },
  { id: 2, bemor: "Мухаммадиева Дилдора", shifokorId: 1, filialId: 1, vaqt: "09:30", holat: "Кутмоқда", navbatRaqam: 2 },
  { id: 3, bemor: "Носиров Жавлон", shifokorId: 2, filialId: 1, vaqt: "10:00", holat: "Қабулда", navbatRaqam: 1 },
  { id: 4, bemor: "Салимова Гулчехра", shifokorId: 3, filialId: 2, vaqt: "09:15", holat: "Кутмоқда", navbatRaqam: 1 },
  { id: 5, bemor: "Қодиров Бекзод", shifokorId: 4, filialId: 2, vaqt: "10:30", holat: "Кутмоқда", navbatRaqam: 2 },
  { id: 6, bemor: "Турсунова Малика", shifokorId: 5, filialId: 3, vaqt: "11:00", holat: "Қабулда", navbatRaqam: 1 },
  { id: 7, bemor: "Ҳакимов Ойбек", shifokorId: 6, filialId: 3, vaqt: "14:00", holat: "Кутмоқда", navbatRaqam: 1 },
  { id: 8, bemor: "Рахимова Дилафруз", shifokorId: 7, filialId: 4, vaqt: "15:30", holat: "Кутмоқда", navbatRaqam: 1 },
];

export const telegramStatistika = {
  jami: 1256,
  bugun: 48,
  buHafta: 312,
  buOy: 1024,
  filialBoyicha: [
    { filialId: 1, soni: 356 },
    { filialId: 2, soni: 298 },
    { filialId: 3, soni: 342 },
    { filialId: 4, soni: 260 },
  ],
  shifokorBoyicha: [
    { shifokorId: 1, soni: 187 },
    { shifokorId: 2, soni: 156 },
    { shifokorId: 3, soni: 134 },
    { shifokorId: 4, soni: 198 },
    { shifokorId: 5, soni: 145 },
    { shifokorId: 6, soni: 167 },
    { shifokorId: 7, soni: 123 },
    { shifokorId: 8, soni: 146 },
  ],
  kelmaganlar: 87,
};

export const shikoyatlar = [
  { id: 1, bemor: "Тошматов Камол", filialId: 1, shifokorId: 1, matn: "Кутиш вақти жуда узоқ эди", sana: "2024-01-14", holat: "Кўрилмаган" },
  { id: 2, bemor: "Ражабова Гулнора", filialId: 2, shifokorId: 3, matn: "Навбат тартиби бузилган", sana: "2024-01-13", holat: "Кўрилган" },
  { id: 3, bemor: "Исматов Шухрат", filialId: 1, shifokorId: 2, matn: "Натижалар кечикди", sana: "2024-01-12", holat: "Кўрилган" },
  { id: 4, bemor: "Мирзаева Ойгул", filialId: 3, shifokorId: 5, matn: "Консултация қимматга тушди", sana: "2024-01-11", holat: "Кўрилмаган" },
  { id: 5, bemor: "Сафаров Фаррух", filialId: 4, shifokorId: 8, matn: "Ҳамшира хушмуомала эмас эди", sana: "2024-01-10", holat: "Кўрилган" },
];

export const moliyaStatistika = {
  bugun: 12500000,
  kecha: 11800000,
  buHafta: 78000000,
  buOy: 324000000,
  otganOy: 298000000,
  filialBoyicha: [
    { filialId: 1, tushum: 98000000, xarajat: 45000000, foyda: 53000000 },
    { filialId: 2, tushum: 76000000, xarajat: 38000000, foyda: 38000000 },
    { filialId: 3, tushum: 89000000, xarajat: 42000000, foyda: 47000000 },
    { filialId: 4, tushum: 61000000, xarajat: 35000000, foyda: 26000000 },
  ],
  xizmatBoyicha: [
    { xizmat: "Текширув", tushum: 45000000 },
    { xizmat: "Операция", tushum: 89000000 },
    { xizmat: "УЗИ", tushum: 34000000 },
    { xizmat: "МРТ", tushum: 56000000 },
    { xizmat: "ЭКГ", tushum: 28000000 },
    { xizmat: "Консултация", tushum: 72000000 },
  ],
};

export const kpiData = {
  bugungiTushum: 12500000,
  bugungiBemorlar: 156,
  bugungiNavbatlar: 89,
  bandPalatalar: 12,
  boshPalatalar: 8,
  telegramOrqali: 48,
};

export const alertlar = [
  { id: 1, turi: "xato", matn: "Чилонзор филиалда навбат кўп", vaqt: "10 дақиқа олдин" },
  { id: 2, turi: "ogohlantirish", matn: "Сергели филиалда палата йўқ", vaqt: "30 дақиқа олдин" },
  { id: 3, turi: "info", matn: "Юнусобод филиалда тушум пасайган", vaqt: "1 соат олдин" },
  { id: 4, turi: "xato", matn: "3 та шифокор бугун йўқ", vaqt: "2 соат олдин" },
];

export const oylikTushum = [
  { oy: "Янв", tushum: 280000000 },
  { oy: "Фев", tushum: 298000000 },
  { oy: "Мар", tushum: 312000000 },
  { oy: "Апр", tushum: 289000000 },
  { oy: "Май", tushum: 334000000 },
  { oy: "Июн", tushum: 356000000 },
  { oy: "Июл", tushum: 378000000 },
  { oy: "Авг", tushum: 345000000 },
  { oy: "Сен", tushum: 367000000 },
  { oy: "Окт", tushum: 389000000 },
  { oy: "Ноя", tushum: 412000000 },
  { oy: "Дек", tushum: 324000000 },
];

export const haftalikBemorlar = [
  { kun: "Душ", soni: 145 },
  { kun: "Сеш", soni: 167 },
  { kun: "Чор", soni: 134 },
  { kun: "Пай", soni: 189 },
  { kun: "Жум", soni: 178 },
  { kun: "Шан", soni: 98 },
  { kun: "Якш", soni: 45 },
];
