import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  private static readonly USER_DATA_KEY = '@CoffeeAI:userData';
  private static readonly BREWING_RECORDS_KEY = '@CoffeeAI:brewingRecords';
  private static readonly TASTING_RECORDS_KEY = '@CoffeeAI:tastingRecords';
  private static readonly COFFEE_BEANS_KEY = '@CoffeeAI:coffeeBeans';
  private static readonly USER_PREFERENCES_KEY = '@CoffeeAI:userPreferences';

  // 通用存储方法
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
      throw error;
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      throw error;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
      throw error;
    }
  }

  // 用户数据相关方法
  static async saveUserData(userData: any): Promise<void> {
    return this.setItem(this.USER_DATA_KEY, userData);
  }

  static async getUserData(): Promise<any | null> {
    return this.getItem(this.USER_DATA_KEY);
  }

  static async clearUserData(): Promise<void> {
    return this.removeItem(this.USER_DATA_KEY);
  }

  // 制作记录相关方法
  static async saveBrewingRecord(record: any): Promise<void> {
    const existingRecords = await this.getBrewingRecords() || [];
    existingRecords.push(record);
    return this.setItem(this.BREWING_RECORDS_KEY, existingRecords);
  }

  static async getBrewingRecords(): Promise<any[] | null> {
    return this.getItem(this.BREWING_RECORDS_KEY);
  }

  static async updateBrewingRecord(recordId: string, updatedRecord: any): Promise<void> {
    const existingRecords = await this.getBrewingRecords() || [];
    const index = existingRecords.findIndex(record => record.id === recordId);
    if (index !== -1) {
      existingRecords[index] = updatedRecord;
      return this.setItem(this.BREWING_RECORDS_KEY, existingRecords);
    }
    throw new Error('Brewing record not found');
  }

  static async deleteBrewingRecord(recordId: string): Promise<void> {
    const existingRecords = await this.getBrewingRecords() || [];
    const filteredRecords = existingRecords.filter(record => record.id !== recordId);
    return this.setItem(this.BREWING_RECORDS_KEY, filteredRecords);
  }

  // 品鉴记录相关方法
  static async saveTastingRecord(record: any): Promise<void> {
    const existingRecords = await this.getTastingRecords() || [];
    existingRecords.push(record);
    return this.setItem(this.TASTING_RECORDS_KEY, existingRecords);
  }

  static async getTastingRecords(): Promise<any[] | null> {
    return this.getItem(this.TASTING_RECORDS_KEY);
  }

  static async updateTastingRecord(recordId: string, updatedRecord: any): Promise<void> {
    const existingRecords = await this.getTastingRecords() || [];
    const index = existingRecords.findIndex(record => record.id === recordId);
    if (index !== -1) {
      existingRecords[index] = updatedRecord;
      return this.setItem(this.TASTING_RECORDS_KEY, existingRecords);
    }
    throw new Error('Tasting record not found');
  }

  static async deleteTastingRecord(recordId: string): Promise<void> {
    const existingRecords = await this.getTastingRecords() || [];
    const filteredRecords = existingRecords.filter(record => record.id !== recordId);
    return this.setItem(this.TASTING_RECORDS_KEY, filteredRecords);
  }

  // 咖啡豆数据相关方法
  static async saveCoffeeBean(bean: any): Promise<void> {
    const existingBeans = await this.getCoffeeBeans() || [];
    existingBeans.push(bean);
    return this.setItem(this.COFFEE_BEANS_KEY, existingBeans);
  }

  static async getCoffeeBeans(): Promise<any[] | null> {
    return this.getItem(this.COFFEE_BEANS_KEY);
  }

  static async updateCoffeeBean(beanId: string, updatedBean: any): Promise<void> {
    const existingBeans = await this.getCoffeeBeans() || [];
    const index = existingBeans.findIndex(bean => bean.id === beanId);
    if (index !== -1) {
      existingBeans[index] = updatedBean;
      return this.setItem(this.COFFEE_BEANS_KEY, existingBeans);
    }
    throw new Error('Coffee bean not found');
  }

  static async deleteCoffeeBean(beanId: string): Promise<void> {
    const existingBeans = await this.getCoffeeBeans() || [];
    const filteredBeans = existingBeans.filter(bean => bean.id !== beanId);
    return this.setItem(this.COFFEE_BEANS_KEY, filteredBeans);
  }

  // 用户偏好设置相关方法
  static async saveUserPreferences(preferences: any): Promise<void> {
    return this.setItem(this.USER_PREFERENCES_KEY, preferences);
  }

  static async getUserPreferences(): Promise<any | null> {
    return this.getItem(this.USER_PREFERENCES_KEY);
  }

  static async updateUserPreference(key: string, value: any): Promise<void> {
    const existingPreferences = await this.getUserPreferences() || {};
    existingPreferences[key] = value;
    return this.setItem(this.USER_PREFERENCES_KEY, existingPreferences);
  }

  // 数据备份和恢复
  static async exportAllData(): Promise<any> {
    try {
      const allData = {
        userData: await this.getUserData(),
        brewingRecords: await this.getBrewingRecords(),
        tastingRecords: await this.getTastingRecords(),
        coffeeBeans: await this.getCoffeeBeans(),
        userPreferences: await this.getUserPreferences(),
        exportDate: new Date().toISOString(),
      };
      return allData;
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  }

  static async importAllData(data: any): Promise<void> {
    try {
      if (data.userData) await this.saveUserData(data.userData);
      if (data.brewingRecords) await this.setItem(this.BREWING_RECORDS_KEY, data.brewingRecords);
      if (data.tastingRecords) await this.setItem(this.TASTING_RECORDS_KEY, data.tastingRecords);
      if (data.coffeeBeans) await this.setItem(this.COFFEE_BEANS_KEY, data.coffeeBeans);
      if (data.userPreferences) await this.saveUserPreferences(data.userPreferences);
    } catch (error) {
      console.error('Import data error:', error);
      throw error;
    }
  }
}