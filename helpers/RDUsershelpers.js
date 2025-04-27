



const validateEmail = (str, name) => {

    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(str.trim())) {
        throw new Error(`${name} must be a valid email address.`);

    }
    return str.trim().toLowerCase();


};

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
    if (name === 'userType' && str !== 'seller' && str!== 'buyer' ) {
      throw new Error('User type can only be a buyer or a seller');
    }
    

    return str.trim().toLowerCase();
};


const helperMethods = { validateEmail, validatePassword, validateString };

export default helperMethods;
