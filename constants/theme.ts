export const theme = {
  colors: {
    // Brand Colors
    primary: '#E63946',      // Breaking news red
    primaryDark: '#C1121F',
    primaryLight: '#FF6B77',
    
    // Background
    background: '#0D0D0D',
    surface: '#1A1A1A',
    surfaceElevated: '#242424',
    surfaceHover: '#2A2A2A',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#707070',
    
    // Semantic
    success: '#06D6A0',
    warning: '#FFB703',
    error: '#E63946',
    info: '#118AB2',
    
    // Category Colors
    local: '#06D6A0',
    trending: '#FFB703',
    crime: '#E63946',
    politics: '#118AB2',
    business: '#8338EC',
    weather: '#06D6A0',
    entertainment: '#FF006E',
    
    // Neutral
    border: '#2A2A2A',
    borderLight: '#333333',
    divider: '#1F1F1F',
    overlay: 'rgba(0, 0, 0, 0.85)',
  },
  
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
    },
    weights: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
