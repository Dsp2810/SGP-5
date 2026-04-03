const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions = {
	origin(origin, callback) {
		if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error(`CORS blocked for origin: ${origin}`));
	},
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
	res.json({ ok: true, message: "API is healthy" });
});

// API Routes
app.use("/api", require("./routes"));

module.exports = app;
