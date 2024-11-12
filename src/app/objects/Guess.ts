import { LocationClass } from './Location'

class Guess{

    guessLocationName: string;

    constructor(inputLocation: LocationClass){
        this.guessLocationName = inputLocation.name;
    }

    guessLocation(Location: LocationClass, Guess: Guess) {
        return Location.name === Guess.guessLocationName;
    }
}

