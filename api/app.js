const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/errorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const transporterRoutes = require('./routes/transporterRoutes');
const customRoutes = require('./routes/customRoutes');
const cargoCompanyRoutes = require('./routes/cargoCompanyRoutes');
const cargoPriceRoutes = require('./routes/cargoPriceRoutes');
const cargoTrackingRoutes = require('./routes/cargoTrackingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const deliveryTermsRoute = require('./routes/deliveryTermsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notifyRoutes = require('./routes/notifyRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const blogRoutes = require('./routes/blogRoutes');
const generalRoutes = require('./routes/generalRoutes');
const messageRoutes = require('./routes/messageRoutes');
const videoRoutes = require('./routes/videoRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const commentRoutes = require('./routes/commentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const settingRoutes = require('./routes/settingRoutes');
const emailRoutes = require('./routes/emailRoutes');
const menuRoutes = require('./routes/menuRoutes');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const semiProductRoutes = require('./routes/semiProductRoutes');
const companyRoutes = require('./routes/companyRoutes');
const productCardRoutes = require('./routes/productCardRoutes');
const productionOrderRoutes = require('./routes/productionOrderRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const barberRoutes = require('./routes/barberRoutes');
const notificationEmailRoutes = require('./routes/notificationEmailRoutes');
const smsRoutes = require('./routes/smsRoutes');

const cartRoutes = require('./routes/customer-routes/cartRoutes');
const profileRoutes = require('./routes/customer-routes/profileRoutes');
const orderRetailRoutes = require('./routes/customer-routes/orderRoutes');
const blogRetailRoutes = require('./routes/customer-routes/blogRoutes');
const contactRetailRoutes = require('./routes/customer-routes/contactRoutes');
const chatRetailRoutes = require('./routes/customer-routes/chatRoutes');
const paymentRetailRoutes = require('./routes/customer-routes/paymentRoutes');
const individualAuthRoutes = require('./routes/customer-routes/authRoutes');
const deliveryTerms = require('./models/deliveryTerms');

const app = express();

const fileStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'images'); // null as an error
    },
    filename: (req, file, cb) => {
        const fileExtension = '.' + file.mimetype.split('/')[1];


        cb(null, uuidv4() + fileExtension);

    }

});


fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {

        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use('/rest/images', express.static(path.join(__dirname, 'images')));
app.use('/rest/data', express.static(path.join(__dirname, 'data')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

app.use('/rest/auth', authRoutes);
app.use('/rest/category', categoryRoutes);
app.use('/rest/product', productRoutes);
app.use('/rest/transporter', transporterRoutes);
app.use('/rest/custom', customRoutes);
app.use('/rest/cargoCompany', cargoCompanyRoutes);
app.use('/rest/cargoPrice', cargoPriceRoutes);
app.use('/rest/cargoTracking', cargoTrackingRoutes);
app.use('/rest/customer', customerRoutes);
app.use('/rest/error', errorRoutes);
app.use('/rest/order', orderRoutes);
app.use('/rest/user', userRoutes);
app.use('/rest/role', userRoleRoutes);
app.use('/rest/shipment', shipmentRoutes);
app.use('/rest/dashboard', dashboardRoutes);
app.use('/rest/notify', notifyRoutes);
app.use('/rest/slider', sliderRoutes);
app.use('/rest/blog', blogRoutes);
app.use('/rest/general', generalRoutes);
app.use('/rest/message', messageRoutes);
app.use('/rest/video', videoRoutes);
app.use('/rest/newsletter', newsletterRoutes);
app.use('/rest/comment', commentRoutes);
app.use('/rest/chat', chatRoutes);
app.use('/rest/setting', settingRoutes);
app.use('/rest/email', emailRoutes);
app.use('/rest/bankAccount', bankAccountRoutes);
app.use('/rest/deliveryTerm', deliveryTermsRoute);
app.use('/rest/menu', menuRoutes);
app.use('/rest/cart', cartRoutes);
app.use('/rest/profile', profileRoutes);
app.use('/rest/order-retail', orderRetailRoutes);
app.use('/rest/blog-retail', blogRetailRoutes);
app.use('/rest/contact-retail', contactRetailRoutes);
app.use('/rest/chat-retail', chatRetailRoutes);
app.use('/rest/payment-retail', paymentRetailRoutes);
app.use('/rest/individual-auth', individualAuthRoutes);
app.use('/rest/rawMaterial', rawMaterialRoutes);
app.use('/rest/semiProduct', semiProductRoutes);
app.use('/rest/company', companyRoutes);
app.use('/rest/productCard', productCardRoutes);
app.use('/rest/productionOrder', productionOrderRoutes);
app.use('/rest/employee', employeeRoutes);
app.use('/rest/barber', barberRoutes);
app.use('/rest/notificationemail', notificationEmailRoutes);
app.use('/rest/sms', smsRoutes);


app.use((error, req, res, next) => {

    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});




mongoose.connect('mongodb://localhost:27017/ecommerceDb?retryWrites=true', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        const server = app.listen(5500);
        app.get('/rest', function (req, res) { res.send('Server is running') })
        const io = require('./socket').init(server);
        io.of('/orders').on('connection', socket => {
            console.log('orders connected');
        });
        io.of('/operations').on('connection', socket => {
            console.log('operations connected');
        });

        io.of('/warehouse').on('connection', socket => {
            console.log('warehouse connected');
        });

        io.of('/warehouse-retailer').on('connection', socket => {
            console.log('warehouse-retailer connected');
        });

        io.of('/customer-orders').on('connection', socket => {
            console.log('customer-orders connected');
        });
        io.of('/customer-operations').on('connection', socket => {
            console.log('customer-operations connected');
        });
    })
    .catch(err => console.log(err));



