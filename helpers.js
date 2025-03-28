
//checks that string is not undefined/null, is of type string, and is not empty. Also trims the string and returns it
export const stringCheck = (str) => {
    if(!str) throw 'You must provide a value for all inputs.';
    if(typeof str !== 'string') throw 'Your input must be a string value.';
    str = str.trim();
    if(str.length === 0) throw 'Your string cannot be empty or consist of just spaces.';
    return str;
};

//checks that the number is a positive number
export const checkNum = (num) =>{
    num = parseFloat(num); //convert from string to float
    if(isNaN(num)) throw 'You must provide a numerical value.';
    if(num < 0) throw 'You must provide a positive number';
    return num;
};

//checks that paymentMethod is either "credit card", "PayPal", or "Apple Pay"
export const checkPaymentMethod = (paymentMethod) => {
    paymentMethod = paymentMethod.toLowerCase();
    if(paymentMethod !== "credit card" && paymentMethod !== "paypal" && paymentMethod !== "apple pay") throw 'paymentMethod can only be credit card, paypal, or apple pay';
    return paymentMethod;
};

//checks that paymentStatus is either "Paid", "Pending", or "Refunded"
export const checkPaymentStatus = (paymentStatus) => {
    paymentStatus = paymentStatus.toLowerCase();
    if(paymentStatus !== "paid" && paymentStatus !== "pending" && paymentStatus !== "refunded") throw 'paymentStatus can only be paid, pending, or refunded';
    return paymentStatus;
};