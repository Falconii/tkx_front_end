import { Injectable } from '@angular/core';
import { ParametroModel } from '../models/parametro-model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

private storage!: Storage;

constructor() {
  this.storage = window.localStorage;
 }

setParametroModel(key: string, param: ParametroModel): void {
  this.storage.setItem(key, JSON.stringify(param));
}

getParametroModel(key: string): ParametroModel | null {
  const item = this.storage.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch {
    console.warn(`Erro ao parsear o valor de ${key}`);
    return null;
  }
}
removeItem(key: string): void {
  this.storage.removeItem(key);
}

setNumber(key: string, value: number): void {
  this.storage.setItem(key, value.toString());
}

getNumber(key: string): number | null {
  const value = this.storage.getItem(key);
  return value ? Number(value) : null;
}

setString(key: string, value: string): void {
  this.storage.setItem(key, value);
}

getString(key: string): string | null {
  return this.storage.getItem(key);
}

setBoolean(key: string, value: boolean): void {
  this.storage.setItem(key, value.toString());
}

getBoolean(key: string): boolean | null {
  const value = this.storage.getItem(key);
  return value !== null ? value === 'true' : null;
}

hasKey(key: string): boolean {
  return this.storage.getItem(key) !== null;
}

getAllKeys(): string[] {
  return Object.keys(this.storage);
}

clear(): void {
  this.storage.clear();
}

}
