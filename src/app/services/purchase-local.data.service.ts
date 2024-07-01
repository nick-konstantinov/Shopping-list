import { Inject, Injectable } from "@angular/core";
import { Purchase } from '../models/purchase';
import { PurchaseData } from "../abstractions/purchase.data.service";
import { map, mergeMap, Observable, of, tap } from 'rxjs';
import { CategoryData, categoryToken } from "../abstractions/category.data.service";

type PurchaseDTO = Omit<Purchase, 'category'> & { categoryId: number }

@Injectable()
export class PurchaseLocalDataService implements PurchaseData {
  private key = 'purchases';

  constructor(
    @Inject(categoryToken)
    private categoryLocalDataService: CategoryData
  ) {}

  private getAllPurchasesDto() {
    const purchaseCollection = localStorage.getItem(this.key);
    return (
      purchaseCollection ? JSON.parse(purchaseCollection) : []
    ) as PurchaseDTO[];
  }

  public getAllPurchases(): Observable<Purchase[]> {
    return this.categoryLocalDataService.getCategoriesDictionary().pipe(
      map((categoriesDictionary) => {
        return this.getAllPurchasesDto().map(
          ({ categoryId, ...purchaseDto }) => ({
            ...purchaseDto,
            category: categoriesDictionary[categoryId],
          })
        );
      })
    );
  }

  public getPurchasesByCategoryId(categoryId: number): Observable<Purchase[]> {
    return this.getAllPurchases().pipe(
      map((allPurchases) =>
        allPurchases.filter((purchase) => purchase.category.id === categoryId)
      )
    );
  }

  public addPurchase(purchase: Omit<Purchase, 'id'>): Observable<boolean> {
    return of(this.getAllPurchasesDto()).pipe(
      tap((purchaseCollection) => {
        const { category, ...purchaseDto } = purchase;
        purchaseCollection.push({
          ...purchaseDto,
          categoryId: category?.id,
          id: Date.now(),
        });
        localStorage.setItem(this.key, JSON.stringify(purchaseCollection));
      }),
      mergeMap(() => of(true))
    );
  }

  public removePurchaseById(purchaseId: number): Observable<boolean> {
    return of(this.getAllPurchasesDto()).pipe(
      tap((purchaseCollection) => {
        purchaseCollection = purchaseCollection.filter(
          (purchase) => purchase.id !== purchaseId
        );
        localStorage.setItem(this.key, JSON.stringify(purchaseCollection));
      }),
      mergeMap(() => of(true))
    );
  }

  public makeComplitePurchaseById(purchaseId: number): Observable<boolean> {
    return of(this.getAllPurchasesDto()).pipe(
      tap((purchaseCollection) => {
        const purchase = purchaseCollection.find(
          (purchase) => purchase.id === purchaseId
        );
        if (purchase) {
          purchase.isCrossOut = !purchase.isCrossOut;
          localStorage.setItem(this.key, JSON.stringify(purchaseCollection));
        } else {
          throw new Error('404');
        }
      }),
      mergeMap(() => of(true))
    );
  }

  public filterPurchasesByCategoryId(categoryId: null | number): Observable<Purchase[]> {
    if (categoryId === null) {
      return this.getAllPurchases();
    } else {
      return this.getPurchasesByCategoryId(categoryId);
    }
  }

  public getSwiperCurrentCategoriesIds(): Map<number, number> {
    const categoryIdsAndCount = new Map<number, number>();
    let count = 0;
    this.getAllPurchasesDto().forEach((purchase) => {
      if (purchase.categoryId && categoryIdsAndCount.get(purchase.categoryId)) {
        count = categoryIdsAndCount.get(purchase.categoryId) ?? 0;
        categoryIdsAndCount.set(purchase.categoryId, count + 1);
      } else {
        categoryIdsAndCount.set(purchase.categoryId, 1);
      }
    });

    return categoryIdsAndCount;
  }

  public countPurchasesToBuy(): Observable<number> {
    return of(this.getAllPurchasesDto().filter(purchase => !purchase.isCrossOut).length);
  }
}
