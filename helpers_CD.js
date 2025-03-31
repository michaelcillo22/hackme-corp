// Validation file for any validation checks
import {ObjectId} from "mongodb";

const exportedMethods = {
    checkId(id, varName) {

        // Check if an id is provided
        if (!id) {
            throw `Error: You must provide a ${varName}`;
        }

        // Check if id is a string
        if (typeof id !== 'string') {
            throw `Error: ${varName} must be a string`;
        }

        // Trim string id
        id = id.trim();

        // Check if id is empty or only contains empty spaces
        if (id.length === 0) {
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        }

        // Check if id is a valid ObjectID
        if (!ObjectId.isValid(id)) {
            throw `Error: ${varName} invalid object ID`;
        }

        return id;
    },

    checkString(strVal, varName) {

        // Check if a string is provided
        if (!strVal) {
            throw `Error: You must supply a ${varName}!`;
        }

        // Check if it is a string type
        if (typeof strVal !== 'string') {
            throw `Error: ${varName} must be a string!`;
        }

        // Trim string
        strVal = strVal.trim();

        // Check if string is empty or only has spaces
        if (strVal.length === 0) {
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        }

        // Check if it has any digits
        if (!isNaN(strVal)) {
            throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        }

        return strVal;
    },

    checkValidURL(url, varName) {

        // Check using regex
        let urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/;

        if (!urlRegex.test(url)) {
            throw `Error: ${url} is not a valid ${varName}`;
        }

        return url;
    },

    checkStringArray(arr, varName) {

        // Check if array is provided and if it's a valid one
        if (!arr || !Array.isArray(arr)) {
            throw `You must provide an array of ${varName}`;
        }
        
        // Iterate through the array
        for (let i in arr) {
            if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
                throw `One or more elements in ${varName} array is not a string or is an empty string`;
            }

            // Check if each one is a valid URL
            if (!this.checkValidURL(arr[i], "URL")) {
                throw `${arr[i]} is not a valid URL`;
            }

            // Trim each one
            arr[i] = arr[i].trim();
        }
    
        return arr;
    },


};

export default exportedMethods;