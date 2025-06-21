const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
require('dotenv').config();

const mp = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// POST /crear-preferencia
const crearPreferencia = async (req, res) => {
    try {
        const { carrito, usuario } = req.body;

        if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
            return res.status(400).json({ error: 'Carrito inválido o vacío' });
        }

        if (!usuario || !usuario.nombre || !usuario.email) {
            return res.status(400).json({ error: 'Datos de usuario incompletos' });
        }

        const items = carrito.map(producto => ({
            title: producto.nombre,
            unit_price: Number(producto.precio),
            quantity: Number(producto.cantidad),
            currency_id: 'ARS',
        }));

        const preference = new Preference(mp);

        const respuesta = await preference.create({
            body: {
                items,
                payer: {
                    name: usuario.nombre,
                    email: usuario.email,
                },
                back_urls: {
                    success: 'https://tu-app.com/pago-exitoso',
                    failure: 'https://tu-app.com/pago-fallido',
                    pending: 'https://tu-app.com/pago-pendiente',
                },
                auto_return: 'approved',
                notification_url: `${process.env.URL}/api/mercadopago/webhook`,
            }
        });


        return res.status(200).json({ id: respuesta.id });
    } catch (error) {
        console.error('Error al crear preferencia:', error);
        return res.status(500).json({ error: 'Error al crear preferencia', detalle: error.message });
    }
};

// POST /webhook
const recibirWebhook = async (req, res) => {
    try {
        const data = req.body;
        console.log('✅ Webhook recibido:', JSON.stringify(data, null, 2));
        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.sendStatus(500);
    }
};

// GET /estado/:id
const estadoPago = async (req, res) => {
    try {
        const { id } = req.params;

        const paymentClient = new Payment(mp);
        const respuesta = await paymentClient.get({ id });

        return res.status(200).json({
            id: respuesta.id,
            status: respuesta.status,
            status_detail: respuesta.status_detail,
        });
    } catch (error) {
        console.error('❌ Error al obtener el estado del pago:', error);
        res.status(500).json({ error: 'Error al obtener estado del pago' });
    }
};

module.exports = {
    crearPreferencia,
    recibirWebhook,
    estadoPago,
};
