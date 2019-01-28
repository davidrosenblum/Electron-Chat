// all possible PIN values
const PIN_VALUES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

// PIN generator class - makes PINs!
class PinGenerator{
    constructor(length=16){
        this._pins = {};            // all stored pins 
        this._length = length;      // pin size to generate
    }

    // generates a random pin (not unique)
    static anyPIN(length=16){
        // buffer for pin characters
        let vals = new Array(length);

        // generate <length> amount of characters from the possible pin values
        for(let i = 0; i < length; i++){
            vals[i] = PIN_VALUES[Math.floor(Math.random() * vals.length)];
        }

        // return the buffer as a string 
        return vals.join("");
    }

    // generates a unique pin 
    nextPIN(){
        // generate a new pin, while its not already taken
        let pin; 
        do{
            pin = PinGenerator.anyPIN(this.length);
        } while(this.hasPIN(pin));

        // got a unique pin - store and return
        this._pins[pin] = true;
        return pin;
    }

    // true/false if pin is in use
    hasPIN(pin){
        return pin in this._pins;
    }

    // destroys pin from storage
    releasePIN(pin){
        return delete this._pins[pin];
    }

    // pin size to generate 
    get length(){
        return this._length;
    }
}

module.exports = {PinGenerator};