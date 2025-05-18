const bcrypt = require('bcryptjs');
const Users = require('../models/user');



const register = async (req, res) => {
    const {
        firstName,
        lastName,
        mobile,
        gender,
        username,
        email,
        password,
        confirmPassword,
        isAdmin,
        isTest,
    } = req.body;

    if (!firstName || !lastName || !mobile || !gender || !username || !email || !password) {
        return res.status(400).json({
            status: "failure",
            message: "Missing required fields",
        });
    }

    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({
            status: "failure",
            message: "User already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
        firstName,
        lastName,
        mobile,
        gender,
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin === 'true',
        isTest: isTest === true
    });

    req.session.user = newUser;

    if (newUser.isAdmin) {
        res.redirect("/admin");
    } else {
        res.redirect("/user");
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });

    if (!user) {
        return res.status(400).json({
            status: "failure",
            message: "Invalid email or password",
        });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
        return res.status(400).json({
            status: "failure",
            message: "Invalid email or password",
        });
    }

    req.session.user = user;

    if (user.isAdmin === 'true' || user.isAdmin === true) {
        res.redirect("/admin");
    } else {
        res.redirect("/user");
    }
};


const logout = async (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
};
const renderLogin = (req, res) => {
    res.render('login');
};

const renderSignup = (req, res) => {

    res.render('signup');
};



module.exports = {
    register,
    login,
    logout,
    renderLogin,
    renderSignup,
  };
  