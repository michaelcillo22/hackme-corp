


export const validateString = (str, name, minLength = 0) => {
    if (!str || typeof str !== 'string' || str.trim().length === 0) {
        throw `${name} must be a non-empty string`;
    }
    if (str.trim().length < minLength) {
        throw new Error(`${name} must be at least ${minLength} characters long`);
    }
    // if (name === 'userType' && str !== 'Seller' && str!== 'Buyer' ) {
    //   throw new Error('User type can only be a buyer or a seller');
    // }
    

    return str.trim();
};

export const checkId = (id) => {
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

