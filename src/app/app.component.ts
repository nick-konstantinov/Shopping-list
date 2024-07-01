import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchaseLocalDataService } from './services/purchase-local.data.service';
import { purchaseToken } from './abstractions/purchase.data.service';
import { categoryToken } from './abstractions/category.data.service';
import { CategoryLocalDataService } from './services/category-local.data.service';
import { CategoryService } from './services/category.service';
import { PurchasesService } from './services/purchases.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PurchasesComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {provide: purchaseToken, useClass: PurchaseLocalDataService},
    {provide: categoryToken, useClass: CategoryLocalDataService},
  ]
})
export class AppComponent implements OnInit{
  constructor(
    private categoryService: CategoryService,
    private purchasesService: PurchasesService
  ){}
  ngOnInit(): void {
    this.categoryService.getCategories();
    this.purchasesService.loadPurchases();
  }
  title = 'shopping-list';
}
