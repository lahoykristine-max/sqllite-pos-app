/**
 * Design tokens extracted from the "Lab4" Figma file.
 *
 * Colours were read from the Figma REST API and de-duplicated for the layered
 * `fills` arrays the file uses (Figma paints fills bottom-up, so the LAST solid
 * entry is the visible one). Every value here was cross-checked against a 2x
 * pixel sample of the rendered frames.
 *
 * Note on screen titles: the source file gives Inventory/POS/Payment/Reports
 * titles different black opacities (0.76 / 0.44 / 0.31 / 0.42), which reads as
 * an inconsistency rather than intent. We use a single dark title colour.
 */

export const colors = {
  // Surfaces
  bg: '#F5F5FB',
  card: '#FFFFFF',
  border: '#E8E8F2',
  divider: '#DDDDED',
  gridline: '#D6D6E8',
  radioBorder: '#CFD0E0',

  // Text
  text: '#1E1B3A',
  textSecondary: '#6B6F8A',
  ink: '#000000',
  onBrand: '#FFFFFF',

  // Indigo accent (prices, active tab, selected states)
  indigo: '#4F46E5',
  indigoSoft: '#E0E7FF',
  indigoLine: '#C7D2FE',

  // Greens
  green: '#389C76', // primary buttons + active chips
  greenDeep: '#2A7A5D', // dashboard header
  greenBright: '#16A34A', // success text + confirm button
  greenSoft: '#DCFCE7', // icon tiles, soft fills
  greenMid: '#6EB59C',
  greenPale: '#AED7C7',
  greenFaint: '#BBDAD2',
  greenPeak: '#47A381',

  // Status
  amber: '#F59E0B',
  amberSoft: '#FEF3C7',
  rose: '#E11D48',
  roseSoft: '#FFE4E6',
  blue: '#0284C7',
} as const;

/** Corner radii straight from the Figma nodes. */
export const radius = {
  sm: 9,
  md: 10,
  chip: 11,
  button: 14,
  card: 16,
  panel: 20,
  hero: 22,
  pill: 15,
  round: 999,
} as const;

/** 390pt-wide artboard with 20pt gutters. */
export const layout = {
  gutter: 20,
  cardWidth: 350,
  cardPadding: 16,
  tabBarHeight: 84,
  tabBarTop: 760,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Inter type scale (size / weight / lineHeight) as defined in Figma. */
export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const type = {
  eyebrow: { fontSize: 13, lineHeight: 16, fontFamily: font.medium },
  screenTitle: { fontSize: 24, lineHeight: 29, fontFamily: font.bold },
  section: { fontSize: 16, lineHeight: 19, fontFamily: font.bold },
  rowTitle: { fontSize: 15, lineHeight: 18, fontFamily: font.semibold },
  rowMeta: { fontSize: 12, lineHeight: 15, fontFamily: font.regular },
  rowPrice: { fontSize: 16, lineHeight: 19, fontFamily: font.bold },
  button: { fontSize: 16, lineHeight: 19, fontFamily: font.semibold },
  tabLabel: { fontSize: 11, lineHeight: 13, fontFamily: font.medium },
  tiny: { fontSize: 11, lineHeight: 13, fontFamily: font.semibold },
} as const;

/** Card shadow used across the design. */
export const cardShadow = {
  shadowColor: '#1E1B3A',
  shadowOpacity: 0.07,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

export const peso = (value: number): string =>
  `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

export const pesoExact = (value: number): string =>
  `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;