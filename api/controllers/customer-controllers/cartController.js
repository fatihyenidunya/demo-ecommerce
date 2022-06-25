const Customer = require('../../models/customer');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const OrderTransaction = require('../../models/orderTransaction');
const Cart = require('../../models/cart');
const Payment = require('../../models/payment');
const OrderRetail = require('../../models/orderRetail');
const OrderRetailTransaction = require('../../models/orderRetailTransaction');
const OrderNotify = require('../../models/orderNotify');
const OrderProductTransaction = require('../../models/orderProductTransaction');
const orderStatus = require('../../classes/orderStatus');
const OrderAgreement = require('../../models/orderAgreement');

const { mongoose } = require('mongoose');
const mongodb = require('mongodb');
const io = require('../../socket');

const ObjectId = mongodb.ObjectId;
const errorService = require('../../classes/errorService');

exports.addToCart = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }


    const customer = req.body.customer;
    const product = req.body.product;
    let productTitle = req.body.productTitle;

    const unitPrice = req.body.unitPrice;
    const unit = req.body.unit;
    const totalPrice = req.body.totalPrice;
    const currency = req.body.currency;
    const country = req.body.country;
    const volume = req.body.volume;
    const volumeEntity = req.body.volumeEntity;
    const color = req.body.color;
    const stockCode = req.body.stockCode;



    if (color != '') {

        if (color != undefined) {



            if (color != 'undefined') {

                let _color = JSON.parse(color);
                productTitle = productTitle + ' - ' + _color.color;
            }
        }
    }





    try {


        const cart = new Cart({
            customer: customer,
            product: product,
            productTitle: productTitle,
            color: color,
            stockCode: stockCode,
            unitPrice: unitPrice,
            unit: unit,
            totalPrice: totalPrice,
            volume: volume,
            volumeEntity: volumeEntity,
            currency: currency,
            country: country
        });


        const result = await cart.save();



        const totalItem = await Cart.find({ customer: ObjectId(customer) }).countDocuments();

        console.log(JSON.stringify(totalItem))


        res.status(201).json({ message: 'Added to Cart!', productId: product, productNumberInCart: totalItem });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        errorService.sendErrorNotificationViaEmail('cartController', 'addToCart', 21, 500, err);


        next(err);
    }
}

exports.getCart = async (req, res, next) => {
    const customerId = req.params.customerId


    let totalItems;

    try {

        const cart = await Cart
            .find({ 'customer': customerId })
            .populate({ path: 'product', select: 'title titleLower image categoryName stockCode' })
            .exec()
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);




        res.status(200).json({
            message: 'Fetched customer cart succesfully',
            cart: cart,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cartController', 'getCart', 108, 500, err);
        next(err);
    }

}


exports.outOfCart = async (req, res, next) => {
    const customerId = req.params.customerId;
    const cartId = req.params.cartId;

    try {
        const product = await Cart.find({ "customer": customerId, "_id": cartId });


        if (!product) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await Cart.deleteOne({ "customer": customerId, "_id": cartId });

        const result = await Cart
            .find({ 'customer': customerId })
            .populate({ path: 'product', select: 'title turkishTitle turkishTitleLower image' })
            .exec()
      

        const totalItem = await Cart.find({ 'customer': customerId }).countDocuments();

        res.status(200).json({ message: 'The product out of the cart.', cart: result, productNumberInCart: totalItem });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cartController', 'outOfCart', 143, 500, err);
      
        next(err);
    }
};


exports.updateCart = async (req, res, next) => {
    const customerId = req.params.customerId;
    const cartId = req.params.cartId;

    const quantity = req.body.quantity;
    const salePrice = req.body.salePrice;




    try {
        const _cart = await (await Cart.find({ "customer": customerId, "_id": cartId }));
        if (!_cart) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }

        _cart[0].unit = quantity;
        _cart[0].totalPrice = quantity * salePrice;

        _cart[0].totalPrice = Number(_cart[0].totalPrice.toFixed(2));

  


        const result = await _cart[0].save();


        const cart_ = await Cart
            .find({ 'customer': customerId })
            .populate({ path: 'product', select: 'turkishTitle turkishTitleLower image' })
            .exec()


        res.status(200).json({ message: 'The product out of the cart.', cart: cart_ });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cartController', 'updateCart', 180, 500, err);
        next(err);
    }
};


