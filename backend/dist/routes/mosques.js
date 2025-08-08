"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../dynamoClient");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const { lat, lng, q } = req.query;
        const radiusKm = req.query.radiusKm ?? '25';
        const params = { TableName: process.env.DYNAMO_TABLE };
        const data = await dynamoClient_1.docClient.send(new lib_dynamodb_1.ScanCommand(params));
        let items = data.Items || [];
        if (q && typeof q === 'string') {
            const search = q.toLowerCase();
            items = items.filter(m => m.name.toLowerCase().includes(search) ||
                m.city.toLowerCase().includes(search) ||
                m.country.toLowerCase().includes(search));
        }
        else if (lat && lng && typeof lat === 'string' && typeof lng === 'string') {
            const radius = parseFloat(String(radiusKm));
            const latNum = parseFloat(lat);
            const lngNum = parseFloat(lng);
            const deg = radius / 111;
            const minLat = latNum - deg;
            const maxLat = latNum + deg;
            const minLng = lngNum - deg;
            const maxLng = lngNum + deg;
            items = items.filter(m => m.lat >= minLat && m.lat <= maxLat &&
                m.lng >= minLng && m.lng <= maxLng);
        }
        res.json(items);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const result = await dynamoClient_1.docClient.send(new lib_dynamodb_1.GetCommand({
            TableName: process.env.DYNAMO_TABLE,
            Key: { id: req.params.id }
        }));
        if (!result.Item)
            return res.status(404).json({ error: 'Not found' });
        res.json(result.Item);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
