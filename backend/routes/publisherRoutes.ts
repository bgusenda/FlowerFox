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
publisherRoutes.get("/publishers", async (req: Request, res: Response) => {
    const db = database.getDb();
    const data = await db.collection("publishers").find({}).toArray();
    res.status(200).json(data);
});

// Search Publisher
publisherRoutes.get("/publisher", async (req: Request, res: Response) => {
    const db = database.getDb();
    const { name } = req.query;

    const filter: any = {};

    if (name) {
        const regex = new RegExp(name as string, "i"); // case-insensitive
        filter.$or = [
            { legalName: { $regex: regex } },
            { tradeName: { $regex: regex } }
        ];
    }

    const data = await db.collection("publishers").find(filter).toArray();
    res.status(200).json(data);
});

// Retrieve One Publisher per ID
publisherRoutes.get("/publishers/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const data = await db.collection("publishers").findOne({ _id: new ObjectId(req.params.id) });

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "Publisher not found." });
    }
});

// Create Publisher
publisherRoutes.post("/publishers", async (req: Request, res: Response) => {
    const db = database.getDb();
    const {
        legalName,
        tradeName,
        taxId,
        stateRegistrantion,
        cityRegistrantion,
        mainTelephone,
        secondaryTelephone,
        email,
        website,
        address,
        foundationDate,
        actingAreas,
        status,
        password,
        profile
    } = req.body;

    const existingPublisher = await db.collection("publishers").findOne({ email });

    if (existingPublisher) {
        res.status(400).json({ message: "This email is already in use." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    const publisherObject = {
        legalName,
        tradeName,
        taxId,
        stateRegistrantion,
        cityRegistrantion,
        mainTelephone,
        secondaryTelephone,
        email,
        website,
        address: {
            street: address?.street || "",
            number: address?.number || "",
            additionalInfo: address?.additionalInfo || "",
            neighborhood: address?.neighborhood || "",
            city: address?.city || "",
            state: address?.state || "",
            zipCode: address?.zipCode || ""
        },
        foundationDate: foundationDate ? new Date(foundationDate) : null,
        actingAreas: actingAreas || [],
        status: status !== undefined ? status : true,
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
        password: hashedPassword,
        profile: {
            avatar: profile?.avatar || "",
            banner: profile?.banner || ""
        }
    };

    const result = await db.collection("publishers").insertOne(publisherObject);
    res.status(201).json(result);
});

// Update Publisher
publisherRoutes.post("/publishers/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const {
        legalName,
        tradeName,
        taxId,
        stateRegistrantion,
        cityRegistrantion,
        mainTelephone,
        secondaryTelephone,
        email,
        website,
        address,
        foundationDate,
        actingAreas,
        status,
        password,
        profile
    } = req.body;

    let updatedFields: any = {
        legalName,
        tradeName,
        taxId,
        stateRegistrantion,
        cityRegistrantion,
        mainTelephone,
        secondaryTelephone,
        email,
        website,
        address: {
            street: address?.street || "",
            number: address?.number || "",
            additionalInfo: address?.additionalInfo || "",
            neighborhood: address?.neighborhood || "",
            city: address?.city || "",
            state: address?.state || "",
            zipCode: address?.zipCode || ""
        },
        foundationDate: foundationDate ? new Date(foundationDate) : null,
        actingAreas: actingAreas || [],
        status: status !== undefined ? status : true,
        updatedAt: new Date(),
        profile: {
            avatar: profile?.avatar || "",
            banner: profile?.banner || ""
        }
    };

    if (password) {
        updatedFields.password = await bcrypt.hash(password, process.env.SALT_ROUNDS);
    }

    const result = await db
        .collection("publishers")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedFields });

    res.status(200).json(result);
});

// Delete Publisher
publisherRoutes.delete("/publishers/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const result = await db.collection("publishers").deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(result);
});

// Publisher Login
publisherRoutes.post("/publishers/login", async (req: Request, res: Response) => {
    const db = database.getDb();
    const { email, password } = req.body;

    const publisher = await db.collection("publishers").findOne({ email });

    if (!publisher) {
        res.status(404).json({ success: false, message: "Publisher not found." });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, publisher.password);

    if (!passwordMatch) {
        res.status(403).json({ success: false, message: "Incorrect password." });
        return;
    }

    const token = jwt.sign(
        {
            _id: publisher._id,
            email: publisher.email,
            tradeName: publisher.tradeName,
            profile: publisher.profile,
        },
        process.env.SECRETKEY,
        { expiresIn: "3h" }
    );

    res.status(200).json({ success: true, token });
});

module.exports = publisherRoutes;
