import jwt from "jsonwebtoken";

/**
 * An Express middleware function to verify user authentication.
 * This function runs before any protected route controller.
 */
const isAuthenticated = async (req,res,next) => {
    try {
        // Retrieve the JWT from the 'token' cookie sent by the client.
        const token = req.cookies.token; 
        
        // If no token is found, the user is not authenticated.
        if(!token){
            return res.status(401).json({
                message:"User not authenticated.",
                success:false
            })
        }
        
        // Verify the token using the secret key. This will throw an error if the token
        // is invalid or expired. 'decode' will contain the payload (e.g., { userId: '...' }).
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
        
        // Attach the decoded user ID to the request object.
        // This makes the user's ID available in all subsequent controller functions.
        req.user = decode.userId;
        
        // Pass control to the next middleware or the route's controller function.
        next();
    } catch (error) {
        // Handle potential errors, like an invalid token.
        console.log(error);
        return res.status(401).json({
            message: "Invalid token.",
            success: false
        });
    }
}

export default isAuthenticated;
