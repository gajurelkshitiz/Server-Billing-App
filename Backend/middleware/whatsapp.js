require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// const phoneNumber = '9779844644186';
const username = "Kshitiz Gajurel";

// send default template message
async function sendTemplateWhatsappMessage(phoneNumber) {
    const response = await axios({
        url: `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'template',
            template: {
                name: 'hello_world',
                language: {
                    code: 'en_US'
                },
            }
        })
    });

    console.log("Whatsapp messgae send successfully", response.data);
    return { status: "success", data: response.data }
}

async function sendCustomTemplateWhatsappMessage(phone_number, username) {
    try {
        const response = await axios({
            url: 'https://graph.facebook.com/v22.0/679234951940044/messages',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: "individual",
                to: phone_number,
                type: 'template',
                template: {
                    name: 'welcome_from_bill_app',
                    language: {
                        code: 'EN',
                    },
                    components: [
                        {
                            type: 'header',
                            parameters: [
                                {
                                    type: 'text',
                                    parameter_name: "name",
                                    text: username
                                }
                            ]
                        },
                    ]
                }
            })
        });

        if (response.data && response.data.messages && response.data.messages.length > 0) {
            console.log("Whatsapp message sent successfully", response.data);
            return { status: "success", data: response.data };
        } else {
            console.log("Whatsapp message failed", response.data);
            return { status: "failed", data: response.data };
        }
    } catch (error) {
        console.error("Whatsapp message error", error.response ? error.response.data : error.message);
        return { status: "error", data: error.response ? error.response.data : error.message };
    }
}


module.exports = { sendTemplateWhatsappMessage, sendCustomTemplateWhatsappMessage }