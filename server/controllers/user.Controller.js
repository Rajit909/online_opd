// controllers/signInController.js
import db from "../config/db.js"; // Import MySQL connection or pool
import bcrypt from "bcryptjs"; // Ensure passwords are hashed in the DB

// Login handler
export const signIn = (req, res) => {
  const { mobile, password } = req.body;

  // Validation: Check if both mobile and password are provided
  if (!mobile || !password) {
    return res
      .status(400)
      .json({ message: "Mobile and password are required!" });
  }

  // Query the database for the user by mobile
  const sql = "SELECT * FROM users WHERE mobile = ?";
  db.query(sql, [mobile], async (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid mobile number or password." });
    }

    const user = results[0];

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid mobile number or password." });
    }

    // Successful login
    const responseData = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
    };

    return res
      .status(200)
      .json({ message: "Login successful!", user: responseData });
  });
};

// verify mobile
export const verifyMobile = (req, res) => {
  const { mobile } = req.body;

  // Validation: Check if mobile is provided
  if (!mobile) {
    return res.status(400).json({ message: "Mobile is required!" });
  }

  // Query the database for the user by mobile
  const sql = "SELECT * FROM users WHERE mobile = ?";
  db.query(sql, [mobile], async (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Internal server error." });
    }
    // console.log(results);
    // Check if the database returned mobile number is same as the one provided
    const filteredResults = results.filter((user) => user.mobile === mobile);
    // print the filtered users mobile number
    console.log(filteredResults[0].mobile);
    if (filteredResults.length === 0) {
      return res.status(401).json({ message: "Invalid mobile number." });
    } else {
      // genrate otp
      const otp = 2222; //Math.floor(1000 + Math.random() * 9000);
      console.log(otp);
      // expiry time for otp in date and time in local time zone
      const expiry_time = new Date(new Date().getTime() + 5 * 60000);

      console.log(expiry_time);
      // store otp in db
      const sql =
        "INSERT INTO otp_verification (mobile, otp, expiry_time) VALUES (?, ?, ?)";
      db.query(sql, [mobile, otp, expiry_time], async (err, results) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ message: "Internal server error." });
        }
        return res
          .status(200)
          .json({ message: "OTP sent successfully!", otp: otp });
      });
    }
  });
};

// verify otp
export const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  // Validation: Check if mobile and otp are provided
  if (!mobile || !otp) {
    return res.status(400).json({ message: "Mobile and OTP are required!" });
  }

  // Query the database for the user by mobile
  const sql = "SELECT * FROM otp_verification WHERE mobile = ?";
  db.query(sql, [mobile], async (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid mobile number or OTP." });
    }

    const user = results[0];
    console.log(user);

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid mobile number or OTP." });
    }

    // Check if the OTP is expired
    const currentTime = new Date();
    const expiryTime = new Date(user.expiry_time);
    if (currentTime > expiryTime) {
      return res.status(401).json({ message: "OTP has expired." });
    }

    // Successful OTP verification
    return res.status(200).json({ message: "OTP verified successfully!" });
  });
};

// Register handler
export const signUp = (req, res) => {
  const { name, mobile, password } = req.body;

  // Validation: Check if all fields are provided
  if (!name || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    // Insert the user into the database
    const sql = "INSERT INTO users (name, mobile, password) VALUES (?, ?, ?)";
    db.query(sql, [name, mobile, hash], async (err, results) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({ message: "Internal server error." });
      }

      return res.status(200).json({ message: "User registered successfully!" });
    });
  });
};

// logout handler
export const logOut = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out Successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = (req, res) => {
  const { name, mobile, password } = req.body;

  // Validation: Check if all fields are provided
  if (!name || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    const sql = "UPDATE users SET name = ?, password = ? WHERE mobile = ?";
    db.query(sql, [name, hash, mobile], async (err, results) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({ message: "Internal server error." });
      }

      return res.status(200).json({ message: "Profile updated successfully!" });
    });

  });
};