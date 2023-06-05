import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-player',
  templateUrl: './dialog-edit-player.component.html',
  styleUrls: ['./dialog-edit-player.component.scss'],
})
export class DialogEditPlayerComponent {
  name!: string;
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

  constructor(
    public dialogRef: MatDialogRef<DialogEditPlayerComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; selectedImage: string }
  ) {
    this.ngOninit();
  }

  ngOninit(): void {
    this.name = this.data.name;
    this.selectedImage = this.data.selectedImage;
  }

  selectImage(profilePicture: string) {
    this.selectedImage = profilePicture;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
