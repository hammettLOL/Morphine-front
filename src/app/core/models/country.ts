export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const Countries: Country[] = [
  { code: 'PE', name: 'Perú', dialCode: '51', flag: '🇵🇪' },
  { code: 'US', name: 'Estados Unidos', dialCode: '1', flag: '🇺🇸' },
  { code: 'CO', name: 'Colombia', dialCode: '57', flag: '🇨🇴' },
  { code: 'EC', name: 'Ecuador', dialCode: '593', flag: '🇪🇨' },
  { code: 'AR', name: 'Argentina', dialCode: '54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '56', flag: '🇨🇱' },
  { code: 'MX', name: 'México', dialCode: '52', flag: '🇲🇽' },
  { code: 'ES', name: 'España', dialCode: '34', flag: '🇪🇸' }
];