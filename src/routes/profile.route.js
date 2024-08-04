import Router from "express"
import { verifyJwt } from "../middlewares/verifyJWT.miidleware.js";
import { checkRole } from "../middlewares/verifyRole.middleware.js";
import { 
    addProfilePicture,
    updateProfile,
 } from "../controllers/profile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/profile/profilePicture").patch(
    verifyJwt,
    checkRole(['customer']),
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        }
    ]),
    addProfilePicture,
)

router.route("/profile/updateProfile").patch(
    verifyJwt,
    checkRole(['customer']),
    updateProfile
)

export default router