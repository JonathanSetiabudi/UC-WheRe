class Location{
    constructor(name, descriptionInput, imageInput){
        this.name = name;                           // set name for each location
        this.isFlagged = false;                     // set flag to off by default
        this.description = descriptionInput;        // use string input as description 
        this.img = imageInput;                      // use png/jpg/heic input as imageInput
    }

    toggleFlag(){
        this.isFlagged = !this.isFlagged;
    }


}
