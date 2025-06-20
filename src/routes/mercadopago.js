const express = require('express');
const { crearPreferencia, recibirNotificaciones, paymentMP } = require('../controllers/mercadopago');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');

const router = express.Router();
//const ACCESS_TOKEN = '5099c2f8082c889782a8e14d4c292e8d1b3543dd7134c7b543bc50cfecd5b4ab';

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
router.post('/', async(req, res) => {
    const { body } = req.body;  //console.log("body: ", body);
        const usuarioId = body.external_reference; // Debe venir del frontend
    
        const payload = {
            ...body,
            external_reference: usuarioId,
            back_urls: {
                success: `${process.env.URL}/success`,
                failure: `${process.env.URL}/failure`,
                pending: `${process.env.URL}/pending`,
            },
            auto_return: 'approved',
            //ver que url corresponde
            notification_url: `http://backendpaletas-0e5d1e2325c9.herokuapp.com/mercadopago/webhooks/mercadopago`,
        };
    
        const url = "https://api.mercadopago.com/checkout/preferences";
    
        try {
            const payment = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                },
            });
    
            const prefId = extractPrefId(payment.data.init_point);
            res.send({ url: prefId });
    
        } catch (error) {
            console.error("Error al crear preferencia:", error);
            res.status(500).json({ message: 'Error al crear preferencia' });
        }
});

//router.post('/notificaciones', recibirNotificaciones);
router.post('notificaciones', async(req, res) =>{
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

//ruta de prueba del webhook MP
/* router.post('/webhooks/mercadopago', (req, res) => {
    console.log('Notificación recibida:', req.body);
    res.sendStatus(200); // Importante responder 200 OK
}); */


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
