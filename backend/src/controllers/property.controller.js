import Property from "../models/property.model.js";
import { User } from "../models/users.model.js";
import uploadImage from "../utils/cloudinary.js";

export const uploadProperty = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      description,
      price,
      propertyType,

      status,
    } = req.body;

    const location = JSON.parse(req.body.location);
    const features = JSON.parse(req.body.features);

    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !propertyType ||
      !status ||
      !features
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required of the property" });
    }

    let imagesUrl = [];
    for (let file of req.files) {
      let path = `${file.destination}${file.filename}`;
      let imageUrl = await uploadImage(path);

      if (!imageUrl) {
        return res.status(500).json({ message: "Error uploading image" });
      }

      imagesUrl.push(imageUrl);
    }

    const property = await Property.create({
      title,
      description,
      price,
      location,
      propertyType,
      status,
      features,
      images: imagesUrl,
      owner: user._id,
      isActive: true,
    });

    return res
      .status(201)
      .json({ message: "Property uploaded successfully", data: property });
  } catch (error) {
    console.log("Error uploading property: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      isActive: true,
    }).select(
      "title description price location.city location.latitude location.longitude propertyType status images features"
    );

    res
      .status(200)
      .json({ message: "Properties fetched successfully", data: properties });
  } catch (error) {
    console.log("Error getting properties: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userProperties = async (req, res) => {
  const { _id } = req.user;
  try {
    const userProperties = await Property.find({ owner: _id }).select(
      "title description price location.city location.latitude location.longitude propertyType status images features"
    );

    if (!userProperties) {
      return res.status(404).json({ message: "User has no properties" });
    }

    res.status(200).json({
      message: "User properties fetched successfully",
      data: userProperties,
    });
  } catch (error) {
    console.log("Error getting user properties: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPropertyInfo = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const propertyInfo = await Property.findById(id).populate({
      path: "owner",
      select: "fullName email profilePic",
    });

    if (!propertyInfo) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property info fetched successfully",
      data: propertyInfo,
    });
  } catch (error) {
    console.log("Error getting property info: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    // Find the property and check if the user is the owner
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this property" });
    }

    const { title, description, price, propertyType, status, isActive } =
      req.body;

    // Create an update object with the fields that are provided
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (propertyType) updateData.propertyType = propertyType;
    if (status) updateData.status = status;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle location update if provided
    if (req.body.location) {
      try {
        const location = JSON.parse(req.body.location);
        if (location) {
          updateData.location = {
            address: location.address || property.location.address,
            city: location.city || property.location.city,
            state: location.state || property.location.state,
            zipCode: location.zipCode || property.location.zipCode,
          };
        }
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid location data format" });
      }
    }

    // Handle features update if provided
    if (req.body.features) {
      try {
        const features = JSON.parse(req.body.features);
        if (features) {
          updateData.features = {
            bedrooms: features.bedrooms || property.features.bedrooms,
            bathrooms: features.bathrooms || property.features.bathrooms,
            squareFeet: features.squareFeet || property.features.squareFeet,
            parking:
              features.parking !== undefined
                ? features.parking
                : property.features.parking,
            furnished:
              features.furnished !== undefined
                ? features.furnished
                : property.features.furnished,
          };
        }
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid features data format" });
      }
    }

    // Handle image uploads if provided
    if (req.files && req.files.length > 0) {
      let imagesUrl = [];
      for (let file of req.files) {
        let path = `${file.destination}${file.filename}`;
        let imageUrl = await uploadImage(path);

        if (!imageUrl) {
          return res.status(500).json({ message: "Error uploading image" });
        }

        imagesUrl.push(imageUrl);
      }

      // If we have new images, update the images array
      if (imagesUrl.length > 0) {
        updateData.images = imagesUrl;
      }
    }

    // Update the property with all the changes at once
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.log("Error updating property: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;

    await Property.findByIdAndDelete(id);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.log("Error deleting property: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const purchaseProperty = async (req, res) => {
  const { id: propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.isPurchased) {
      return res.status(400).json({ message: "Property already purchased" });
    }

    property.isPurchased = true;
    await property.save();

    res.status(200).json({ message: "Property purchased successfully" });
  } catch (error) {
    console.log("Error purchasing property: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addToWatchlist = async (req, res) => {
  const userId = req.user._id;
  const { propertyId } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await User.findById(userId);
    if (user.watchlist.includes(propertyId)) {
      return res.status(400).json({ message: "Property already in watchlist" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { watchlist: propertyId } },
      { new: true }
    ).populate("watchlist");

    res.status(200).json({
      message: "Property added to watchlist",
      watchlist: updatedUser.watchlist,
    });
  } catch (error) {
    console.error("Error adding to watchlist: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const userId = req.user._id;
  const { propertyId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: propertyId } },
      { new: true }
    ).populate("watchlist");

    res.status(200).json({
      message: "Property removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Error removing from watchlist: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWatchlist = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate("watchlist");
    res.status(200).json({
      message: "Watchlist fetched successfully",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Error fetching watchlist: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const demo = async (req, res) => {
  try {
    const user = req.user;

    const {
      title,
      description,
      price,
      location,
      propertyType,
      status,
      features,
      images,
      isActive,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      price,
      location,
      propertyType,
      status,
      owner: user._id,
      features,
      images,
      isActive,
    });

    res.status(201).json({
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error creating property: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
