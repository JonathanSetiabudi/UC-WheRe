// had to rename class from "class Location" to "LocationClass" since "Location" is already defined within TypeScript library
export default class LocationClass {
  // CHANGE imageInput type to whatever filepath we're using for images
  // CHANGE imageInput type to whatever filepath we're using for images
  // CHANGE imageInput type to whatever filepath we're using for images

  // defining variable types
  name: string;
  isFlagged: boolean;
  isSelected_HC: boolean;
  description: string;
  img: string;
  // difficulty: number;
  locationType: string;

  // setting variables to whatever input inside the
  constructor(
    name: string,
    descriptionInput: string,
    imageInput: string,
    //difficultyLevel: number,
    locationTypeInput: string,
  ) {
    this.name = name; // set name for each location
    this.isFlagged = false; // set flag to off by default
    this.isSelected_HC = false;
    this.description = descriptionInput; // use string input as description
    this.img = imageInput; // use png/jpg/heic input as img
    // this.difficulty = difficultyLevel; // use string input as difficulty  (can be used for filtering difficulty levels)
    this.locationType = locationTypeInput; // use string input as location type (can be used for filtering when creating gamemode types/difficulty levels)
  }

  toggleFlag() {
    this.isFlagged = !this.isFlagged;
  }

  checkFlag() {
    if (this.isFlagged == true) {
      return true;
    } else {
      return false;
    }
  }

  toggleSelection() {
    this.isSelected_HC = !this.isSelected_HC;
    return this;
  }

  checkSelection() {
    if (this.isSelected_HC == true) {
      return true;
    } else {
      return false;
    }
  }
}
