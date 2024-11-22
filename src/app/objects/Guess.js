import { Location } from './Location.js'

class Guess{
    constructor(Location){
        this.gLocationName = Location.name;
    }

    guessLocation(Location, Guess) {
        return Location.name === Guess.gLocationName;
    }
}