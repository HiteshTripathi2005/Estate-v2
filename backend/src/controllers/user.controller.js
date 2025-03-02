import uploadImage from "../utils/cloudinary.js";
import generateToken from "../utils/jwt.js";
import { User } from "./../models/users.model.js";

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passMatch = await user.matchPassword(password);

    if (!passMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    console.error("Error in userLogin: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { userName, fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!userName || !fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let path;

    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    if (req.file) {
      const { destination, filename } = req?.file;
      path = `${destination}${filename}`;
    }

    if (!path) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const imgurl = await uploadImage(path);

    if (!imgurl) {
      return res.status(400).json({ message: "Error uploading image" });
    }

    const newUser = await User.create({
      userName,
      fullName,
      email,
      password,
      profilePic: imgurl,
    });

    if (!newUser) {
      return res.status(500).json({ message: "Error creating user" });
    }

    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password"
    );

    generateToken(newUser._id, res);

    return res.status(201).json({
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in userRegister: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userLogout = async (req, res) => {
  req.user = null;
  res.clearCookie("JWT", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "user logout" });
};

export const userUpdate = async (req, res) => {
  try {
    const { userName } = req.body;
    let updateData = {};
    console.log("updateData");
    console.log(req.file);

    // Check if there's anything to update
    if (!req.file && !userName) {
      return res.status(400).json({ message: "No update data provided" });
    }

    // Handle profile picture update
    if (req.file) {
      const { destination, filename } = req.file;
      const path = `${destination}${filename}`;
      const imgurl = await uploadImage(path);

      if (!imgurl) {
        return res.status(400).json({ message: "Error uploading image" });
      }

      updateData.profilePic = imgurl;
    }

    // Handle username update
    if (userName) {
      updateData.userName = userName;
    }

    // Update user with all changes at once
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in userUpdate: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userGet = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "User fetched successfully",
    data: user,
  });
};

export const googleLogin = async (req, res) => {
  try {
    const { email, fullName, profilePic, googleId } = req.body;

    if (!email || !googleId) {
      return res
        .status(400)
        .json({ message: "Email and Google ID are required" });
    }

    // Check if user already exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create a new user with a random username based on their name
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const userName = `${fullName.split(" ")[0].toLowerCase()}${randomSuffix}`;

      // Create new user
      user = await User.create({
        userName,
        fullName,
        email,
        googleId,
        profilePic: profilePic || "",
      });
    }

    // Generate JWT token
    generateToken(user._id, res);

    // Return user data without password
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    return res.status(200).json({
      message: "Google login successful",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in googleLogin: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
