export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const Countries: Country[] = [
  // LATINOAMÉRICA
  // Sudamérica
  { code: 'PE', name: 'Perú', dialCode: '51', flag: '🇵🇪' },
  { code: 'AR', name: 'Argentina', dialCode: '54', flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia', dialCode: '591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', dialCode: '55', flag: '🇧🇷' },
  { code: 'CL', name: 'Chile', dialCode: '56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dialCode: '57', flag: '🇨🇴' },
  { code: 'EC', name: 'Ecuador', dialCode: '593', flag: '🇪🇨' },
  { code: 'GY', name: 'Guyana', dialCode: '592', flag: '🇬🇾' },
  { code: 'PY', name: 'Paraguay', dialCode: '595', flag: '🇵🇾' },
  { code: 'SR', name: 'Surinam', dialCode: '597', flag: '🇸🇷' },
  { code: 'UY', name: 'Uruguay', dialCode: '598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', dialCode: '58', flag: '🇻🇪' },
  
  // Centroamérica y Caribe
  { code: 'BZ', name: 'Belice', dialCode: '501', flag: '🇧🇿' },
  { code: 'CR', name: 'Costa Rica', dialCode: '506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', dialCode: '53', flag: '🇨🇺' },
  { code: 'DO', name: 'República Dominicana', dialCode: '1', flag: '🇩🇴' },
  { code: 'SV', name: 'El Salvador', dialCode: '503', flag: '🇸🇻' },
  { code: 'GT', name: 'Guatemala', dialCode: '502', flag: '🇬🇹' },
  { code: 'HT', name: 'Haití', dialCode: '509', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '504', flag: '🇭🇳' },
  { code: 'JM', name: 'Jamaica', dialCode: '1', flag: '🇯🇲' },
  { code: 'MX', name: 'México', dialCode: '52', flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua', dialCode: '505', flag: '🇳🇮' },
  { code: 'PA', name: 'Panamá', dialCode: '507', flag: '🇵🇦' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '1', flag: '🇵🇷' },
  { code: 'TT', name: 'Trinidad y Tobago', dialCode: '1', flag: '🇹🇹' },

  // NORTEAMÉRICA
  { code: 'CA', name: 'Canadá', dialCode: '1', flag: '🇨🇦' },
  { code: 'US', name: 'Estados Unidos', dialCode: '1', flag: '🇺🇸' },

  // EUROPA
  { code: 'AD', name: 'Andorra', dialCode: '376', flag: '🇦🇩' },
  { code: 'AT', name: 'Austria', dialCode: '43', flag: '🇦🇹' },
  { code: 'BE', name: 'Bélgica', dialCode: '32', flag: '🇧🇪' },
  { code: 'BG', name: 'Bulgaria', dialCode: '359', flag: '🇧🇬' },
  { code: 'HR', name: 'Croacia', dialCode: '385', flag: '🇭🇷' },
  { code: 'CY', name: 'Chipre', dialCode: '357', flag: '🇨🇾' },
  { code: 'CZ', name: 'República Checa', dialCode: '420', flag: '🇨🇿' },
  { code: 'DK', name: 'Dinamarca', dialCode: '45', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonia', dialCode: '372', flag: '🇪🇪' },
  { code: 'FI', name: 'Finlandia', dialCode: '358', flag: '🇫🇮' },
  { code: 'FR', name: 'Francia', dialCode: '33', flag: '🇫🇷' },
  { code: 'DE', name: 'Alemania', dialCode: '49', flag: '🇩🇪' },
  { code: 'GR', name: 'Grecia', dialCode: '30', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungría', dialCode: '36', flag: '🇭🇺' },
  { code: 'IS', name: 'Islandia', dialCode: '354', flag: '🇮🇸' },
  { code: 'IE', name: 'Irlanda', dialCode: '353', flag: '🇮🇪' },
  { code: 'IT', name: 'Italia', dialCode: '39', flag: '🇮🇹' },
  { code: 'LV', name: 'Letonia', dialCode: '371', flag: '🇱🇻' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '423', flag: '🇱🇮' },
  { code: 'LT', name: 'Lituania', dialCode: '370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxemburgo', dialCode: '352', flag: '🇱🇺' },
  { code: 'MT', name: 'Malta', dialCode: '356', flag: '🇲🇹' },
  { code: 'MD', name: 'Moldavia', dialCode: '373', flag: '🇲🇩' },
  { code: 'MC', name: 'Mónaco', dialCode: '377', flag: '🇲🇨' },
  { code: 'ME', name: 'Montenegro', dialCode: '382', flag: '🇲🇪' },
  { code: 'NL', name: 'Países Bajos', dialCode: '31', flag: '🇳🇱' },
  { code: 'MK', name: 'Macedonia del Norte', dialCode: '389', flag: '🇲🇰' },
  { code: 'NO', name: 'Noruega', dialCode: '47', flag: '🇳🇴' },
  { code: 'PL', name: 'Polonia', dialCode: '48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '351', flag: '🇵🇹' },
  { code: 'RO', name: 'Rumania', dialCode: '40', flag: '🇷🇴' },
  { code: 'RU', name: 'Rusia', dialCode: '7', flag: '🇷🇺' },
  { code: 'SM', name: 'San Marino', dialCode: '378', flag: '🇸🇲' },
  { code: 'RS', name: 'Serbia', dialCode: '381', flag: '🇷🇸' },
  { code: 'SK', name: 'Eslovaquia', dialCode: '421', flag: '🇸🇰' },
  { code: 'SI', name: 'Eslovenia', dialCode: '386', flag: '🇸🇮' },
  { code: 'ES', name: 'España', dialCode: '34', flag: '🇪🇸' },
  { code: 'SE', name: 'Suecia', dialCode: '46', flag: '🇸🇪' },
  { code: 'CH', name: 'Suiza', dialCode: '41', flag: '🇨🇭' },
  { code: 'UA', name: 'Ucrania', dialCode: '380', flag: '🇺🇦' },
  { code: 'GB', name: 'Reino Unido', dialCode: '44', flag: '🇬🇧' },
  { code: 'VA', name: 'Ciudad del Vaticano', dialCode: '39', flag: '🇻🇦' }
];