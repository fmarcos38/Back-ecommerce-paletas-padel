const mercadopago = require('mercadopago');
const axios = require('axios');

// Crear preferencia de pago
const crearPreferencia = async (req, res) => {
    const { items, payer } = req.body.body; console.log("body: ", req.body.body);

    // Crear preferencia de pago
    const preference = {
        items: items.map(item => ({
            title: item.title || "Producto sin título", // Asegúrate de tener un título
            unit_price: item.unit_price,
            quantity: item.quantity,
        })),
        payer: {
            name: payer.name,
            surname: payer.surname,
            email: payer.email,
            phone: {
                area_code: payer.phone.area_code,
                number: payer.phone.number,
            },
            address: {
                street_name: payer.address.street_name,
                street_number: payer.address.street_number,
                zip_code: payer.address.zip_code,
            },
        },
        back_urls: {
            success: `${process.env.URL}/success`,
            failure: `${process.env.URL}/failure`,
            pending: `${process.env.URL}/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.URL}/mercadopago/notificaciones`,
    };

    try {
        // Llamada a la API de MercadoPago
        const response = await mercadopago.preferences.create(preference);

        // Responder con el ID de la preferencia
        res.status(200).json({ id: response.body.id });
    } catch (error) {
        console.error('Error al crear la preferencia de pago:', error);
        res.status(500).json({ message: 'Error al crear la preferencia de pago', error: error.message });
    }
};


// Recibir notificaciones de pago
const recibirNotificaciones = async (req, res) => {
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
};

//metodo extraigo pref_id
const extractPrefId = (url) => {
    try {
        const urlObj = new URL(url); // Crea un objeto URL
        const prefId = urlObj.searchParams.get('pref_id'); // Extrae el parámetro "pref_id"
        return prefId;
    } catch (error) {
        console.error('Error al extraer pref_id:', error);
        return null;
    }
};

//paymentMP
const paymentMP = async (req, res) => {
    const { body } = req.body; 
    const url = "https://api.mercadopago.com/checkout/preferences";
    
    const payment = await axios.post(url, body, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
    });
    
    const prefId = extractPrefId(payment.data.init_point);
    //console.log("prefId: ", prefId);
    res.send({ url: prefId }); //sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=18517025-cec51d21-c8e6-439d-933f-58d822f22d12'
};


module.exports = {
    crearPreferencia,
    recibirNotificaciones,
    paymentMP
};