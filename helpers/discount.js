const showDiscount = (discount) => {
    if (discount > 0)
        return true;
    return false;
}

const calculateNewPrice = (price, discount) => {
    price = (price - (price * (discount / 100))).toFixed(2);
    return price;
}

function getDiscountAmount(price, discount) {
    if (price < 0) throw new Error("Price cannot be negative");
    return price * (discount / 100);
}

module.exports = {showDiscount, calculateNewPrice, getDiscountAmount};