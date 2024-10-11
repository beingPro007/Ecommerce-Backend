import Router from "express"
import { verifyJwt } from "../middlewares/verifyJWT.miidleware.js";
import { checkRole } from "../middlewares/verifyRole.middleware.js";
import { 
    addAddress,
    addProfilePicture,
    deleteProfile,
    deleteProfilePicture,
    profile,
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

router.route("/profile").get(
    verifyJwt,
    checkRole(['customer']),
    profile
)

router.route("/profile/addAdress").post(
    verifyJwt,
    checkRole(['customer']),
    addAddress
)

router.route("/profile/deleteProfile").delete(
    verifyJwt,
    checkRole(['customer']),
    deleteProfile
)

router
  .route('/profile/deleteDp')
  .post(verifyJwt, checkRole(['customer']), deleteProfilePicture);

export default router