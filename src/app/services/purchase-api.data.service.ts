import { Observable } from "rxjs";
import { PurchaseData } from "../abstractions/purchase.data.service";
import { Purchase } from "../models/purchase";

export class PurchaseApiDataService implements PurchaseData {
    countPurchasesToBuy(): Observable<number> {
        throw new Error("Method not implemented.");
    }
    getSwiperCurrentCategoriesIds(): Map<number, number> {
        throw new Error("Method not implemented.");
    }
    getAllPurchases(): Observable<Purchase[]> {
        throw new Error("Method not implemented.");
    }
    getPurchasesByCategoryId(id: number): Observable<Purchase[]> {
        throw new Error("Method not implemented.");
    }
    addPurchase(purchase: Purchase): Observable<boolean> {
        throw new Error("Method not implemented.");
    }
    removePurchaseById(id: number): Observable<boolean> {
        throw new Error("Method not implemented.");
    }
    makeComplitePurchaseById(purchaseId: number): Observable<boolean> {
        throw new Error("Method not implemented.");
    }
    filterPurchasesByCategoryId(categoryId: number | null): Observable<Purchase[]> {
        throw new Error("Method not implemented.");
    }

}