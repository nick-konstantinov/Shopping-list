import { map, mapTo, Observable, of, tap } from 'rxjs';
import { CategoryData } from "../abstractions/category.data.service";
import { Category } from "../models/category";
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryLocalDataService implements CategoryData {

    private key = 'categories';

    private defaultCategories = [
        {
          id: 1,
          name: 'Uncategorized',
          colour: '#CFD8D780'
        },
        {
          id: 2,
          name: 'Products',
          colour: '#0200F580'
        },
        {
          id: 3,
          name: 'Drinks',
          colour: '#F29D0080'
        },
        {
          id: 4,
          name: 'Clothes',
          colour: '#F5050580'
        },
        {
          id: 5,
          name: 'Medicine',
          colour: '#34632780'
        },
        {
          id: 6,
          name: 'Home stuff',
          colour: '#9D85FF80'
        },
        {
          id: 7,
          name: 'Education',
          colour: '#1967d280'
        }
    ];

    private getCategoryCollection(): Category[] {
        const categoryCollection = localStorage.getItem(this.key);
        const customCategories = categoryCollection ? JSON.parse(categoryCollection) : [];
        if (customCategories.length !== 0) {
            return customCategories;
        } else {
            return [...this.defaultCategories, ...customCategories]
        }

    }

    public getCategoryById(categoryId: number): Observable<Category> {
        const categoryCollection = this.getCategoryCollection();
        const category = categoryCollection.find(category => category.id === categoryId);
        if (category) {
            return of(category);
        } else {
            throw new Error('404');
        }
    }

    public getCategoriesByIds(categoryIds: number[]): Observable<Category[]> {
        const categoryCollection = this.getCategoryCollection();
        const returnCategories: Category[] = [];
        categoryIds.forEach(id => {
            const category = categoryCollection.find(category => category.id === id);
            if (category) {
                returnCategories.push(category);
            }
        });

        return of(returnCategories);
    }

    public getCategories(): Observable<Category[]> {
        const categoryCollection = this.getCategoryCollection();
        return of(categoryCollection);
    }

    public getCategoriesDictionary(): Observable<Record<number, Category>> {
        return this.getCategories().pipe(
            map(categories => categories.reduce((acc, categorie) => {
                acc[categorie.id] = categorie
                return acc;
            }, {} as any ))
        );
    }

    public addCategory(category: Category): Observable<void> {
        return this.getCategories().pipe(
            tap(categories => {
                categories.push(category);

                localStorage.setItem(this.key, JSON.stringify(categories));
            }),
            mapTo(void 0)
        );
    }

    public removeCategoryById(categoryId: number): Observable<void> {
        return this.getCategories().pipe(
            map(categories => {
                categories.filter(category => category.id !== categoryId);
                localStorage.setItem(this.key, JSON.stringify(categories));
            }),
            mapTo(void 0)
        )
    }
}
