import express from 'express';
import ordersData from '../data/orders.js';

const router = express.Router();

// GET /orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await ordersData.getOrderById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /orders - Create a new order
router.post('/', async (req, res) => {
    try {
        const newOrder = await ordersData.createOrder(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /orders/user/:userId - Get all orders by user
router.get('/user/:userId', async (req, res) => {
    const { userType } = req.query; // Expecting userType as a query parameter
    try {
        const user = { userId: req.params.userId };
        const orders = await ordersData.getAllOrdersByUser(user, userType);
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /orders/:id - Remove an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await ordersData.removeOrder(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// PATCH /orders/:id - Update an order by ID
router.patch('/:id', async (req, res) => {
    try {
        const updatedOrder = await ordersData.updateOrder(req.params.id, req.body);
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH /orders/:id/delivered - Update order status to "Delivered"
router.patch('/:id/delivered', async (req, res) => {
    try {
        const updatedOrder = await ordersData.updateOrder(req.params.id, { orderStatus: 'Delivered' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /orders - Render orders.handlebars
router.get('/', async (req, res) => {
    try {
        const orders = await ordersData.getAllOrders(); // Fetch all orders
        res.render('orders', { orders }); // Pass orders to the view
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).render('orders', { error: 'Failed to load orders.' });
    }
});

export default router;
