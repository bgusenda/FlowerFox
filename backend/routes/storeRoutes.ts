// connect.ts && config.env import
const database = require("../connect");
require("dotenv").config({ path: "../config.env" });

// libs import
const express = require("express");
import type { Request, Response } from "express";
const ObjectId = require("mongodb").ObjectId;

let storeRoutes = express.Router();

/**
 * GET /stores - Lista todas as lojas com filtro de nome
 */
storeRoutes.get("/stores", async (req: Request, res: Response) => {
  const db = database.getDb();
  const { name } = req.query;

  const filter: any = {};

  if (name) {
    const regex = new RegExp(name as string, "i");
    filter.$or = [
      { legalName: { $regex: regex } },
      { tradeName: { $regex: regex } }
    ];
  }

  const data = await db.collection("stores").find(filter).toArray();
  res.status(200).json(data);
});

/**
 * GET /stores/:id - Retorna uma loja por ID
 */
storeRoutes.get("/stores/:id", async (req: Request, res: Response) => {
  const db = database.getDb();
  const data = await db.collection("stores").findOne({ _id: new ObjectId(req.params.id) });

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "Store not found." });
  }
});

/**
 * POST /stores - Cria uma nova loja
 */
storeRoutes.post("/stores", async (req: Request, res: Response) => {
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
    profile
  } = req.body;

  const store = {
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
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    books: [],
    profile: {
      avatar: profile?.avatar || "",
      banner: profile?.banner || ""
    }
  };

  const result = await db.collection("stores").insertOne(store);
  res.status(201).json(result);
});

/**
 * POST /stores/:id - Atualiza uma loja
 */
storeRoutes.post("/stores/:id", async (req: Request, res: Response) => {
  const db = database.getDb();
  const updateData = req.body;

  updateData.updatedAt = new Date();

  const result = await db
    .collection("stores")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });

  res.status(200).json(result);
});

/**
 * DELETE /stores/:id - Deleta uma loja
 */
storeRoutes.delete("/stores/:id", async (req: Request, res: Response) => {
  const db = database.getDb();
  const result = await db.collection("stores").deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).json(result);
});

/**
 * PATCH /stores/:storeId/books/:bookId - Atualiza estoque de livro na loja
 */
storeRoutes.patch("/stores/:storeId/books/:bookId", async (req: Request, res: Response) => {
  const db = database.getDb();
  const { quantity, price } = req.body;

  const storeId = new ObjectId(req.params.storeId);
  const bookId = req.params.bookId;

  const store = await db.collection("stores").findOne({ _id: storeId });

  if (!store) {
    return res.status(404).json({ message: "Store not found." });
  }

  const bookIndex = store.books.findIndex((b: any) => b.bookId === bookId);

  if (bookIndex === -1) {
    // Livro não existe, adiciona
    const newBook = {
      bookId,
      quantity: quantity || 0,
      price: price || 0,
      lastUpdated: new Date()
    };

    const result = await db.collection("stores").updateOne(
      { _id: storeId },
      { $push: { books: newBook }, $set: { updatedAt: new Date() } }
    );

    return res.status(200).json({ message: "Book added to store.", result });
  } else {
    // Atualiza livro existente
    const updateFields: any = {};
    if (typeof quantity === "number") updateFields[`books.${bookIndex}.quantity`] = quantity;
    if (typeof price === "number") updateFields[`books.${bookIndex}.price`] = price;
    updateFields[`books.${bookIndex}.lastUpdated`] = new Date();

    const result = await db.collection("stores").updateOne(
      { _id: storeId },
      { $set: updateFields }
    );

    return res.status(200).json({ message: "Book updated in store.", result });
  }
});

module.exports = storeRoutes;
