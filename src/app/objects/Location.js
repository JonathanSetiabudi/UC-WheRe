class Location{
    constructor(name, descriptionInput, imageInput, difficultyLevel, locationTypeInput){
        this.name = name;                           // set name for each location
        this.isFlagged = false;                     // set flag to off by default
        this.description = descriptionInput;        // use string input as description 
        this.img = imageInput;                      // use png/jpg/heic input as img
        this.difficulty = difficultyLevel;          // use string input as difficulty  (can be used for filtering difficulty levels)
        this.locationType = locationTypeInput;      // use string input as location type (can be used for filtering when creating gamemode types/difficulty levels)
    }

    toggleFlag(){
        this.isFlagged = !this.isFlagged;
    }


}
