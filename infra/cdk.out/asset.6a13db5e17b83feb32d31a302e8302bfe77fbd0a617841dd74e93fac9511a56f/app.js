"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mosques_1 = __importDefault(require("./routes/mosques"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'Mosque Finder API running' });
});
app.use('/api/mosques', mosques_1.default);
if (require.main === module) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
exports.default = app;
