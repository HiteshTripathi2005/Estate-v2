import adminModel from "../models/admin.model.js";
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

    // Update the user's active status and last login time
    user.isActive = true;
    user.lastLogin = new Date();
    await user.save();

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
  try {
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, { isActive: false });
    }

    req.user = null;
    res.clearCookie("JWT", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 0,
    });
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in userLogout: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
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

      // Update active status and last login
      user.isActive = true;
      user.lastLogin = new Date();
      await user.save();
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
        isActive: true,
        lastLogin: new Date(),
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

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await adminModel.findOne({
      email,
    });

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
    console.error("Error in adminLogin: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    console.log(req.body);

    const userExists = await adminModel.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const user = await adminModel.create({
      userName,
      email,
      password,
    });

    generateToken(user._id, res);

    res
      .status(200)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.error("Error in adminRegister: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminGet = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "Admin fetched successfully",
    data: user,
  });
};

// Admin User Management Functions
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    let filter = {};

    // Apply status filters
    if (req.query.status === "active") {
      filter.isActive = true;
    } else if (req.query.status === "inactive") {
      filter.isActive = false;
    } else if (req.query.status === "verified") {
      filter.isVerified = true;
    } else if (req.query.status === "unverified") {
      filter.isVerified = false;
    }

    // Apply role filter
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Create sort object
    const sort = {};
    sort[sortBy] = order;

    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
      totalUsers,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserById: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Ensure only allowed fields are updated
    const allowedUpdates = {
      fullName: updateData.fullName,
      email: updateData.email,
      phone: updateData.phone,
      address: updateData.address,
      city: updateData.city,
      state: updateData.state,
      isActive: updateData.isActive,
      isVerified: updateData.isVerified,
    };

    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updatedUser = await User.findByIdAndUpdate(userId, allowedUpdates, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in blockUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in unblockUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User verified successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in verifyUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
