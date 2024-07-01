import { Observable } from "rxjs";
import { CategoryData } from "../abstractions/category.data.service";
import { Category } from "../models/category";

export class CategoryApiDataService implements CategoryData {
    getCategoriesByIds(categoryIds: number[]): Observable<Category[]> {
        throw new Error("Method not implemented.");
    }
    addCategorySlides(category: Category): Observable<void> {
        throw new Error("Method not implemented.");
    }
    getCategoriesDictionary(): Observable<Record<string, Category>> {
        throw new Error("Method not implemented.");
    }
    getCategoryById(categoryId: number): Observable<Category> {
        throw new Error("Method not implemented.");
    }
    getCategories(): Observable<Category[]> {
        throw new Error("Method not implemented.");
    }
    addCategory(category: Category): Observable<void> {
        throw new Error("Method not implemented.");
    }
    removeCategoryById(categoryId: number): Observable<void> {
        throw new Error("Method not implemented.");
    }
}