import jwt from "jsonwebtoken";

export const GenerateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Set cookie for web clients
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false, // Change only in localhost
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // Return the token so it can be included in the JSON response
    return token;
};
