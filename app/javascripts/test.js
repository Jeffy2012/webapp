function Person() {
    this.name = "Jeffy";
    this.age = 28;
    this.height = 170;
    this.info = function () {
        return this.name;
    };
    this.birthday = function () {
        this.age++;
        return this;
    };
}