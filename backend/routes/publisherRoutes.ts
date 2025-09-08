// connect.ts && config.env import
const database = require("../connect");
require("dotenv").config({ path: "../config.env" });

// libs import
const express = require("express");
import type { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

let publisherRoutes = express.Router();

// Retrieve All Publishers
publisherRoutes.route("/publishers").get(async (req: Request, res: Response) => {
    let db = database.getDb();
    let data = await db.collection("publishers").find({}).toArray();
    res.status(200).json(data);
});

// Retrieve One Publisher
publisherRoutes.route("/publishers/:id").get(async (req: Request, res: Response) => {
    let db = database.getDb();
    let data = await db.collection("publishers").findOne({ _id: new ObjectId(req.params.id) });

    if (data && Object.keys(data).length > 0) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "Publisher not found." });
    }
});

// Create Publisher
/* ADICIONAR PROFILE OBJECT para Publishers: Avatar, Banner.
publisherRoutes.route("/publishers", async (req: Request, res: Response) => {
    let db = database.getDb();
    const { legalName, tradeName, taxId, stateRegistrantion,, email, password, createdAt, avatar, address } = req.body;

    const takenEmail = await db.collection("publishers").findOne({ email: email });

    if (takenEmail) {
        res.status(400).json({ message: "This email is already taken. "});
    }
});
*/

module.exports = publisherRoutes;