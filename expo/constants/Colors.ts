/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


// primary color(primary tint) from uiGradients Ibiza Sunset gradient

export const Colors = {
  light: {
    text: '#11181C',
    textMuted: '#00a2ff90',
    background: '#f0f0f0ff',
    surface: '#ffffff',
    primary: '#ee0979',
    primaryTint: '#ee0979bb',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    borderColor: '#ccccd8ff',
    borderRadius: 4,
    standardBodyHorizontalMargin: 20,
  },
  dark: {
    text: '#ECEDEE',
    textMuted: '#ecedee90',
    background: '#151718',
    surface: '#2a2a2a',
    primary: '#ee0979',
    primaryTint: '#ee0979bb',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    borderColor: '#484848',
    borderRadius: 4,
    standardBodyHorizontalMargin: 20,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    weights: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
};
