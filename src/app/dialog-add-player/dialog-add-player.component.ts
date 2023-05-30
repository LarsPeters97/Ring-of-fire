import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss'],
})
export class DialogAddPlayerComponent {
  name: string = '';
  selectedImage!: string;
  profilePictures: Array<string> = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png',
    '8.png',
    '9.png',
  ];

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  onNoClick() {
    this.dialogRef.close();
  }

  selectImage(profilePicture: string) {
    this.selectedImage = profilePicture;
  }
}
