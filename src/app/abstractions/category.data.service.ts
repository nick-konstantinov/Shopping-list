import { Observable } from "rxjs";
import { Category } from "../models/category";
import { InjectionToken } from "@angular/core";

export interface CategoryData {
    getCategoryById(categoryId: number): Observable<Category>;
    getCategories(): Observable<Category[]>;
    addCategory(category: Category): Observable<void>;
    removeCategoryById(categoryId: number): Observable<void>;
    getCategoriesDictionary(): Observable<Record<string, Category>>;
    getCategoriesByIds(categoryIds: number[]): Observable<Category[]>;
}

export const categoryToken = new InjectionToken<CategoryData>('CategoryDataInterface')