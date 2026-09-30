import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health con el estado real de la base. Antes devolvia siempre {ok:true}, asi
// que no distinguia "vivo" de "vivo pero sin base" — y este servicio estuvo
// semanas reiniciandose cada 30 s sin poder conectar a Mongo. Devuelve 503 si
// la conexion no esta lista.
const ESTADOS_DB = ["desconectado", "conectado", "conectando", "desconectando"];

app.get("/health", (_req, res) => {
  const estado = mongoose.connection.readyState;
  const listo = estado === 1;
  res.status(listo ? 200 : 503).json({
    ok: listo,
    status: listo ? "UP" : "DOWN",
    db: ESTADOS_DB[estado] || "desconocido",
    uptime: Math.round(process.uptime()),
  });
});
app.use("/api", routes);

app.use(errorHandler);
