export default class Cart {
  items = {};
  totalQty = 0;
  totalPrice = 0;

  constructor(oldCart = {}) {
    Object.assign(this, {
      items: oldCart.items || {},
      totalQty: oldCart.totalQty || 0,
      totalPrice: oldCart.totalPrice || 0,
    });
  }

  add = (item, id) => {
    const storedItem = this.items[id] ??= { item, qty: 0, price: 0 };
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  reduceByOne = (id) => {
    const storedItem = this.items[id];
    if (!storedItem) return;

    storedItem.qty--;
    storedItem.price -= storedItem.item.price;
    this.totalQty--;
    this.totalPrice -= storedItem.item.price;

    if (storedItem.qty <= 0) {
      delete this.items[id];
    }
  };

  removeItem = (id) => {
    if (!this.items[id]) return;

    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  generateArray = () => Object.values(this.items);
}
