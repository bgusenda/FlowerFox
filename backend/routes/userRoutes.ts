// connect.ts && config.env import
const database = require("../connect");
require("dotenv").config({ path: "../config.env" });

// libs import
const express = require("express");
import type { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

let userRoutes = express.Router();

// Retrieve All Users
userRoutes.route("/users").get(async (req: Request, res: Response) => {
  let db = database.getDb();
  let data = await db.collection("users").find({}).toArray();
  res.status(200).json(data);
});

// Retrieve One User
userRoutes.route("/users/:id").get(async (req: Request, res: Response) => {
  let db = database.getDb();
  let data = await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.params.id) });

  if (data && Object.keys(data).length > 0) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

// Create User
userRoutes.post("/users", async (req: Request, res: Response) => {
  let db = database.getDb();
  const { name, email, password, createdAt, avatar, address } = req.body;

  const takenEmail = await db.collection("users").findOne({ email: email });

  if (takenEmail) {
    res.status(400).json({ message: "This email is already taken." });
  } else {
    const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    let mongoObject = {
      name,
      email,
      password: hash,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      favBooks: [""],
      favPublis: [""],
      favStores: [""],
      reviews: [""],
      emailVerified: false,
      profile: {
        avatar: avatar || 0,
        darkMode: false,
        address: {
          street: address?.street || "",
          number: address?.number || "",
          neighborhood: address?.neighborhood || "",
          city: address?.city || "",
          state: address?.state || "",
          zipCode: address?.zipCode || "",
          additionalInfo: address?.additionalInfo || "",
        },
      },
    };

    let data = await db.collection("users").insertOne(mongoObject);
    res.status(201).json(data);
  }
});

// Update User
userRoutes.post("/users/:id", async (req: Request, res: Response) => {
  let db = database.getDb();
  const {
    name,
    email,
    password,
    createdAt,
    favBooks,
    favPublis,
    favStores,
    reviews,
    emailVerified,
    avatar,
    address,
    darkMode,
  } = req.body;

  let updatedObject: any = {
    name,
    email,
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    favBooks: favBooks || [""],
    favPublis: favPublis || [""],
    favStores: favStores || [""],
    reviews: reviews || [""],
    emailVerified: !!emailVerified,
    profile: {
      avatar: avatar || 0,
      darkMode: !!darkMode,
      address: {
        street: address?.street || "",
        number: address?.number || "",
        neighborhood: address?.neighborhood || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zipCode || "",
        additionalInfo: address?.additionalInfo || "",
      },
    },
  };

  if (password) {
    updatedObject.password = await bcrypt.hash(password, process.env.SALT_ROUNDS);
  }

  let data = await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedObject }
    );

  res.status(200).json(data);
});

// Delete User
userRoutes.route("/users/:id").delete(async (req: Request, res: Response) => {
  let db = database.getDb();
  let data = await db
    .collection("users")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).json(data);
});

// User Login
userRoutes.post("/users/login", async (req: Request, res: Response) => {
  let db = database.getDb();
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email: email });

  if (user) {
    const confirmation = await bcrypt.compare(password, user.password);

    if (confirmation) {
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
          profile: user.profile,
        },
        process.env.SECRETKEY,
        { expiresIn: "3h" }
      );
      res.status(200).json({ success: true, token });
    } else {
      res.status(403).json({ success: false, message: "Incorrect password." });
    }
  } else {
    res.status(404).json({ success: false, message: "User not found." });
  }
});

module.exports = userRoutes;
