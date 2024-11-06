class Helper {

    static generateRandomNumber(length: number) {
        var text = "";
        var possible = "0123456789";

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        return Number(text)
    }
}

export default Helper