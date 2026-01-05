export class ConfigService {
  get(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
      console.warn(`ConfigService: Warning! Property "${key}" is not defined.`);
    }
    return value!;
  }

  getNumber(key: string, defaultValue: number): number {
    const value = this.get(key);
    return value ? parseInt(value, 10) : defaultValue;
  }
}
