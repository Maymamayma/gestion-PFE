import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const signup = async (req, res) => {
  try {
    //vérifier si l'email existe ou non
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(401).json({
        message: "le Login existe deja",
      });
      return;
    }

    //hasher le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //ajouter le user avec le mdp hashé à la base de données
    const newUser = new User({
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
      name: req.body.name,
    });
    await newUser.save();
    //renvoyer l'user sans le mot de passe hashé
    const newUserObject = newUser.toObject();
    delete newUserObject.password;
    res.status(201).json({
      model: newUserObject,
      message: "success",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    //récuperer le user qui a l'email donné par le body
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({
        message: "Login ou mot de passe incorrecte",
      });
      return;
    }
    //comparer le mot de passe envoyé par le body avec le mdp hashé de la base de données
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Login ou mot de passe incorrecte" });
    }

    //créer token et le renvoyer le token
    res.status(200).json({
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      }),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
