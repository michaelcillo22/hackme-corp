const validateEmail = (str, name) => {

    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(str.trim())) {
        throw new Error(`${name} must be a valid email address.`);

    }
    return str.trim();


};

const validatePassword = (str, name, minLength) => {

    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    if (str.trim().length < minLength) {
        throw new Error(`${name} must be at least ${minLength} characters long`);
    }
    
    console.log('Validating password:', str);

    
    if (!/[A-Z]/.test(str)) throw new Error('Password must contain at least one uppercase letter.');
    if (!/[a-z]/.test(str)) throw new Error('Password must contain at least one lowercase letter.');
    if (!/\d/.test(str)) throw new Error('Password must contain at least one digit.');
    if (!/[@$!%*?&]/.test(str)) throw new Error('Password must contain at least one special character.');




    

    return str.trim();

    
}


const validateString = (str, name, minLength = 0, maxLength = 0) => {
    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    if (str.trim().length < minLength) {
        throw new Error(`${name} must be at least ${minLength} characters long`);
    }
    if (str.trim().length > maxLength) {
        throw new Error(`${name} must be at least ${maxLength} characters long`);
    }
    
    if (name === 'userType' && str !== 'Seller' && str!== 'Buyer' ) {
      throw new Error('User type can only be a buyer or a seller');
    }
    

    return str.trim();
};

let loginForm = document.getElementById('login-form');
let loginEmail = loginForm?.querySelector('#emailAddressInput');
let loginPassword = loginForm?.querySelector('#passwordInput');

let registrationForm = document.getElementById('registration-form');
let userName = document.getElementById('userNameInput');
let regEmail = registrationForm?.querySelector('#emailAddressInput');
let regPassword = registrationForm?.querySelector('#passwordInput');
let regConfirmPassword = document.getElementById('confirmPasswordInput');
let userType = document.getElementById('roleInput');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const errors = [];
        const emailValue = loginEmail.value.trim();
        const passwordValue = loginPassword.value;

        try {
            validateEmail(emailValue, 'Email Address');
        } catch (e) {
            errors.push(e);
        }

        try {
            validatePassword(passwordValue, 'Password', 8);
        } catch (e) {
            errors.push(e);
        }
        if (errors.length > 0) {
            alert(errors.join('\n'));
        } else {
            loginForm.submit();
        }

    });
}

if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = [];
        const emailValue = regEmail.value.trim();
        const passwordValue = regPassword.value;
        const userNameValue = userName.value.trim();
        const confirmPasswordValue = regConfirmPassword.value;
        const userTypeValue = userType.value;

        try {
            validateString(userNameValue, 'User Name', 3, 25);
        } catch (e) {
            errors.push(e);
        }

        try {
            validateEmail(emailValue, 'Email Address');
        } catch (e) {
            errors.push(e);
        }

        try {
            validatePassword(passwordValue, 'Password', 8);
        } catch (e) {
            errors.push(e);
        }
        if (passwordValue !== confirmPasswordValue) {
            errors.push('Passwords do not match');
        }
        if (userTypeValue !== 'buyer' && userTypeValue !== 'seller') {
            errors.push('Role must be either "buyer" or "seller"');
        } 
        if (errors.length > 0) {
            alert(errors.join('\n'));
        } else {
            registrationForm.submit();
        }

    });
}