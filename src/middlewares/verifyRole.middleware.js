import { ApiError } from "../utils/ApiError.js"

export const checkRole = (roles) => {
    return (req, _, next) => {
        if(!roles || !roles.includes(req.user.role)){
            throw new ApiError(404, "You must need admin account to do this")
        }
        next();
    } 
}