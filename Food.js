class Food {
  constructor() {
    this.foodStock = 0;
  }

  updateFoodStock(stock) {
    this.foodStock = stock;
  }

  getFoodStock() {
    return this.foodStock;
  }

  display() {
    if (this.foodStock <= 0) return;

    let x = 80;
    let y = 100;

    for (let i = 0; i < this.foodStock; i++) {
      image(milkImg, x, y, 50, 50);
      x += 60;
      if (i % 5 === 4) {
        x = 80;
        y += 60;
      }
    }
  }
}
