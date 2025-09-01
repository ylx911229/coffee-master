// 咖啡豆类型定义
export interface CoffeeBean {
  id: string;
  name: string;
  origin: string;
  roastLevel: 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  processingMethod: 'Washed' | 'Natural' | 'Honey' | 'Semi-Washed';
  flavorProfile: FlavorProfile;
  price?: number;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
}

// 风味特征
export interface FlavorProfile {
  aroma: FlavorNote[];
  flavor: FlavorNote[];
  acidity: number; // 1-5
  body: number; // 1-5
  aftertaste: number; // 1-5
  sweetness: number; // 1-5
  bitterness: number; // 1-5
}

// 风味调性
export interface FlavorNote {
  name: string;
  intensity: number; // 1-5
  category: 'Floral' | 'Fruity' | 'Sweet' | 'Nutty' | 'Chocolate' | 'Spicy' | 'Others';
}

// AI识别结果
export interface RecognitionResult {
  beanType: string;
  confidence: number;
  origin: string;
  roastLevel: string;
  processingMethod: string;
  flavorProfile: FlavorProfile;
  recommendedBrewing: BrewingMethod[];
  imageUrl?: string;
}

// 冲泡方法
export interface BrewingMethod {
  id: string;
  name: string;
  equipment: Equipment;
  difficulty: number; // 修改为 number 以修复类型错误
  estimatedTime: number; // 分钟
  steps: BrewingStep[];
  parameters: BrewingParameters;
}

// 设备信息
export interface Equipment {
  id: string;
  name: string;
  type: 'Pour Over' | 'Espresso' | 'French Press' | 'AeroPress' | 'Cold Brew';
  brand?: string;
  model?: string;
  imageUrl?: string;
}

// 冲泡步骤
export interface BrewingStep {
  id: number;
  title: string;
  instruction: string;
  duration: number; // 秒
  waterAmount?: number; // ml
  temperature?: number; // 摄氏度
  tips?: string;
  videoUrl?: string;
  imageUrl?: string;
}

// 冲泡参数
export interface BrewingParameters {
  grindSize: string;
  coffeeAmount: number; // 克
  waterAmount: number; // ml
  waterTemp: number; // 摄氏度
  brewTime: number; // 秒
  ratio: string; // 如 "1:15"
  pourPattern?: string;
}

// 制作记录
export interface BrewingRecord {
  id: string;
  userId: string;
  recipeId: string;
  coffeeBeanId: string;
  parameters: BrewingParameters;
  result: BrewingResult;
  rating: number;
  notes: string;
  createdAt: Date;
}

// 制作结果
export interface BrewingResult {
  actualTime: number;
  yield: number; // ml
  extractionRate?: number;
  photos?: string[];
}

// 品鉴记录
export interface TastingRecord {
  id: string;
  userId: string;
  brewingRecordId: string;
  overallScore: number;
  aromaScore: number;
  flavorScore: number;
  acidityScore: number;
  bodyScore: number;
  aftertasteScore: number;
  flavorWheel: FlavorWheelData;
  notes: string;
  photos?: string[];
  createdAt: Date;
}

// 风味轮数据
export interface FlavorWheelData {
  floral: number;
  fruity: number;
  sweet: number;
  nutty: number;
  chocolate: number;
  spicy: number;
  acidic: number;
  bitter: number;
}

// 用户信息
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: string;
  experience: number;
  preferences: UserPreferences;
  equipment: Equipment[];
  createdAt: Date;
}

// 用户偏好
export interface UserPreferences {
  favoriteOrigins: string[];
  preferredRoastLevel: string[];
  equipmentPreferences: string[];
  flavorPreferences: FlavorProfile;
}

// 导航类型定义
export type RootStackParamList = {
  Tabs: undefined;
  Recognition: undefined;
  RecognitionResult: { result: RecognitionResult };
  RecipeDetail: { recipe: BrewingMethod };
  BrewingGuide: { recipe: BrewingMethod; bean: CoffeeBean };
  TastingRecord: { brewingRecord: BrewingRecord };
  Profile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Recipes: undefined;
  Community: undefined;
  Profile: undefined;
};

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 错误类型
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// 组件Props类型
export interface ComponentProps {
  children?: React.ReactNode;
  style?: any;
  testID?: string;
}

// 常用状态类型
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}