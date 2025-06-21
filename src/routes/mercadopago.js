const express = require('express');
const { crearPreferencia, recibirNotificaciones, paymentMP } = require('../controllers/mercadopago');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const mercadopago = require('mercadopago');
const axios = require('axios');

const router = express.Router();
const ACCESS_TOKEN = '5099c2f8082c889782a8e14d4c292e8d1b3543dd7134c7b543bc50cfecd5b4ab';

router.post('/webhooks/mercadopago', async (req, res) => {
    try {
        const payment = req.body;

        if (payment.type === 'payment') {
            const paymentId = payment.data.id;

            const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });

            const data = response.data;
            console.log("Pago recibido:", data);

            if (data.status === 'approved') {
                const usuarioId = data.external_reference;

                const carrito = await Carrito.findOne({ usuario: usuarioId });
                if (carrito && carrito.productos.length > 0) {
                    for (const item of carrito.productos) {
                        await Producto.findByIdAndUpdate(
                            item.producto,
                            { $inc: { stock: -item.cantidad } }
                        );
                    }

                    carrito.productos = [];
                    await carrito.save();

                    console.log(`✅ Carrito del usuario ${usuarioId} vaciado y stock descontado.`);
                }
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Error en Webhook:', error);
        res.sendStatus(500);
    }
});

//router.post('/crear-preferencia', paymentMP);
router.post('/crear-preferencia', async (req, res) => {
    const { items, payer, external_reference } = req.body;

    console.log("Token MP:", process.env.MERCADOPAGO_ACCESS_TOKEN);
    console.log("Body recibido:", req.body);

    const preference = {
        items,
        payer,
        external_reference,
        back_urls: {
            success: "http://localhost:3000/success",
            failure: "http://localhost:3000/failure",
            pending: "http://localhost:3000/pending",
        },
        //auto_return: 'approved',  // Opcional redirige al usuario a la vista correspondiente
        notification_url: 'http://localhost:3002/mercadopago/webhooks/mercadopago',
    };

    console.log(JSON.stringify(preference, null, 2))
    const url = "https://api.mercadopago.com/checkout/preferences";

    try {
        const payment = await axios.post(url, preference, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
        });

        // 👇 Esta línea es suficiente
        res.send({ url: payment.data.init_point });
    } catch (error) {
        console.error("❌ Error al crear preferencia:", error.response?.data || error.message);
        res.status(500).json({ message: 'Error al crear preferencia' });
    }
});


//router.post('/notificaciones', recibirNotificaciones);
router.post('/notificaciones', async(req, res) =>{
    try {
            const { id, topic } = req.query;
    
            if (topic === 'payment') {
                const payment = await mercadopago.payment.findById(id);
                console.log('Notificación de pago recibida:', payment);
                // Aquí puedes manejar la lógica de actualización de estado de pago en tu base de datos
            }
    
            res.sendStatus(200);
        } catch (error) {
            console.error('Error al recibir notificación de pago:', error);
            res.status(500).json({ message: 'Error al recibir notificación de pago' });
        }
});


router.get('/verificar-pago/:id', async (req, res) => {
    const paymentId = req.params.id;

    try {
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });

        const pago = response.data;

        if (pago.status === 'approved') {
            // Suponemos que pasaste el user ID como `external_reference`
            const usuarioId = pago.external_reference;

            const carrito = await Carrito.findOne({ usuario: usuarioId });

            if (carrito && carrito.productos.length > 0) {
                // Descontar stock por cada producto
                for (const item of carrito.productos) {
                    await Producto.findByIdAndUpdate(
                        item.producto,
                        { $inc: { stock: -item.cantidad } }
                    );
                }

                // Vaciar el carrito
                carrito.productos = [];
                await carrito.save();
            }
        }

        res.json({
            estado: pago.status,
            detalle: pago.status_detail,
            id: pago.id
        });

    } catch (error) {
        console.error('❌ Error al verificar pago / descontar stock / vaciar carrito:', error);
        res.status(500).json({ message: 'Error al procesar el pago' });
    }
});


module.exports = router;
