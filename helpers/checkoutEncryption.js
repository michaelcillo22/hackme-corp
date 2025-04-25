import crypto from "crypto";

const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16;

export const encryptCardData = (data) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted
    };
};


