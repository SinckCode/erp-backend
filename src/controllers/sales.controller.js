import mongoose from "mongoose";
import { Book } from "../models/Book.js";
import { Sale } from "../models/Sale.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

function makeFolio() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const r = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `V-${y}${m}${d}-${r}`;
}

export const createSale = asyncHandler(async (req, res) => {
  const { buyerType, buyerRefId = "", items } = req.body;
  if (!buyerType || !Array.isArray(items) || items.length === 0) {
    throw httpError(400, "buyerType e items son obligatorios");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const folio = makeFolio();
    const soldAt = new Date();

    // Validar y calcular totales
    let total = 0;
    const normalizedItems = [];

    for (const it of items) {
      const { bookId, qty } = it;
      if (!bookId || !qty || qty < 1) throw httpError(400, "items inválidos");

      const book = await Book.findById(bookId).session(session);
      if (!book || !book.active) throw httpError(404, "Libro no válido");
      if (book.stock < qty) throw httpError(409, `Stock insuficiente para: ${book.title}`);

      const unitPrice = book.price;
      const subtotal = unitPrice * qty;
      total += subtotal;

      // Descontar stock
      book.stock -= qty;
      await book.save({ session });

      normalizedItems.push({ bookId, qty, unitPrice, subtotal });
    }

    const sale = await Sale.create(
      [
        {
          folio,
          soldAt,
          soldByUserId: req.user.id,
          buyerType,
          buyerRefId,
          items: normalizedItems,
          total,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ ok: true, data: sale[0] });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
});
