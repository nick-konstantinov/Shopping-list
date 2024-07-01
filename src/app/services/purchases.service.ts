import { Inject, Injectable } from '@angular/core';
import { Purchase } from '../models/purchase';
import { Category } from '../models/category';
import { CategoryService } from './category.service';
import { BehaviorSubject, take, tap } from 'rxjs';
import { PurchaseData, purchaseToken } from '../abstractions/purchase.data.service';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  private currentCategory: Category | undefined;

  private _countAllPurchasesToBuy$ = new BehaviorSubject<number>(0);
  public countAllPurchasesToBuy$ = this._countAllPurchasesToBuy$.asObservable();

  private _swiperCategories$ = new BehaviorSubject<Category[]>([]);
  public swiperCategories$ = this._swiperCategories$.asObservable();

  public countPurchasesPerCategory: Map<number, number> = new Map();
  public countAllPurchases: number = 0;

  private _selectedCategory$ = new BehaviorSubject<number | null>(null);
  public selectedCategory$ = this._selectedCategory$.asObservable();

  private _purchasesFiltered$ = new BehaviorSubject<Purchase[]>([]);
  public purchasesFiltered$ = this._purchasesFiltered$.asObservable();

  constructor(
    private categoryService: CategoryService,
    @Inject(purchaseToken) private purchaseData: PurchaseData
  ) {}

  public selectCategory(categoryId: number | null) {
    this._selectedCategory$.next(categoryId);
    this.filterPurchasesByCategoryId(categoryId);
  }

  public loadPurchases(): void {
    this.purchaseData.getAllPurchases().pipe(take(1)).subscribe((purchases) => this._purchasesFiltered$.next(purchases));
    this.purchaseData.countPurchasesToBuy().pipe(take(1)).subscribe(count => this._countAllPurchasesToBuy$.next(count));

    this.countPurchasesPerCategory = this.purchaseData.getSwiperCurrentCategoriesIds();
    this.swiperCategories$ = this.categoryService.getSwiperCurrentCategories(Array.from(this.countPurchasesPerCategory.keys()));
    this.countAllPurchases = Array.from(this.countPurchasesPerCategory.values()).reduce((acc, val) => acc + val, 0);
  }

  public filterPurchasesByCategoryId(categoryId: number | null){
    this.purchaseData.filterPurchasesByCategoryId(categoryId).pipe(take(1)).subscribe((purchases) => this._purchasesFiltered$.next(purchases));
  }

  public addPurchase(purchase: Omit<Purchase, 'id'>) {
    this.purchaseData.addPurchase(purchase).pipe(
      take(1),
      tap(() => this.loadPurchases())
    ).subscribe();

    this.categoryService.getCategoryById(purchase.category.id).subscribe(category => this.currentCategory = category);
  }

  public removePurchase(id: number) {
    this.purchaseData.removePurchaseById(id).pipe(
      take(1),
      tap(() => this.loadPurchases())
    ).subscribe();
  }

  public makeComplitePurchaseById(id: number) {
    this.purchaseData.makeComplitePurchaseById(id).pipe(take(1)).subscribe();
    this.purchaseData.countPurchasesToBuy().pipe(take(1)).subscribe(count => this._countAllPurchasesToBuy$.next(count));

    const purchaseIndex = this._purchasesFiltered$.value.findIndex(purchase => purchase.id === id);
    if (purchaseIndex !== -1) {
      const purchase = this._purchasesFiltered$.value[purchaseIndex];
      purchase.isCrossOut = !purchase.isCrossOut;

      return this._purchasesFiltered$.next([...this._purchasesFiltered$.value]);
    }
  }
}
