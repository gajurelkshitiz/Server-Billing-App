const updateOwnProfile = async (req, res) => {
  const allowedFields = [
    "name", "email", "profileImage", "phoneNo", "password",
    "country", "city", "province", "address"
  ];

  // Collect updates from body
  let updates = Object.keys(req.body);

  // If a file is uploaded, treat profileImage as an update
  if (req.file && req.file.path) {
    updates.push("profileImage");
  }

  // Validate updates
  const isValidOperation = updates.every((update) =>
    allowedFields.includes(update)
  );
  if (!isValidOperation) {
    throw new BadRequestError("Invalid Updates");
  }

  const admin = await Admin.findById(req.user.tokenID);
  if (!admin) {
    throw new notFoundError(`No Admin Found`);
  }

  // Handle profile image upload
  if (req.file && req.file.path) {
    const uploaded = await uploadOnCloudinary(
      req.file.path,
      `${Date.now()}-${req.file.originalname}`,
      "BILL APP/ADMIN PROFILES"
    );
    if (uploaded && uploaded.url) {
      req.body.profileImage = uploaded.url;
    }
  }

  // Update fields
  updates.forEach((update) => {
    if (update === "profileImage" && req.body.profileImage) {
      admin.profileImage = req.body.profileImage;
    } else if (req.body[update] !== undefined) {
      admin[update] = req.body[update];
    }
  });

  await admin.save();
  res.status(StatusCodes.OK).json({ admin });
};