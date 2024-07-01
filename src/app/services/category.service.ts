import { Inject, Injectable } from '@angular/core';
import { Category } from '../models/category';
import { BehaviorSubject, Observable, of, take, tap } from 'rxjs';
import { CategoryData, categoryToken } from '../abstractions/category.data.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _categories$ = new BehaviorSubject<Category[]>([]);
  public categories$ = this._categories$.asObservable();

  private _categorySlides$ = new BehaviorSubject<Category[]>([]);
  public categorySlides$ = this._categorySlides$.asObservable();

  constructor(
    @Inject(categoryToken) private categoryData: CategoryData
  ) {}

  public getCategoryById(id: number): Observable<Category> {
    return this.categoryData.getCategoryById(id).pipe(
      take(1),
      tap(() => this.getCategories())
    );
  }

  public addCategory(name: string): number {
    const dublicateCategory = this._categories$.getValue().find(category => category.name === name);
    if(!dublicateCategory) {
      const newCategory = {
        id: Date.now(),
        name: name,
        colour: this.generateCategoryColour()
      };
      this.categoryData.addCategory(newCategory).pipe(
        take(1),
        tap(() => this.getCategories())
      ).subscribe();

      return newCategory.id;
    } else {
      return dublicateCategory.id;
    }
  }

  private generateCategoryColour() {
    const colour = Math.random().toString(16).substr(-6);
    return '#' + colour + '80';
  }

  public getCategories(): void {
    this.categoryData.getCategories().subscribe(categories => this._categories$.next(categories));
  }

  public getSwiperCurrentCategories(categoryIds: number[]): Observable<Category[]> {
    return this.categoryData.getCategoriesByIds(categoryIds);
  }
}