import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PurchasesService } from '../services/purchases.service';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PurchasesComponent implements AfterViewInit, OnChanges {
  @ViewChild('swiperThumbs') swiperThumbs!: ElementRef<SwiperContainer>;

  public swiperIndex: number = 0;
  public isCross = false;

  constructor(
    private popupService: PopupService,
    public purchasesService: PurchasesService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.swiperThumbs.nativeElement.swiper.update();
  }

  ngAfterViewInit() {
    this.swiperThumbs.nativeElement.swiper.activeIndex = this.swiperIndex;
    this.purchasesService.purchasesFiltered$.subscribe(() => {
      setTimeout(() => {
        this.swiperThumbs.nativeElement.swiper.update();
      })
    });
  }

  public slideChange(swiper: any) {
    this.swiperIndex = swiper.detail[0].activeIndex;
  }

  public openPopup() {
    this.popupService.openPopup();
  }

  public deletePurchase(id: number) {
    this.purchasesService.removePurchase(id);
  }
}
