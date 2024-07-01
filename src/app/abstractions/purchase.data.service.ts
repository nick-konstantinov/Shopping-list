import { InjectionToken } from "@angular/core";
import { Purchase } from "../models/purchase";
import { Observable } from "rxjs";

export interface PurchaseData {
    getAllPurchases(): Observable<Purchase[]>;
    getPurchasesByCategoryId(id: number): Observable<Purchase[]>;
    addPurchase(purchase: Omit<Purchase, 'id'>): Observable<boolean>;
    removePurchaseById(id: number): Observable<boolean>;
    makeComplitePurchaseById(purchaseId: number): Observable<boolean>;
    filterPurchasesByCategoryId(categoryId: null | number): Observable<Purchase[]>;
    getSwiperCurrentCategoriesIds(): Map<number, number>;
    countPurchasesToBuy(): Observable<number>;
}
export const purchaseToken = new InjectionToken<PurchaseData>('PurchaseDataInterface')
