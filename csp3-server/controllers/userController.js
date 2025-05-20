const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
    try {
        // List of required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'mobileNo', 'password'];
        
        // Check if all required fields are present
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).send({ 
                error: "All fields are required", 
                missingFields 
            });
        }
        
        // Validate email format
        if (!req.body.email.includes("@")) {
            return res.status(400).send({ error: "Email invalid" });
        }
        
        // Validate mobile number length
        if (req.body.mobileNo.length !== 11) {
            return res.status(400).send({ error: "Mobile number must be 11 digits" });
        }
        
        // Validate password length
        if (req.body.password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).send({ error: "Email already registered" });
        }
        
        // If all validations pass, create and save the user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10)
        });
        
        await newUser.save();
        res.status(201).send({ message: "Registered successfully" });
        
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send({ error: "Server error during registration" });
    }
};

module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")){
		User.findOne({ email : req.body.email })
		.then(result => {
			// if the email is not found in the database
			if(result == null){
				// send the message to the user
				return res.status(404).send({ error: "No Email Found" });
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
				if (isPasswordCorrect) {
					return res.status(200).send({ access : auth.createAccessToken(result)})
				} else {
					return res.status(401).send({ error: "Email and password do not match" });
				}
			}
		})
		.catch(err => res.status(500).send({ error: "Error in find" }))
	}
	else {
		return res.status(400).send({ error: "Invalid Email" })
	}
};

module.exports.getProfile = (req, res) => {
	const userId = req.user.id;

   return User.findById(userId)
        .then(user => {
            if (!user) {
            	res.status(404).send({ error: 'User not found' });
            }

            // Exclude sensitive information like password
            user.password = undefined;
			return res.status(200).send( user );
        })
        .catch(err => res.status(500).send({ error: 'Failed to fetch user profile', details: err }));
};

module.exports.resetPassword = async (req, res) => {
  const userId = req.user.id;
  const { newPassword } = req.body;

  try {
    // Hash the new password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).send({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to reset password', details: err.message });
  }
};

module.exports.setAsAdmin = (req,res) => {
	console.log(req.params.id)
	return User.findById(req.params.id)
	.then(result => {
		console.log(result)
		if(result === null){
			return res.status(404).send({ error: "User not Found"});
		}else if (result.isAdmin === true){
			return res.status(400).send({ error: "User is already an Admin"});
		}else{
			result.isAdmin = true;
			return result.save()
			.then((updatedUser) => res.status(200).send({updatedUser}))
			.catch(err => res.status(500).send({ error: 'Failed in Saving', details: err }))
		}
	})
	.catch(err => res.status(500).send({ error: 'Failed in Find', details: err }))
}



