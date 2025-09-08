// connect.ts && config.env import
const database = require("../connect");
require("dotenv").config({ path: "../config.env" });

// libs import
const express = require("express");
import type { Request, Response } from "express";
const ObjectId = require("mongodb").ObjectId;

let reviewRoutes = express.Router();

// Retrieve All Reviews
reviewRoutes.get("/reviews", async (req: Request, res: Response) => {
    const db = database.getDb();
    const data = await db.collection("reviews").find({}).toArray();
    res.status(200).json(data);
});

// Retrieve One Review
reviewRoutes.get("/reviews/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const data = await db.collection("reviews").findOne({ _id: new ObjectId(req.params.id) });

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "Review not found." });
    }
});

// Create Review
reviewRoutes.post("/reviews", async (req: Request, res: Response) => {
    const db = database.getDb();
    const {
        content,
        starRating,
        reviewType,
        foreignKeys,
        response
    } = req.body;

    const reviewObject = {
        content,
        starRating,
        reviewType,
        foreignKeys: {
            userId: foreignKeys?.userId || null,
            bookId: foreignKeys?.bookId || null,
            publisherId: foreignKeys?.publisherId || null,
            storeId: foreignKeys?.storeId || null
        },
        helpfulCount: 0,
        unhelpfulCount: 0,
        response: {
            content: response?.content || null,
            respondentId: response?.respondentId || null,
            respondentType: response?.respondentType || null,
            createdAt: response?.createdAt ? new Date(response.createdAt) : null
        },
        createdAt: new Date()
    };

    const result = await db.collection("reviews").insertOne(reviewObject);
    res.status(201).json(result);
});

// Update Review
reviewRoutes.post("/reviews/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const {
        content,
        starRating,
        reviewType,
        foreignKeys,
        response,
        helpfulCount,
        unhelpfulCount
    } = req.body;

    const updatedObject: any = {
        content,
        starRating,
        reviewType,
        foreignKeys: {
            userId: foreignKeys?.userId || null,
            bookId: foreignKeys?.bookId || null,
            publisherId: foreignKeys?.publisherId || null,
            storeId: foreignKeys?.storeId || null
        },
        helpfulCount: helpfulCount ?? 0,
        unhelpfulCount: unhelpfulCount ?? 0,
        response: {
            content: response?.content || null,
            respondentId: response?.respondentId || null,
            respondentType: response?.respondentType || null,
            createdAt: response?.createdAt ? new Date(response.createdAt) : null
        }
    };

    const result = await db
        .collection("reviews")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedObject });

    res.status(200).json(result);
});

// Delete Review
reviewRoutes.delete("/reviews/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(result);
});

// Increment Helpful Count
reviewRoutes.post("/reviews/:id/helpful", async (req: Request, res: Response) => {
    const db = database.getDb();
    const result = await db.collection("reviews").updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { helpfulCount: 1 } }
    );
    res.status(200).json(result);
});

// Increment Unhelpful Count
reviewRoutes.post("/reviews/:id/unhelpful", async (req: Request, res: Response) => {
    const db = database.getDb();
    const result = await db.collection("reviews").updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { unhelpfulCount: 1 } }
    );
    res.status(200).json(result);
});

module.exports = reviewRoutes;
