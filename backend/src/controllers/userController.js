const User = require('../models/User');

exports.syncUser = async (req, res) => {
  const { clerkId, email, firstName, lastName, profileImageUrl } = req.body;

  if (!clerkId || !email) {
    return res.status(400).json({ success: false, message: "clerkId and email are required" });
  }

  try {
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.profileImageUrl = profileImageUrl;
      user.lastLogin = Date.now();
      await user.save();
    } else {
      // Create new user
      user = new User({
        clerkId,
        email,
        firstName,
        lastName,
        profileImageUrl
      });
      await user.save();
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Sync User Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
