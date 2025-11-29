import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email invalide",
      ],
    },

    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },

    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      minlength: [3, "Le nom doit contenir au moins 3 caractères"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },

    role: {
      type: String,
      enum: ["etudiant", "encad_universitaire", "encad_entreprise"],
      default: "etudiant",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// pour mettre à jour updatedAt automatiquement
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const User = mongoose.model("User", userSchema);
