// Typography scale focusing on high readability (Elder-friendly UI)
import { Platform } from 'react-native';

export const FONTS = {
  // Font Families (using system font stacks for zero setup overhead)
  family: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),

  // Font Sizes (Enlarged slightly for senior friendliness)
  size: {
    caption: 12,
    body: 16,        // Large default body font size (not 14)
    subtitle: 18,    // Prominent secondary headings
    title: 22,       // Clear screen headers
    headline: 28,    // Extremely bold and legible emergency titles
    giant: 36,       // Used for emergency badges/big numbers
  },

  // Font Weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export default FONTS;
