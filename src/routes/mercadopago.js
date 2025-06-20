const express = require('express');
const { crearPreferencia, recibirNotificaciones, paymentMP } = require('../controllers/mercadopago');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');

const router = express.Router();
const ACCESS_TOKEN = '5099c2f8082c889782a8e14d4c292e8d1b3543dd7134c7b543bc50cfecd5b4ab';

//Revisá si querés quedarte con paymentMP (con axios) o crearPreferencia (con el SDK). 
//router.post('/crear-preferencia', crearPreferencia); 
router.post('/crear-preferencia', paymentMP); //mismo que la de arriba


router.post('/notificaciones', recibirNotificaciones);



//ruta de prueba del webhook MP
/* router.post('/webhooks/mercadopago', (req, res) => {
    console.log('Notificación recibida:', req.body);
    res.sendStatus(200); // Importante responder 200 OK
}); */
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
