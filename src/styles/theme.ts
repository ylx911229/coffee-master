// 主题配置
export const theme = {
  colors: {
    // 主色调 - 咖啡色系
    primary: '#8B4513',      // 深褐色
    primaryLight: '#A0522D', // 浅褐色
    primaryDark: '#654321',  // 深咖啡色
    
    // 辅助色
    secondary: '#D2691E',    // 橙褐色
    accent: '#CD853F',       // 沙褐色
    
    // 功能色
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // 中性色
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    gray: '#9E9E9E', // 添加 gray 别名
    
    // 背景色
    background: '#FAFAFA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // 文字色
    text: '#212121',
    textSecondary: '#757575',
    textLight: '#BDBDBD',
    textOnPrimary: '#FFFFFF',
    
    // 边框色
    border: '#E0E0E0',
    divider: '#E0E0E0',
  },
  
  typography: {
    // 字体大小
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14,
    body1: 16,
    body2: 14,
    caption: 12,
    button: 14,
    
    // 字体粗细
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
    
    // 行高
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      loose: 1.6,
    },
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
    full: 999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  
  layout: {
    screenPadding: 16,
    cardPadding: 16,
    sectionSpacing: 24,
  },
}

export type Theme = typeof theme;