import bcrypt from "bcryptjs";  
import User from "../models/signupModel.js";
import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = "123922841654-i1jujo69c525uji333d5q2v8rksq5est.apps.googleusercontent.com"; 
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Creating a user object without sensitive data
    const userForClient = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    };

    res.status(200).json({ message: "Login successful!", user: userForClient });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { googleToken, email, name, profileImage } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (payload.email !== email) {
      return res.status(400).json({ message: "Email verification failed" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        profileImage,
        googleId: payload.sub,
      });

      await user.save();
    } else if (profileImage && (!user.profileImage || user.profileImage !== profileImage)) {
      user.profileImage = profileImage;
      await user.save();
    }

    const userForClient = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isGoogleUser: true,
    };

    return res.status(200).json({
      message: "Google login successful",
      user: userForClient,
    });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};