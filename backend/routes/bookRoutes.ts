// connect.ts && config.env import
const database = require("../connect");
require("dotenv").config({ path: "../config.env" });

// libs import
const express = require("express");
import type { Request, Response } from "express";
const ObjectId = require("mongodb").ObjectId;

let bookRoutes = express.Router();

// Retrieve All Books (filtered)
bookRoutes.get("/books", async (req: Request, res: Response) => {
    const db = database.getDb();
    const { title, isbn, status, publisherId } = req.query;

    const filter: any = {};

    if (title) {
        filter.title = { $regex: title as string, $options: "i" }; // busca parcial case-insensitive
    }

    if (isbn) {
        filter.$or = [
            { isbn10: isbn as string },
            { isbn13: isbn as string }
        ];
    }

    if (status) {
        filter["commercialInfo.status"] = status;
    }

    if (publisherId) {
        try {
            filter["foreignKeys.publisherId"] = new ObjectId(publisherId as string);
        } catch (err) {
            return res.status(400).json({ message: "Invalid publisherId." });
        }
    }

    const data = await db.collection("books").find(filter).toArray();
    res.status(200).json(data);
});

// Retrieve One Book per ID
bookRoutes.get("/books/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const data = await db.collection("books").findOne({ _id: new ObjectId(req.params.id) });

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "Book not found." });
    }
});

// Create Book
bookRoutes.post("/books", async (req: Request, res: Response) => {
    const db = database.getDb();
    const {
        isbn10,
        isbn13,
        title,
        subtitle,
        originalTitle,
        foreignKeys,
        language,
        originalLanguage,
        publicInformation,
        content,
        commercialInfo,
        metadatas
    } = req.body;

    const bookObject = {
        isbn10,
        isbn13,
        title,
        subtitle,
        originalTitle,
        foreignKeys: {
            publisherId: foreignKeys?.publisherId ? new ObjectId(foreignKeys.publisherId) : null,
            collectionId: foreignKeys?.collectionId ? new ObjectId(foreignKeys.collectionId) : null
        },
        language,
        originalLanguage,
        publicInformation: {
            publicationDate: publicInformation?.publicationDate ? new Date(publicInformation.publicationDate) : null,
            edition: publicInformation?.edition || "",
            editionNumber: publicInformation?.editionNumber || 1,
            printingDate: publicInformation?.printingDate ? new Date(publicInformation.printingDate) : null,
            printingNumber: publicInformation?.printingNumber || ""
        },
        content: {
            coverURL: content?.coverURL || "",
            synopsis: content?.synopsis || "",
            pageCount: content?.pageCount || 0,
            dimensions: {
                height: content?.dimensions?.height || null,
                width: content?.dimensions?.width || null,
                weight: content?.dimensions?.weight || null
            }
        },
        commercialInfo: {
            price: commercialInfo?.price || 0,
            barcode: commercialInfo?.barcode || "",
            stockQuantity: commercialInfo?.stockQuantity || 0,
            status: commercialInfo?.status || "ativo"
        },
        metadatas: {
            ageGroup: metadatas?.ageGroup || "",
            keywords: metadatas?.keywords || [],
            gender: metadatas?.gender || []
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db.collection("books").insertOne(bookObject);
    res.status(201).json(result);
});

// Update Book
bookRoutes.post("/books/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const {
        isbn10,
        isbn13,
        title,
        subtitle,
        originalTitle,
        foreignKeys,
        language,
        originalLanguage,
        publicInformation,
        content,
        commercialInfo,
        metadatas
    } = req.body;

    const updatedObject: any = {
        isbn10,
        isbn13,
        title,
        subtitle,
        originalTitle,
        foreignKeys: {
            publisherId: foreignKeys?.publisherId ? new ObjectId(foreignKeys.publisherId) : null,
            collectionId: foreignKeys?.collectionId ? new ObjectId(foreignKeys.collectionId) : null
        },
        language,
        originalLanguage,
        publicInformation: {
            publicationDate: publicInformation?.publicationDate ? new Date(publicInformation.publicationDate) : null,
            edition: publicInformation?.edition || "",
            editionNumber: publicInformation?.editionNumber || 1,
            printingDate: publicInformation?.printingDate ? new Date(publicInformation.printingDate) : null,
            printingNumber: publicInformation?.printingNumber || ""
        },
        content: {
            coverURL: content?.coverURL || "",
            synopsis: content?.synopsis || "",
            pageCount: content?.pageCount || 0,
            dimensions: {
                height: content?.dimensions?.height || null,
                width: content?.dimensions?.width || null,
                weight: content?.dimensions?.weight || null
            }
        },
        commercialInfo: {
            price: commercialInfo?.price || 0,
            barcode: commercialInfo?.barcode || "",
            stockQuantity: commercialInfo?.stockQuantity || 0,
            status: commercialInfo?.status || "ativo"
        },
        metadatas: {
            ageGroup: metadatas?.ageGroup || "",
            keywords: metadatas?.keywords || [],
            gender: metadatas?.gender || []
        },
        updatedAt: new Date()
    };

    const result = await db
        .collection("books")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedObject });

    res.status(200).json(result);
});

// Delete Book
bookRoutes.delete("/books/:id", async (req: Request, res: Response) => {
    const db = database.getDb();
    const result = await db.collection("books").deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(result);
});

// Adjust Stock Quantity
bookRoutes.patch("/books/:id/stock", async (req: Request, res: Response) => {
    const db = database.getDb();
    const { quantity } = req.body; // can be positive or negative

    if (typeof quantity !== "number") {
        return res.status(400).json({ message: "Quantity must be a number." });
    }

    const book = await db.collection("books").findOne({ _id: new ObjectId(req.params.id) });

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    const currentStock = book.commercialInfo?.stockQuantity || 0;
    const newStock = currentStock + quantity;

    if (newStock < 0) {
        return res.status(400).json({ message: "Stock cannot be negative." });
    }

    const result = await db.collection("books").updateOne(
        { _id: new ObjectId(req.params.id) },
        {
            $set: {
                "commercialInfo.stockQuantity": newStock,
                updatedAt: new Date()
            }
        }
    );

    res.status(200).json({ success: true, newStock });
});

module.exports = bookRoutes;
