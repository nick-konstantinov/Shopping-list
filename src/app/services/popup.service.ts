import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  // dialogRef?: MatDialogRef <any>;
  constructor(private dialog: MatDialog) {}

  openPopup() {
    this.dialog.open(PopupComponent);
  }

  closePopup() {
    this.dialog.closeAll();
  }
}
