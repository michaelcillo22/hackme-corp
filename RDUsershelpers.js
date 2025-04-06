import { ObjectId } from 'mongodb';

const checkId = (id) => {
    if (!id) throw  'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a non-empty string';
    id = id.trim();
    if (id.length === 0)
        throw 'Error: id cannot be an empty string or just spaces';
    
    if (!ObjectId.isValid(id)) {
      throw 'Error: id must be a valid ObjectId';
    }
    
    return id;
};

const validateEmail = (str, name, minLength = 0 ) => {

    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    if (str.trim().length < minLength) {
        throw new Error(`${name} must be at least ${minLength} characters long`);
    }

    const emailRegex = /^[^\s@]+@[^\S@]+\.[^\S@]+$/;
    return emailRegex.test(str.trim());


}

const validatePassword = (str, name, minLength) => {

    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    if (str.trim().length < minLength) {
        throw new Error(`${name} must be at least ${minLength} characters long`);
    }
    console.log('Validating password:', str);

    // const passwordRegex = /[a-z].*[A-Z].*\d.*[@$!%*?&]/;
    // if (passwordRegex.test(str) === false) {
    //     throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol');
    // }
    if (!/[A-Z]/.test(str)) throw new Error('Password must contain at least one uppercase letter.');
    if (!/[a-z]/.test(str)) throw new Error('Password must contain at least one lowercase letter.');
    if (!/\d/.test(str)) throw new Error('Password must contain at least one digit.');
    if (!/[@$!%*?&]/.test(str)) throw new Error('Password must contain at least one special character.');




    

    return str.trim();

    
}


const validateString = (str, name, minLength = 0) => {
    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    if (str.trim().length < minLength) {
        throw new Error(`${name} must be at least ${minLength} characters long`);
    }
    if (name === 'userType' && str !== 'Seller' && str!== 'Buyer' ) {
      throw new Error('User type can only be a buyer or a seller');
    }
    

    return str.trim();
};


const helperMethods = { validateEmail, validatePassword, validateString, checkId };

export default helperMethods;