exports.postGiveAnOrder = async (req, res, next) => {

    const customerId = req.body.customerId;
    const customer = req.body.customer;
    const billing = req.body.billing;
    const delivery = req.body.delivery;
    const grandTotal = req.body.grandTotal;
    const currency = req.body.currency;
    const note = req.body.note;
    const cart = req.body.cart;
    const status = orderStatus.PendingApproval;
    const paymentStatus = req.body.paymentStatus;
    const paymentId = req.body.paymentId;
    const referanceCode = req.body.referanceCode;


    const agreementBuyerName = req.body.agreementBuyerName;
    const agreementBuyerTcId = req.body.agreementBuyerTcId;
    const agreementBuyerAddress = req.body.agreementBuyerAddress;
    const agreementBuyerPhone = req.body.agreementBuyerPhone;
    const agreementBuyerEmail = req.body.agreementBuyerEmail;
    const agreementBuyerProducts = JSON.parse(req.body.agreementBuyerProducts);
    const agreementBuyerGrandTotal = req.body.agreementBuyerGrandTotal;
    const agreementBuyerGrandTotalCurrency = req.body.agreementBuyerGrandTotalCurrency;
    const agreementBuyerPaymentType = req.body.agreementBuyerPaymentType;
    const agreementBuyerDeliveryAddress = req.body.agreementBuyerDeliveryAddress;
    const agreementBuyerBillingAddress = req.body.agreementBuyerBillingAddress;
    const agreementBuyerBillingName = req.body.agreementBuyerBillingName;
    const agreementTaxPlace = req.body.agreementTaxPlace;
    const agreementTaxNo = req.body.agreementTaxNo;
    const agreementCargoPrice = req.body.agreementCargoPrice;
    const agreementCargoPriceCurrency = req.body.agreementCargoPriceCurrency;
    const agreementSellerName = 'Asil Group İç ve Dış Tic. San. Ltd. Şti';
    const agreementSellerAddress = 'Kavaklı Mah, İstanbul Cad. NO 19/1,Beylikdüzü 34520, İSTANBUL TÜRKİYE';
    const agreementSellerPhone = '+ 90 212-552-0039';
    const agreementSellerEmail = 'info@asilgroup.com.tr';
    const agreementSellerWebAddress = 'berber.nishman.com.tr';



    // console.log('agreementBuyerName : ' + agreementBuyerName);
    // console.log('agreementBuyerTcId : ' + agreementBuyerTcId);
    // console.log('agreementBuyerAddress : ' + agreementBuyerAddress);
    // console.log('agreementBuyerPhone : ' + agreementBuyerPhone);
    // console.log('agreementBuyerEmail : ' + agreementBuyerEmail);
    // console.log('agreementBuyerProducts : ' +JSON.stringify(agreementBuyerProducts));
    // console.log('agreementBuyerGrandTotal : ' + agreementBuyerGrandTotal);
    // console.log('agreementBuyerGrandTotalCurrency : ' + agreementBuyerGrandTotalCurrency);
    // console.log('agreementBuyerPaymentType : ' + agreementBuyerPaymentType);
    // console.log('agreementBuyerDeliveryAddress : ' + agreementBuyerDeliveryAddress);
    // console.log('agreementBuyerBillingAddress : ' + agreementBuyerBillingAddress);
    // console.log('agreementBuyerBillingName : ' + agreementBuyerBillingName);
    // console.log('agreementTaxNo : ' + agreementTaxNo);
    // console.log('agreementTaxPlace : ' + agreementTaxPlace);
    // console.log('agreementCargoPrice : ' + agreementCargoPrice);
    // console.log('agreementCargoPriceCurrency : ' + agreementCargoPriceCurrency);

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }






    try {

        const products = JSON.parse(cart);
        const _delivery = JSON.parse(delivery);
        const _billing = JSON.parse(billing);


        const order = new OrderRetail({

            referanceCode: referanceCode,
            grandTotal: grandTotal,
            currency: currency,
            note: note,
            customerId: customerId,
            customer: customer,
            delivery: _delivery,
            billing: _billing,
            products: products,
            status: status,
            paymentStatus: paymentStatus,
            paymentId: paymentId
        });

        const result = await order.save();


        const payment = await Payment.findById(paymentId);
        payment.orderId = result._id;
        await payment.save();


        makeAgreement(
            result._id,
            referanceCode,
            result.createdAt,
            agreementBuyerName,
            agreementBuyerTcId,
            agreementBuyerAddress,
            agreementBuyerPhone,
            agreementBuyerEmail,
            agreementBuyerProducts,
            agreementBuyerGrandTotal,
            agreementBuyerGrandTotalCurrency,
            agreementBuyerPaymentType,
            agreementBuyerDeliveryAddress,
            agreementBuyerBillingAddress,
            agreementBuyerBillingName,
            agreementTaxPlace,
            agreementTaxNo,
            agreementCargoPrice,
            agreementCargoPriceCurrency,
            agreementSellerName,
            agreementSellerAddress,
            agreementSellerPhone,
            agreementSellerEmail,
            agreementSellerWebAddress
        );




        const orderRetailTransaction = new OrderRetailTransaction({
            orderId: result._id
        });

        const result3 = await orderRetailTransaction.save();


        const newOrderNotify = new OrderNotify({
            orderId: result._id,
            customerId: customerId,
            country: _billing.countryCode,
            customer: customer,
            status: status,
            grandTotal: grandTotal,
            currency: currency,
            notifyFor: 'customer'

        });

        await newOrderNotify.save();
        newOrderNotify.createdAt = Date.now;

        io.addNamespace('/customer-orders').emit('newOrder', { orderNotify: newOrderNotify });



        res.status(201).json({ statusCode: 201, message: 'order created!', orderId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cartController', 'postGiveAnOrder', 226, 500, err);
        next(err);
    }
}



exports.postGiveAnOrderMobile = async (req, res, next) => {

    const customerId = req.body.customerId;
    const customer = req.body.customer;
    const billing = req.body.billing;
    const delivery = req.body.delivery;
    const grandTotal = req.body.grandTotal;
    const currency = req.body.currency;
    const note = req.body.note;
    const cart = req.body.cart;
    const status = orderStatus.PendingApproval;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {


        const products = cart;
        const _delivery = delivery;
        const _billing = billing;




        const order = new OrderRetail({

            grandTotal: grandTotal.toFixed(2),
            currency: currency,
            note: note,
            customerId: customerId,
            customer: customer,
            delivery: _delivery,
            billing: _billing,
            products: products,
            status: status
        });

        const result = await order.save();

        const orderTransaction = new OrderTransaction({
            orderId: result._id
        });

        const result3 = await orderTransaction.save();

        const newOrderNotify = new OrderNotify({
            orderId: result._id,
            customerId: customerId,
            country: _billing.countryCode,
            customer: customer,
            status: status,
            grandTotal: grandTotal.toFixed(2),
            currency: currency,
            notifyFor: 'customer'

        });

        await newOrderNotify.save();
        newOrderNotify.createdAt = Date.now;

        io.addNamespace('/customer-orders').emit('newOrder', { orderNotify: newOrderNotify });



        res.status(201).json({ statusCode: 201, message: 'order created!', orderId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cartController', 'postGiveAnOrderMobile', 396, 500, err);

        next(err);
    }
}

makeAgreement = async (
    orderId,
    referanceNumber,
    orderDate,
    agreementBuyerName,
    agreementBuyerTcId,
    agreementBuyerAddress,
    agreementBuyerPhone,
    agreementBuyerEmail,
    agreementBuyerProducts,
    agreementBuyerGrandTotal,
    agreementBuyerGrandTotalCurrency,
    agreementBuyerPaymentType,
    agreementBuyerDeliveryAddress,
    agreementBuyerBillingAddress,
    agreementBuyerBillingName,
    agreementTaxPlace,
    agreementTaxNo,
    agreementCargoPrice,
    agreementCargoPriceCurrency,
    agreementSellerName,
    agreementSellerAddress,
    agreementSellerPhone,
    agreementSellerEmail,
    agreementSellerWebAddress

) => {



    let head = "<!DOCTYPE html> <html>" +
        "<head>" +
        "<style>" +
        "table {" +
        "width:100%;" +
        "}" +
        "table, th, td {" +
        "border: 1px solid black;" +
        "border-collapse: collapse;" +
        "}" +
        "th, td {" +
        "padding: 15px;" +
        "text-align: left;" +
        "}" +
        "#t01 tr:nth-child(even) {" +
        "background-color: #eee;" +
        "}" +
        "#t01 tr:nth-child(odd) {" +
        "background-color: #fff;" +
        "}" +
        "#t01 th {" +
        "background-color: black;" +
        "color: white;" +
        "}" +
        "</style>" +
        "</head>" +
        "<body>";


    let htmlForMailHead = "<table id='t01'>" +
        "<tr>" +
        "<th>Ürün</th>" +
        "<th>Ölçü</th>" +
        "<th>Birim Fiyat</th>" +
        "<th>Adet</th>" +
        "<th> </th>" +
        "</tr>";


    let htmlForMailBody = '';

    for (let product of agreementBuyerProducts) {



        let htmlForMailRow = "<tr>" +

            "<td>" + product.name + "</td>" +
            "<td>" + product.volume + " " + product.volumeEntity + "   </td>" +
            "<td>" + product.unitPrice + " " + product.unitPriceCurrency + "  </td>" +
            "<td>" + product.unit + "  </td>" +
            "<td> </td>" +
            "</tr>";

        htmlForMailBody += htmlForMailRow;

    }

    let htmlForMailFoot = "<tfoot>" +
        "<tr>" +

        "<td></td>" +
        "<td> </td>" +
        "<td> </td>" +
        "<td style='font-weight:bold'> Toplam : </td>" +
        "<td style='font-weight:bold'>" + agreementBuyerGrandTotal + " " + agreementBuyerGrandTotalCurrency + "  </td>" +
        "</tr> </tfoot>";

    let htmlForMailFooter = "</table>";

    let htmlForMail = htmlForMailHead + htmlForMailBody + htmlForMailFoot + htmlForMailFooter;



    const agreement = head + ' Sipariş Referans No : ' + referanceNumber + '</br> Madde 1- Taraflar </br>' +
        '1.1. Satıcı </br>' +
        'Adı : ' + agreementSellerName + '</br>' +
        'Adresi : ' + agreementSellerAddress + '</br> ' +
        'Telefon : ' + agreementSellerPhone + '</br>' +
        'Email : ' + agreementSellerEmail + '</br>' +
        '1.2. Alıcı </br>' +
        'Adı - Soyadı/TC.No : ' + agreementBuyerName + ' / ' + agreementBuyerTcId + ' </br>' +
        'Adresi : ' + agreementBuyerAddress + '</br>' +
        'Telefon : ' + agreementBuyerPhone + '</br>' +
        'E-mail : ' + agreementBuyerEmail + '</br>' +
        'Madde 2 - Konu </br>' +
        'İşbu sözleşmenin konusu, ALICI’nın SATICI’ya ait https://www.' + agreementSellerWebAddress + ' internet sitesinden elektronik ortamda </br>' +
        'siparişini yaptığı aşağıda nitelikleri ve satış ücreti belirtilen ürünün satışı ve teslimi ile ilgili olarak 4077 sayılı </br>' +
        'Tüketicilerin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</br>' +
        'Alıcı, satıcının isim, unvan, açık adres, telefon ve diğer erişim bilgileri , satışa konu malın temel nitelikleri, vergiler dahil olmak üzere satış fiyatı ,</br>' +
        'ödeme sekli, teslimat koşulları ve masrafları vs. satışa konu mal ile ilgili tüm ön bilgiler ve “cayma” hakkının kullanılması ve bu hakkın nasıl kullanılacağı ,</br>' +
        'şikayet ve itirazlarını iletebilecekleri resmi makamlar vs. konusunda açık , anlaşılır ve internet ortamına uygun şekilde satıcı tarafından bilgilendirildiğini ,</br>' +
        'bu ön bilgileri elektronik ortamda teyit ettiğini ve sonrasında mal sipariş verdiğini is bu sözleşme hükümlerince kabul ve beyan eder.' +
        'https://www.' + agreementSellerWebAddress + ' sitesinde yer alan ön bilgilendirme ve alıcı tarafından verilen sipariş üzerine düzenlenen fatura is bu sözleşmenin ayrılmaz parçalarıdır.</br>' +
        'Madde 3- Sözleşme Konusu Ürün/Ödeme/Teslimat Bilgileri </br>' +
        'Elektronik ortamda alınan ürün/ürünlerin cinsi ve türü, miktarı, marka/modeli, satış bedeli, ödeme şekli, teslim alacak kişi, teslimat adresi, fatura bilgileri, kargo ücreti</br>' +
        'aşağıda belirtildiği gibidir.Fatura edilecek kişi ile sözleşmeyi yapan kişi aynı olmak zorundadır.Aşağıda yer alan bilgiler doğru ve eksiksiz olmalıdır. Bu bilgilerin doğru </br>' +
        'olmadığı veya noksan olduğu durumlardan doğacak zararları tamamıyla karşılamayı alıcı kabul eder ve ayrıca bu durumdan oluşabilecek her türlü sorumluluğu alıcı kabul eder.</br>' +
        'SATICI gerekli gördüğü durumlarda, ALICI’nın vermiş olduğu bilgiler gerçekle örtüşmediğinde, siparişi durdurma hakkını saklı tutar. SATICI siparişte sorun tespit ettiği</br>' +
        'durumlarda ALICI’nın vermiş olduğu telefon, e-posta ve posta adreslerinden ALICI’ya ulaşamadığı takdirde siparişin yürürlüğe koyulmasını 15 (onbeş) gün süreyle dondurur.</br>' +
        'ALICI’nın bu süre zarfında SATICI ile konuyla ilgili olarak iletişime geçmesi beklenir. Bu süre içerisinde ALICI’dan herhangi bir cevap alınamazsa SATICI, her iki tarafın da </br>' +
        'zarar görmemesi için siparişi iptal eder. </br>' +
        'Alınan Ürün / Ürünler </br>' +


        htmlForMail + '</br>' +
        'Toplam Satış Bedeli : ' + agreementBuyerGrandTotal + ' ' + agreementBuyerGrandTotalCurrency + '</br>' +
        'Ödeme Şekli : ' + ' Kredi Kartı/Banka Havalesi (EFT) ' + '</br>' +
        'Teslim Edilecek Kişi : ' + agreementBuyerName + '</br>' +
        'Telefon Numarası : ' + agreementBuyerPhone + '</br>' +
        'Teslim Edilecek Adres : ' + agreementBuyerDeliveryAddress + '</br>' +
        'Fatura Edilecek Kişi/Kurum : ' + agreementBuyerBillingName + '</br>' +
        'Fatura Adresi : ' + agreementBuyerBillingAddress + '</br>' +
        'Vergi Dairesi : ' + agreementTaxPlace + '</br>' +
        'Vergi Sicil Numarası : ' + agreementTaxNo + '</br>' +
        'Kargo Ücreti : ' + agreementCargoPrice + ' ' + agreementCargoPriceCurrency + '</br>' +

        ' </br>' +
        'Madde 4 - Sözleşme Tarihi ve Mücbir Nedenler </br>' +
        'Sözleşme tarihi, alıcı tarafından siparişin verildiği tarih olan' + orderDate + 'tarihidir.</br>' +
        'Sözleşmenin imzalandığı tarihte mevcut olmayan veya öngörülmeyen, tarafların kontrolleri dışında gelişen, ortaya çıkmasıyla taraflardan birinin ya da her ikisinin de sözleşme ile</br>' +
        'yüklendikleri borç ve sorumluluklarını kısmen ya da tamamen yerine getirmelerini ya da bunları zamanında yerine getirmelerini olanaksızlaştıran durumlar, mücbir sebep (Doğal afet,</br>' +
        'savaş, terör, ayaklanma, değişen mevzuat hükümleri, el koyma veya grev, lokavt, üretim ve iletişim tesislerinde önemli ölçüde arıza vb.) olarak kabul edilecektir. Mücbir sebep şahsında </br>' +
        'gerçekleşen taraf, diğer tarafa durumu derhal ve yazılı olarak bildirecektir.</br>' +
        'Mücbir sebebin devamı esnasında tarafların edimlerini yerine getirememelerinden dolayı herhangi bir sorumlulukları doğmayacaktır. İşbu mücbir sebep durumu 30 (otuz ) gün süreyle devam ederse,</br>' +
        'taraflardan her birinin, tek taraflı olarak fesih hakkı doğmuş olacaktır.</br>' +
        'Madde 5- Satıcının Hak ve Yükümlülükleri </br>' +
        '5.1. Satıcı, 4077 sayılı Tüketicilerin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri uyarınca sözleşmede kendisine yüklenen edimleri mücbir haller dışında </br>' +
        'eksiksiz yerine getirmeyi kabul ve taahhüt eder.</br>' +
        '5.2. 18 (on sekiz) yaşından küçük kişiler https://www.' + agreementSellerWebAddress + '’den alışveriş yapamaz. Satıcı, alıcının sözleşmede belirttiği yaşının doğru olduğunu esas alacaktır. Ancak alıcının</br>' +
        'yaşını yanlış yazmasından dolayı satıcıya hiçbir şekilde sorumluluk yüklenemeyecektir.' +
        '5.3. Sistem hatalarından meydana gelen fiyat yanlışlıklarından https://www.' + agreementSellerWebAddress + 'sorumlu değildir. Buna istinaden satıcı, internet sitesindeki sistemden, dizayndan veya yasadışı yollarla</br>' +
        'internet sitesine yapılabilecek müdahaleler sebebiyle ortaya çıkabilecek tanıtım, fiyat hatalarından sorumlu değildir. Sistem hatalarına dayalı olarak alıcı satıcıdan hak iddiasında bulunamaz.</br>' +
        '5.3. https://www.' + agreementSellerWebAddress + 'den kredi kartı (Visa, MasterCard , vs. ) ya da banka havalesi ile alışveriş yapılabilir. Sipariş tarihinden itibaren bir hafta içinde havalesi yapılmayan</br>' +
        'siparişler iptal edilir. Siparişlerin işleme alınma zamanı, siparişin verildiği an değil, kredi kartı hesabından gerekli tahsilatın yapıldığı ya da havalenin (EFT’nin) banka hesaplarına ulaştığı belirlenen andır.</br>' +
        'Ödemeli gönderi ya da posta çeki gibi müşteri hizmetleri ile görüşülmeden gerçekleştirilen ödeme yöntemleri kabul edilmez.</br>' +
        'Madde 6- Alıcının Hak ve Yükümlülükleri </br>' +
        '6.1. Alıcı, sözleşmede kendisine yüklenen edimleri mücbir sebepler dışında eksiksiz yerine getirmeyi kabul ve taahhüt eder.</br>' +
        '6.2. Alıcı, sipariş vermekle birlikte iş sözleşme hükümlerini kabul etmiş sayıldığını ve sözleşmede belirtilen ödeme şekline uygun ödemeyi yapacağını kabul ve taahhüt eder.</br>' +
        '6.3. Alıcı, https://www.' + agreementSellerWebAddress + ' internet sitesinden satıcının isim, unvan, açık adres, telefon ve diğer erişim bilgileri , satışa konu malın temel nitelikleri, vergiler dahil olmak üzere satış fiyatı , ödeme sekli,</br>' +
        'teslimat koşulları ve masrafları vs. satışa konu mal ile ilgili tüm ön bilgiler ve “cayma” hakkının kullanılması ve bu hakkın nasıl kullanılacağı , şikayet ve itirazlarını iletebilecekleri resmi makamlar vs. konusunda açık , anlaşılır ve </br>' +
        'internet ortamına uygun şekilde bilgi sahibi olduğunu bu ön bilgileri elektronik ortamda teyit ettiğini kabul ve beyan eder.</br>' +
        '6.4. Bir önceki maddeye bağlı olarak Alıcı, ürün sipariş ve ödeme koşullarının, ürün kullanım talimatlarının , olası durumlara karşı alınan tedbirlerin ve yapılan uyarıların olduğu https://www.' + agreementSellerWebAddress + ' sipariş/ödeme/kullanım </br>' +
        'prosedürü bilgilerini okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</br>' +
        '6.5. Alıcı, aldığı ürünü iade etmek istemesi durumunda ne surette olursa olsun ürüne ve ambalajına zarar vermemeyi, iade anında fatura aslını ve irsaliyesini iade etmeyi kabul ve taahhüt eder.</br>' +
        'Madde 7- Sipariş/Ödeme Prosedürü </br>' +
        'Sipariş : </br>' +
        'Alışveriş sepetine eklenen ürünlerin KDV dahil TL tutarı (Taksitli işlemlerde toplam taksit tutarları) alıcı tarafından onaylandıktan sonra, ilgili banka kartının posu üzerinden işleme alınır.</br>' +
        'Bu nedenle siparişler, sevk edilmeden önce müşteriye sipariş onay maili gönderilir. Sipariş Onay maili gönderilmeden sevkiyat yapılmaz.</br>' +
        'Süreçteki herhangi bir aksama durumu ya da kredi kartı ile ilgili ortaya çıkabilecek problemler alıcıya sözleşmede belirttiği telefon/faks/e-mail yollarından biri veya bir kaçı kullanılmak sureti ile bildirilir. Gerekirse alıcıdan bankası ile </br>' +
        'görüşmesi istenebilir. Siparişlerin işleme alınma zamanı, siparişin verildiği an değil, kredi kartı hesabından gerekli tahsilatın yapıldığı ya da havalenin (EFT’ nin) satıcı hesaplarına ulaştığının belirlendiği andır.</br>' +
        'İstisnai olarak haklı bir nedenle sözleşme konusu malın tedarik edilemeyeceğinin anlaşılması ve/veya stok problemi ile karşılaşılması durumunda alıcı hemen açık ve anlaşılır bir şekilde bilgilendirilip onay vermesi durumunda</br>' +
        'alıcıya eşit kalitede ve fiyatta başka bir mal gönderilebilir ya da alıcının arzusu ve seçimi doğrultusunda ; yeni başka bir ürün gönderilebilir, ürünün stoklara girmesi ya da teslime engel diğer engelin ortadan kalkması beklenebilir ve/veya sipariş iptal edilebilir.</br>' +
        'Sözleşme konusu malın teslim yükümlülüğünün yerine getirilmesinin imkânsızlaştığı hâllerde alıcı bu durumdan haberdar edilerek ödemiş olduğu toplam bedel ve varsa onu borç altına sokan her türlü belge en geç on gün içinde kendisine iade edilerek sözleşme iptal edilir.</br>' +
        'Böyle bir durumda alıcının satıcıdan ilave herhangi bir maddi ve manevi zarar talebi olmayacaktır.</br>' +
        'Ödeme : </br>' +
        'https://www.' + agreementSellerWebAddress + '’de, internet ortamında kredi kartı bilgilerini kullanmak istemeyen alıcılara nakit havale ile sipariş imkanları sunulmuştur. Havale ile ödemede alıcı kendisine en uygun bankayı seçip havalesini yapabilir. Eğer EFT yapılmışsa</br>' +
        'hesaba geçme tarihi dikkate alınacaktır. Havale ve/veya EFT yaparken “Gönderen Bilgileri”nin Fatura Bilgileri ile aynı olması ve sipariş numarasının yazılması gereklidir.</br>' +
        'Ürünün tesliminden sonra Alıcı’ya ait kredi kartının Alıcı’nın kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya hukuka aykırı olarak kullanılması nedeni ile ilgili banka veya finans kuruluşun ürün bedelini Satıcı’ya ödememesi halinde, Alıcı’nın</br>' +
        'kendisine teslim edilmiş ürünü 10 gün içinde Satıcı’ya göndermesi zorunludur. Bu tür durumlarda nakliye giderleri Alıcı’ya aittir.</br>' +
        'Alıcı kredi kartı ile ödeme yapmayı tercih etmiş ise ALICI, ilgili faiz oranlarını ve temerrüt faizi ile ilgili bilgileri bankasından ayrıca teyit edeceğini, yürürlükte bulunan mevzuat hükümleri gereğince faiz ve temerrüt faizi ile ilgili hükümlerin Banka ve ALICI </br>' +
        'arasındaki “Kredi Kartı Sözleşmesi” kapsamında uygulanacağını kabul, beyan ve taahhüt eder.</br>' +
        'Madde 8- Sevkiyat/Teslimat Prosedürü </br>' +
        'Sevkiyat: </br>' +
        'Sipariş onayı mailinin gönderilmesiyle birlikte, ürün/ürünler satıcının anlaşmalı olduğu kargo Şirketine verilir.</br>' +
        'Teslimat: </br>' +
        'Ürün/ürünler satıcının anlaşmalı olduğu kargo ile alıcının adresine teslim edilecektir. Teslimat süresi, Sipariş onayı mailinin gönderilmesinden ve sözleşmenin kurulmasından itibaren 30 gündür. Alıcıya önceden yazılı olarak veya bir sürekli veri taşıyıcısıyla </br>' +
        'bildirilmek koşuluyla bu süre en fazla on gün uzatılabilir.</br>' +
        'Ürünler, Kargo şirketlerinin adres teslimatı yapmadığı bölgelere telefon ihbarlı olarak gönderilir.</br>' +
        'Kargo Şirketinin haftada bir gün teslimat yaptığı bölgelerde, sevk bilgilerindeki yanlışlık ve eksiklik olduğu hallerde, bazı sosyal olaylar ve doğal afetler gibi durumlarda belirtilen gün süresinde sarkma olabilir. Bu sarkmalardan dolayı alıcı satıcıya herhangi</br>' +
        'bir sorumluluk yükleyemez. Ürün, Alıcı’dan başka bir kişi/kuruluşa teslim edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden, sevk bilgilerindeki yanlışlık ve/veya Alıcının yerinde olmamasından doğabilecek ekstra kargo bedellerinden satıcı </br>' +
        'sorumlu değildir. Belirtilen günler içeriğinde ürün/ürünler müşteriye ulaşmadıysa teslimat problemleri müşteri hizmetlerine info@nishman.com.tr e-mail adresi kullanılmak sureti ile derhal bildirilmelidir.</br>' +
        'Zarar görmüş paket durumunda; Zarar görmüş paketler teslim alınmayarak Kargo Şirketi yetkilisine tutanak tutturulmalıdır. Eğer Kargo Şirketi yetkilisi paketin hasarlı olmadığı görüşünde ise, paketin orada açılarak ürünlerin hasarsız teslim edildiğini </br>' +
        'kontrol ettirme ve durumun yine bir tutanakla tespit edilmesini isteme hakkı alıcıda vardır. Paket Alıcı tarafından teslim alındıktan sonra Kargo Şirketinin görevini tam olarak yaptığı kabul edilmiş olur. Paket kabul edilmemiş ve tutanak tutulmuş ise, durum,</br>' +
        'tutanağın Alıcı’da kalan kopyasıyla birlikte en kısa zamanda satıcı Müşteri Hizmetlerine bildirilmelidir.</br>' +
        'Madde 9- Ürün İade ve Cayma Hakkına İlişkin Prosedürü </br>' +
        'Ürün İade: </br>' +
        'Alıcı malı teslim aldıktan sonra yedi gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. 385 sayılı vergi usul kanunu genel tebliği uyarınca iade işlemlerinin yapılabilmesi için alıcının mal ile birlikte</br>' +
        'teslim edilen satıcıya ait 2 adet faturanın alt kısmındaki iade bölümlerini eksiksiz ve doğru şekilde doldurduktan sonra imzalayarak bir nüshasını ürün ile birlikte satıcıya göndermesi diğer nüshasını da uhdesinde tutması gerekmektedir.Cayma hakkı süresi alıcıya malın </br>' +
        'teslim edildiği günden itibaren başlar. İade edilen ürün veya ürünlerin geri gönderim bedeli alıcı tarafından karşılanmalıdır.</br>' +
        'Alıcının istekleri ve/veya açıkça onun kişisel ihtiyaçları doğrultusunda hazırlanan mallar için cayma hakkı söz konusu değildir.</br>' +
        'Alıcının cayma hakkını kullanması halinde satıcı, cayma bildirimini içeren faturanın ürünle birlikte kendisine ulaşmasından itibaren en geç on gün içerisinde almış olduğu toplam bedeli ve varsa tüketiciyi borç altına sokan her türlü belgeyi tüketiciye hiçbir masraf yüklemeden iade edecektir.</br>' +
        'Teslim alınmış olan malın değerinin azalması veya iadeyi imkânsız kılan bir nedenin varlığı cayma hakkının kullanılmasına engel değildir. Ancak değer azalması veya iadenin imkânsızlaşması tüketicinin kusurundan kaynaklanıyorsa satıcıya malın değerini veya değerindeki azalmayı tazmin etmesi gerekir.</br>' +
        'Sehven alınan her ürün için de genel iade süresi 7 gündür. Bu süre içerisinde, Ambalajı açılmış, kullanılmış, tahrip edilmiş vesaire şekildeki ürünlerin iadesi kabul edilmez. İade, orijinal ambalaj ile yapılmalıdır.</br>' +
        'Sehven alınan üründe ve ambalajında herhangi bir açılma, bozulma, kırılma, tahrip, yırtılma, kullanılma ve sair durumlar tespit edildiği hallerde ve ürünün alıcıya teslim edildiği andaki hali ile iade edilememesi durumunda ürün iade alınmaz ve bedeli iade edilmez.</br>' +
        'Ürün iadesi için, durum öncelikli olarak müşteri hizmetlerine iletilmelidir. Ürünün iade olarak gönderilme bilgisi, satıcı tarafından müşteriye iletilir. Bu görüşmeden sonra ürün iade ile ilgili bilgileri içeren fatura ile birlikte alıcı adresine teslimatı yapan Kargo şirketi kanalıyla satıcıya ulaştırmalıdır.</br>' +
        'Satıcıya ulaşan iade ürün iş bu sözleşmede belirtilen koşulları sağladığı takdirde iade olarak kabul edilir, geri ödemesi de alıcı kredi kartına/hesabına yapılır. Ürün iade edilmeden bedel iadesi yapılmaz. Kredi Kartına yapılan iadelerin kredi kartı hesaplarına yansıma süresi ilgili bankanın tasarrufundadır.</br>' +
        'Alışveriş kredi kartı ile ve taksitli olarak yapılmışsa, kredi kartına iade prosedürü şu şekilde uygulanacaktır: Alıcı ürünü kaç taksit ile satın alma talebini iletmiş ise, Banka alıcıya geri ödemesini taksitle yapmaktadır. Satıcı,bankaya ürün bedelinin tamamını tek seferde ödedikten sonra, Banka poslarından </br>' +
        'yapılan taksitli harcamaların alıcının kredi kartına iadesi durumundakonuya müdahil tarafların mağdur duruma düşmemesi için talep edilen iade tutarları,yine taksitli olarak hamil taraf hesaplarına Banka tarafından aktarılır.Alıcının satış iptaline kadar ödemiş olduğu taksit tutarları, eğer iade tarihi ile kartın</br>' +
        'hesap kesim tarihleri çakışmazsa her ay karta 1(bir) iade yansıyacak ve alıcı iade öncesinde ödemiş olduğu taksitleri satışın taksitleri bittikten sonra, iade öncesinde ödemiş olduğu taksit sayısı kadar ay daha alacak ve mevcut borçlarından düşmüş olacaktır.</br>' +
        'Kart ile alınmış mal ve hizmetin iadesi durumunda satıcı, Banka ile yapmış olduğu sözleşme gereği alıcıya nakit para ile ödeme yapamaz. Üye işyeri yani satıcı, bir iade işlemi söz konusu olduğunda ilgili yazılım aracılığı ile iadesini yapacak olup, üye işyeri yani satıcı ilgili tutarı Bankaya nakden veya mahsuben</br>' +
        'ödemekle yükümlü olduğundan yukarıda detayları belirtilen prosedür gereğince alıcıya nakit olarak ödeme yapılamamaktadır. Kredi kartına iade, alıcının Bankaya bedeli tek seferde ödemesinden sonra, Banka tarafından yukarıdaki prosedür gereğince yapılacaktır.</br>' +
        'Madde 10-Garanti </br>' +
        'Kullanma talimatına uygun şekilde kullanılan ve temizliği yapılan ürünler her türlü üretim hatasına karşı aşağıda belirtilen şartlar dahilinde 2 yıl garantilidir: Satıcının garanti sorumluluğu yalnızca 4077 sayılı kanun kapsamına giren tüketiciler için geçerlidir. Ticari nitelikteki işler için Türk Ticaret Kanununu </br>' +
        'hükümleri geçerli olacaktır. </br>' +
        'Madde 11- Gizlilik </br>' +
        'Alıcı tarafından iş bu sözleşmede belirtilen bilgiler ile ödeme yapmak amacı ile satıcıya bildirdiği bilgiler satıcı tarafından 3. şahıslarla paylaşılmayacaktır.</br>' +
        'Satıcı bu bilgileri sadece idari/ yasal zorunluluğun mevcudiyeti çerçevesinde açıklayabilecektir. Araştırma ehliyeti belgelenmiş her türlü adli soruşturma dahilinde satıcı kendisinden istenen bilgiyi elinde bulunduruyorsa ilgili makama sağlayabilir.</br>' +
        'Kredi Kartı bilgileri kesinlikle saklanmaz,Kredi Kartı bilgileri sadece tahsilat işlemi sırasında ilgili bankalara güvenli bir şekilde iletilerek provizyon alınması için kullanılır ve provizyon sonrası sistemden silinir.</br>' +
        'Alıcıya ait e-posta adresi, posta adresi ve telefon gibi bilgiler yalnızca satıcı tarafından standart ürün teslim ve bilgilendirme prosedürleri için kullanılır. Bazı dönemlerde kampanya bilgileri, yeni ürünler hakkında bilgiler, promosyon bilgileri alıcıya onayı sonrasında gönderilebilir.</br>' +
        'Madde 12- Uyuşmazlık Durumunda Yetkili Mahkeme ve İcra Daireleri </br>' +
        'İşbu sözleşmenin uygulanmasından kaynaklanan uyuşmazlık halinde, Sanayi ve Ticaret Bakanlığınca her yıl Aralık ayında ilan edilen değere kadar Tüketici Hakem Heyetleri ile Alıcı’nın veya Satıcı’nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.</br>' +
        'Siparişin gerçekleşmesi durumunda Alıcı işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.' + orderDate +
        '</body></html>';





    const orderAgreement = new OrderAgreement({
        orderId: orderId,
        agreement: agreement
    });

    const resultAgreement = await orderAgreement.save();


};

