import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCluodinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //  return res.status(200).json({ message: "chai or code" });
  //step 1 collect the user details
  //step 2 validate the deatails - is empty or other validations
  //step 3 check if your already exists: username, email
  //step 4 check for images , check for avatar
  //step 5 upload them on cloudinary
  //step 6 create user object - create entry in db
  //step 7 remove password and refresh token field from response
  //step 8 check for user creation
  //step 9 return res

  //step 1
  const { fullname, email, username, password } = req.body;
  console.log("email :", email);
  console.log("password :", password);
  console.log("username :", username);
  //step 2 validate the user details - empty or not
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //step 3
  const isExistUser = await User.findOne({
    // this is or or oprator
    $or: [{ email }, { username }],
  });
  if (isExistUser) {
    throw new ApiError(409, "User with email or username is already exists");
  }

  //step 4 check for images , check for avatar

  const avatarLocalPtha = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPtha) {
    throw new ApiError(400, "avatar file is required");
  }

  //step 5 upload them on cloudinary
  const avatar = await uploadOnCluodinary(avatarLocalPtha);
  const coverImage = await uploadOnCluodinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  ////step 6 create user object - create entry in db
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //step 7 remove password and refresh token field from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //step 8 check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return await res
    .status(201)
    .json(new ApiResponses(200, createdUser, "user registered successfully!"));
});

export { registerUser };
