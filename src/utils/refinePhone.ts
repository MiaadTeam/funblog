const persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
  englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const toEnglishNumbers = function (phone: string) {
  for (let i = 0; i < 10; i++) {
    phone = phone.replace(persianNumbers[i], englishNumbers[i]);
    phone = phone.replace(arabicNumbers[i], englishNumbers[i]);
  }
  return phone;
};
// ^(\+965\d{7})$
export function fixPrefix(phone: string): string {
  switch (true) {
    case /^[569]\d{7}$/.test(phone): //normal
      phone = "965" + phone;
      break;
    case /^(\+)?[569]\d{7}$/.test(phone): //+
      phone = phone.replace("+", "965");
      break;
    case /^(0)?[569]\d{7}$/.test(phone): //0
      phone = phone.replace("0", "965");
      break;
    case /^(\+0)?[569]\d{7}$/.test(phone): //+0
      phone = phone.replace("+0", "965");
      break;
    case /^(00)?[569]\d{7}$/.test(phone): //+00
      phone = phone.replace("00", "965");
      break;
    case /^(\+00)?[569]\d{7}$/.test(phone): //+00
      phone = phone.replace("+00", "965");
      break;
    case /^(\+965)?[569]\d{7}$/.test(phone): //+965
      phone = phone.replace("+965", "965");
      break;
  }

  return phone;
}

export function refinePhone(phone: string): string {
  const en = toEnglishNumbers(phone);
  return fixPrefix(en);
}
