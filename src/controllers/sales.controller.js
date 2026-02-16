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

  const folio = makeFolio();
  const soldAt = new Date();

  // Para rollback si algo falla a media venta
  const applied = []; // { bookId, qty }

  try {
    let total = 0;
    const normalizedItems = [];

    for (const it of items) {
      const bookId = String(it.bookId || "");
      const qty = Number(it.qty);

      if (!bookId || !Number.isFinite(qty) || qty < 1) {
        throw httpError(400, "items inválidos");
      }

      // 1) Descontar stock de forma ATÓMICA (evita negativos sin transacción)
      const r = await Book.updateOne(
        { _id: bookId, active: true, stock: { $gte: qty } },
        { $inc: { stock: -qty } }
      );

      if (r.modifiedCount !== 1) {
        // Puede ser: no existe, inactivo o stock insuficiente
        // Para diferenciar mensaje:
        const book = await Book.findById(bookId).select("title active stock");
        if (!book || !book.active) throw httpError(404, "Libro no válido");
        throw httpError(409, `Stock insuficiente para: ${book.title}`);
      }

      applied.push({ bookId, qty });

      // 2) Leer precio/título (ya que stock ya se descontó)
      const book = await Book.findById(bookId).select("title price");
      if (!book) throw httpError(404, "Libro no válido");

      const unitPrice = Number(book.price ?? 0);
      const subtotal = unitPrice * qty;

      total += subtotal;
      normalizedItems.push({ bookId, qty, unitPrice, subtotal });
    }

    // 3) Guardar venta (sin session)
    const sale = await Sale.create({
      folio,
      soldAt,
      soldByUserId: req.user.id,
      buyerType,
      buyerRefId,
      items: normalizedItems,
      total,
    });

    return res.status(201).json({ ok: true, data: sale });
  } catch (e) {
    // Rollback manual: regresamos el stock de los libros ya descontados
    if (applied.length > 0) {
      await Book.bulkWrite(
        applied.map((it) => ({
          updateOne: {
            filter: { _id: it.bookId },
            update: { $inc: { stock: it.qty } },
          },
        })),
        { ordered: false }
      );
    }
    throw e;
  }
});
