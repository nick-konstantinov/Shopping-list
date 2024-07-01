import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../services/popup.service';
import { CategoryService } from '../services/category.service';
import { PurchasesService } from '../services/purchases.service';
import { Category } from '../models/category';
import { FormsModule } from '@angular/forms';
import { Observable, startWith } from 'rxjs';
import { Purchase } from '../models/purchase';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit {
  @ViewChild('newCategory')
  newCategory!: { nativeElement: { value: null; }; };

  public categories$: Observable <Category[]>;
  public inputClass: string = 'hidden-input';
  public btnClass: string = 'add-btn';
  public currentCategoryId: number | null = null;
  public currentNameCategory: string = '';
  public purchase?: Purchase;

  public nameModel = '';
  public categoryIdModel?: string;

  public count!: number;

  constructor(
    private popupService: PopupService,
    private categoryService: CategoryService,
    private purchaseService: PurchasesService,
    ) {
      this.categories$ = this.categoryService.categories$.pipe(startWith([]));
  }

  ngOnInit() {
    this.categoryIdModel = '';
  }

  public closeDialog() {
    this.popupService.closePopup();
  }

  public toggleShowInput(inputName: string) {
    if (inputName === 'new-category') {
      this.inputClass = this.inputClass === 'show-input' ? 'hidden-input' : 'show-input';
      this.btnClass = this.btnClass === 'add-btn' ? 'close-btn' : 'add-btn';
    }
  }

  public resetInput() {
    this.newCategory.nativeElement.value = null;
  }

  public firstLetterToUppercase(str: string): string {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  public addNewCategory(name: string, inputName: string) {
    if (name) {
      this.currentNameCategory = this.firstLetterToUppercase(name);

      this.currentCategoryId = this.categoryService.addCategory(this.currentNameCategory)!;
      this.resetInput();
      this.toggleShowInput(inputName);
    }
  }

  public onSubmit() {
    this.nameModel = this.firstLetterToUppercase(this.nameModel);
    this.purchaseService.addPurchase({name: this.nameModel, category: {id: Number(this.currentCategoryId || this.categoryIdModel as string)} as Category, isCrossOut: false});
    this.closeDialog();
  }
}
