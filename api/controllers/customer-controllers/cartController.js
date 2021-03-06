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
    const agreementSellerName = 'Asil Group ???? ve D???? Tic. San. Ltd. ??ti';
    const agreementSellerAddress = 'Kavakl?? Mah, ??stanbul Cad. NO 19/1,Beylikd??z?? 34520, ??STANBUL T??RK??YE';
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
        "<th>??r??n</th>" +
        "<th>??l????</th>" +
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



    const agreement = head + ' Sipari?? Referans No : ' + referanceNumber + '</br> Madde 1- Taraflar </br>' +
        '1.1. Sat??c?? </br>' +
        'Ad?? : ' + agreementSellerName + '</br>' +
        'Adresi : ' + agreementSellerAddress + '</br> ' +
        'Telefon : ' + agreementSellerPhone + '</br>' +
        'Email : ' + agreementSellerEmail + '</br>' +
        '1.2. Al??c?? </br>' +
        'Ad?? - Soyad??/TC.No : ' + agreementBuyerName + ' / ' + agreementBuyerTcId + ' </br>' +
        'Adresi : ' + agreementBuyerAddress + '</br>' +
        'Telefon : ' + agreementBuyerPhone + '</br>' +
        'E-mail : ' + agreementBuyerEmail + '</br>' +
        'Madde 2 - Konu </br>' +
        '????bu s??zle??menin konusu, ALICI???n??n SATICI???ya ait https://www.' + agreementSellerWebAddress + ' internet sitesinden elektronik ortamda </br>' +
        'sipari??ini yapt?????? a??a????da nitelikleri ve sat???? ??creti belirtilen ??r??n??n sat?????? ve teslimi ile ilgili olarak 4077 say??l?? </br>' +
        'T??keticilerin Korunmas?? Hakk??ndaki Kanun ve Mesafeli S??zle??melere Dair Y??netmelik h??k??mleri gere??ince taraflar??n hak ve y??k??ml??l??klerinin saptanmas??d??r.</br>' +
        'Al??c??, sat??c??n??n isim, unvan, a????k adres, telefon ve di??er eri??im bilgileri , sat????a konu mal??n temel nitelikleri, vergiler dahil olmak ??zere sat???? fiyat?? ,</br>' +
        '??deme sekli, teslimat ko??ullar?? ve masraflar?? vs. sat????a konu mal ile ilgili t??m ??n bilgiler ve ???cayma??? hakk??n??n kullan??lmas?? ve bu hakk??n nas??l kullan??laca???? ,</br>' +
        '??ikayet ve itirazlar??n?? iletebilecekleri resmi makamlar vs. konusunda a????k , anla????l??r ve internet ortam??na uygun ??ekilde sat??c?? taraf??ndan bilgilendirildi??ini ,</br>' +
        'bu ??n bilgileri elektronik ortamda teyit etti??ini ve sonras??nda mal sipari?? verdi??ini is bu s??zle??me h??k??mlerince kabul ve beyan eder.' +
        'https://www.' + agreementSellerWebAddress + ' sitesinde yer alan ??n bilgilendirme ve al??c?? taraf??ndan verilen sipari?? ??zerine d??zenlenen fatura is bu s??zle??menin ayr??lmaz par??alar??d??r.</br>' +
        'Madde 3- S??zle??me Konusu ??r??n/??deme/Teslimat Bilgileri </br>' +
        'Elektronik ortamda al??nan ??r??n/??r??nlerin cinsi ve t??r??, miktar??, marka/modeli, sat???? bedeli, ??deme ??ekli, teslim alacak ki??i, teslimat adresi, fatura bilgileri, kargo ??creti</br>' +
        'a??a????da belirtildi??i gibidir.Fatura edilecek ki??i ile s??zle??meyi yapan ki??i ayn?? olmak zorundad??r.A??a????da yer alan bilgiler do??ru ve eksiksiz olmal??d??r. Bu bilgilerin do??ru </br>' +
        'olmad?????? veya noksan oldu??u durumlardan do??acak zararlar?? tamam??yla kar????lamay?? al??c?? kabul eder ve ayr??ca bu durumdan olu??abilecek her t??rl?? sorumlulu??u al??c?? kabul eder.</br>' +
        'SATICI gerekli g??rd?????? durumlarda, ALICI???n??n vermi?? oldu??u bilgiler ger??ekle ??rt????medi??inde, sipari??i durdurma hakk??n?? sakl?? tutar. SATICI sipari??te sorun tespit etti??i</br>' +
        'durumlarda ALICI???n??n vermi?? oldu??u telefon, e-posta ve posta adreslerinden ALICI???ya ula??amad?????? takdirde sipari??in y??r??rl????e koyulmas??n?? 15 (onbe??) g??n s??reyle dondurur.</br>' +
        'ALICI???n??n bu s??re zarf??nda SATICI ile konuyla ilgili olarak ileti??ime ge??mesi beklenir. Bu s??re i??erisinde ALICI???dan herhangi bir cevap al??namazsa SATICI, her iki taraf??n da </br>' +
        'zarar g??rmemesi i??in sipari??i iptal eder. </br>' +
        'Al??nan ??r??n / ??r??nler </br>' +


        htmlForMail + '</br>' +
        'Toplam Sat???? Bedeli : ' + agreementBuyerGrandTotal + ' ' + agreementBuyerGrandTotalCurrency + '</br>' +
        '??deme ??ekli : ' + ' Kredi Kart??/Banka Havalesi (EFT) ' + '</br>' +
        'Teslim Edilecek Ki??i : ' + agreementBuyerName + '</br>' +
        'Telefon Numaras?? : ' + agreementBuyerPhone + '</br>' +
        'Teslim Edilecek Adres : ' + agreementBuyerDeliveryAddress + '</br>' +
        'Fatura Edilecek Ki??i/Kurum : ' + agreementBuyerBillingName + '</br>' +
        'Fatura Adresi : ' + agreementBuyerBillingAddress + '</br>' +
        'Vergi Dairesi : ' + agreementTaxPlace + '</br>' +
        'Vergi Sicil Numaras?? : ' + agreementTaxNo + '</br>' +
        'Kargo ??creti : ' + agreementCargoPrice + ' ' + agreementCargoPriceCurrency + '</br>' +

        ' </br>' +
        'Madde 4 - S??zle??me Tarihi ve M??cbir Nedenler </br>' +
        'S??zle??me tarihi, al??c?? taraf??ndan sipari??in verildi??i tarih olan' + orderDate + 'tarihidir.</br>' +
        'S??zle??menin imzaland?????? tarihte mevcut olmayan veya ??ng??r??lmeyen, taraflar??n kontrolleri d??????nda geli??en, ortaya ????kmas??yla taraflardan birinin ya da her ikisinin de s??zle??me ile</br>' +
        'y??klendikleri bor?? ve sorumluluklar??n?? k??smen ya da tamamen yerine getirmelerini ya da bunlar?? zaman??nda yerine getirmelerini olanaks??zla??t??ran durumlar, m??cbir sebep (Do??al afet,</br>' +
        'sava??, ter??r, ayaklanma, de??i??en mevzuat h??k??mleri, el koyma veya grev, lokavt, ??retim ve ileti??im tesislerinde ??nemli ??l????de ar??za vb.) olarak kabul edilecektir. M??cbir sebep ??ahs??nda </br>' +
        'ger??ekle??en taraf, di??er tarafa durumu derhal ve yaz??l?? olarak bildirecektir.</br>' +
        'M??cbir sebebin devam?? esnas??nda taraflar??n edimlerini yerine getirememelerinden dolay?? herhangi bir sorumluluklar?? do??mayacakt??r. ????bu m??cbir sebep durumu 30 (otuz ) g??n s??reyle devam ederse,</br>' +
        'taraflardan her birinin, tek tarafl?? olarak fesih hakk?? do??mu?? olacakt??r.</br>' +
        'Madde 5- Sat??c??n??n Hak ve Y??k??ml??l??kleri </br>' +
        '5.1. Sat??c??, 4077 say??l?? T??keticilerin Korunmas?? Hakk??ndaki Kanun ve Mesafeli S??zle??melere Dair Y??netmelik h??k??mleri uyar??nca s??zle??mede kendisine y??klenen edimleri m??cbir haller d??????nda </br>' +
        'eksiksiz yerine getirmeyi kabul ve taahh??t eder.</br>' +
        '5.2. 18 (on sekiz) ya????ndan k??????k ki??iler https://www.' + agreementSellerWebAddress + '???den al????veri?? yapamaz. Sat??c??, al??c??n??n s??zle??mede belirtti??i ya????n??n do??ru oldu??unu esas alacakt??r. Ancak al??c??n??n</br>' +
        'ya????n?? yanl???? yazmas??ndan dolay?? sat??c??ya hi??bir ??ekilde sorumluluk y??klenemeyecektir.' +
        '5.3. Sistem hatalar??ndan meydana gelen fiyat yanl????l??klar??ndan https://www.' + agreementSellerWebAddress + 'sorumlu de??ildir. Buna istinaden sat??c??, internet sitesindeki sistemden, dizayndan veya yasad?????? yollarla</br>' +
        'internet sitesine yap??labilecek m??dahaleler sebebiyle ortaya ????kabilecek tan??t??m, fiyat hatalar??ndan sorumlu de??ildir. Sistem hatalar??na dayal?? olarak al??c?? sat??c??dan hak iddias??nda bulunamaz.</br>' +
        '5.3. https://www.' + agreementSellerWebAddress + 'den kredi kart?? (Visa, MasterCard , vs. ) ya da banka havalesi ile al????veri?? yap??labilir. Sipari?? tarihinden itibaren bir hafta i??inde havalesi yap??lmayan</br>' +
        'sipari??ler iptal edilir. Sipari??lerin i??leme al??nma zaman??, sipari??in verildi??i an de??il, kredi kart?? hesab??ndan gerekli tahsilat??n yap??ld?????? ya da havalenin (EFT???nin) banka hesaplar??na ula??t?????? belirlenen and??r.</br>' +
        '??demeli g??nderi ya da posta ??eki gibi m????teri hizmetleri ile g??r??????lmeden ger??ekle??tirilen ??deme y??ntemleri kabul edilmez.</br>' +
        'Madde 6- Al??c??n??n Hak ve Y??k??ml??l??kleri </br>' +
        '6.1. Al??c??, s??zle??mede kendisine y??klenen edimleri m??cbir sebepler d??????nda eksiksiz yerine getirmeyi kabul ve taahh??t eder.</br>' +
        '6.2. Al??c??, sipari?? vermekle birlikte i?? s??zle??me h??k??mlerini kabul etmi?? say??ld??????n?? ve s??zle??mede belirtilen ??deme ??ekline uygun ??demeyi yapaca????n?? kabul ve taahh??t eder.</br>' +
        '6.3. Al??c??, https://www.' + agreementSellerWebAddress + ' internet sitesinden sat??c??n??n isim, unvan, a????k adres, telefon ve di??er eri??im bilgileri , sat????a konu mal??n temel nitelikleri, vergiler dahil olmak ??zere sat???? fiyat?? , ??deme sekli,</br>' +
        'teslimat ko??ullar?? ve masraflar?? vs. sat????a konu mal ile ilgili t??m ??n bilgiler ve ???cayma??? hakk??n??n kullan??lmas?? ve bu hakk??n nas??l kullan??laca???? , ??ikayet ve itirazlar??n?? iletebilecekleri resmi makamlar vs. konusunda a????k , anla????l??r ve </br>' +
        'internet ortam??na uygun ??ekilde bilgi sahibi oldu??unu bu ??n bilgileri elektronik ortamda teyit etti??ini kabul ve beyan eder.</br>' +
        '6.4. Bir ??nceki maddeye ba??l?? olarak Al??c??, ??r??n sipari?? ve ??deme ko??ullar??n??n, ??r??n kullan??m talimatlar??n??n , olas?? durumlara kar???? al??nan tedbirlerin ve yap??lan uyar??lar??n oldu??u https://www.' + agreementSellerWebAddress + ' sipari??/??deme/kullan??m </br>' +
        'prosed??r?? bilgilerini okuyup bilgi sahibi oldu??unu ve elektronik ortamda gerekli teyidi verdi??ini beyan eder.</br>' +
        '6.5. Al??c??, ald?????? ??r??n?? iade etmek istemesi durumunda ne surette olursa olsun ??r??ne ve ambalaj??na zarar vermemeyi, iade an??nda fatura asl??n?? ve irsaliyesini iade etmeyi kabul ve taahh??t eder.</br>' +
        'Madde 7- Sipari??/??deme Prosed??r?? </br>' +
        'Sipari?? : </br>' +
        'Al????veri?? sepetine eklenen ??r??nlerin KDV dahil TL tutar?? (Taksitli i??lemlerde toplam taksit tutarlar??) al??c?? taraf??ndan onayland??ktan sonra, ilgili banka kart??n??n posu ??zerinden i??leme al??n??r.</br>' +
        'Bu nedenle sipari??ler, sevk edilmeden ??nce m????teriye sipari?? onay maili g??nderilir. Sipari?? Onay maili g??nderilmeden sevkiyat yap??lmaz.</br>' +
        'S??re??teki herhangi bir aksama durumu ya da kredi kart?? ile ilgili ortaya ????kabilecek problemler al??c??ya s??zle??mede belirtti??i telefon/faks/e-mail yollar??ndan biri veya bir ka???? kullan??lmak sureti ile bildirilir. Gerekirse al??c??dan bankas?? ile </br>' +
        'g??r????mesi istenebilir. Sipari??lerin i??leme al??nma zaman??, sipari??in verildi??i an de??il, kredi kart?? hesab??ndan gerekli tahsilat??n yap??ld?????? ya da havalenin (EFT??? nin) sat??c?? hesaplar??na ula??t??????n??n belirlendi??i and??r.</br>' +
        '??stisnai olarak hakl?? bir nedenle s??zle??me konusu mal??n tedarik edilemeyece??inin anla????lmas?? ve/veya stok problemi ile kar????la????lmas?? durumunda al??c?? hemen a????k ve anla????l??r bir ??ekilde bilgilendirilip onay vermesi durumunda</br>' +
        'al??c??ya e??it kalitede ve fiyatta ba??ka bir mal g??nderilebilir ya da al??c??n??n arzusu ve se??imi do??rultusunda ; yeni ba??ka bir ??r??n g??nderilebilir, ??r??n??n stoklara girmesi ya da teslime engel di??er engelin ortadan kalkmas?? beklenebilir ve/veya sipari?? iptal edilebilir.</br>' +
        'S??zle??me konusu mal??n teslim y??k??ml??l??????n??n yerine getirilmesinin imk??ns??zla??t?????? h??llerde al??c?? bu durumdan haberdar edilerek ??demi?? oldu??u toplam bedel ve varsa onu bor?? alt??na sokan her t??rl?? belge en ge?? on g??n i??inde kendisine iade edilerek s??zle??me iptal edilir.</br>' +
        'B??yle bir durumda al??c??n??n sat??c??dan ilave herhangi bir maddi ve manevi zarar talebi olmayacakt??r.</br>' +
        '??deme : </br>' +
        'https://www.' + agreementSellerWebAddress + '???de, internet ortam??nda kredi kart?? bilgilerini kullanmak istemeyen al??c??lara nakit havale ile sipari?? imkanlar?? sunulmu??tur. Havale ile ??demede al??c?? kendisine en uygun bankay?? se??ip havalesini yapabilir. E??er EFT yap??lm????sa</br>' +
        'hesaba ge??me tarihi dikkate al??nacakt??r. Havale ve/veya EFT yaparken ???G??nderen Bilgileri???nin Fatura Bilgileri ile ayn?? olmas?? ve sipari?? numaras??n??n yaz??lmas?? gereklidir.</br>' +
        '??r??n??n tesliminden sonra Al??c?????ya ait kredi kart??n??n Al??c?????n??n kusurundan kaynaklanmayan bir ??ekilde yetkisiz ki??ilerce haks??z veya hukuka ayk??r?? olarak kullan??lmas?? nedeni ile ilgili banka veya finans kurulu??un ??r??n bedelini Sat??c?????ya ??dememesi halinde, Al??c?????n??n</br>' +
        'kendisine teslim edilmi?? ??r??n?? 10 g??n i??inde Sat??c?????ya g??ndermesi zorunludur. Bu t??r durumlarda nakliye giderleri Al??c?????ya aittir.</br>' +
        'Al??c?? kredi kart?? ile ??deme yapmay?? tercih etmi?? ise ALICI, ilgili faiz oranlar??n?? ve temerr??t faizi ile ilgili bilgileri bankas??ndan ayr??ca teyit edece??ini, y??r??rl??kte bulunan mevzuat h??k??mleri gere??ince faiz ve temerr??t faizi ile ilgili h??k??mlerin Banka ve ALICI </br>' +
        'aras??ndaki ???Kredi Kart?? S??zle??mesi??? kapsam??nda uygulanaca????n?? kabul, beyan ve taahh??t eder.</br>' +
        'Madde 8- Sevkiyat/Teslimat Prosed??r?? </br>' +
        'Sevkiyat: </br>' +
        'Sipari?? onay?? mailinin g??nderilmesiyle birlikte, ??r??n/??r??nler sat??c??n??n anla??mal?? oldu??u kargo ??irketine verilir.</br>' +
        'Teslimat: </br>' +
        '??r??n/??r??nler sat??c??n??n anla??mal?? oldu??u kargo ile al??c??n??n adresine teslim edilecektir. Teslimat s??resi, Sipari?? onay?? mailinin g??nderilmesinden ve s??zle??menin kurulmas??ndan itibaren 30 g??nd??r. Al??c??ya ??nceden yaz??l?? olarak veya bir s??rekli veri ta????y??c??s??yla </br>' +
        'bildirilmek ko??uluyla bu s??re en fazla on g??n uzat??labilir.</br>' +
        '??r??nler, Kargo ??irketlerinin adres teslimat?? yapmad?????? b??lgelere telefon ihbarl?? olarak g??nderilir.</br>' +
        'Kargo ??irketinin haftada bir g??n teslimat yapt?????? b??lgelerde, sevk bilgilerindeki yanl????l??k ve eksiklik oldu??u hallerde, baz?? sosyal olaylar ve do??al afetler gibi durumlarda belirtilen g??n s??resinde sarkma olabilir. Bu sarkmalardan dolay?? al??c?? sat??c??ya herhangi</br>' +
        'bir sorumluluk y??kleyemez. ??r??n, Al??c?????dan ba??ka bir ki??i/kurulu??a teslim edilecek ise, teslim edilecek ki??i/kurulu??un teslimat?? kabul etmemesinden, sevk bilgilerindeki yanl????l??k ve/veya Al??c??n??n yerinde olmamas??ndan do??abilecek ekstra kargo bedellerinden sat??c?? </br>' +
        'sorumlu de??ildir. Belirtilen g??nler i??eri??inde ??r??n/??r??nler m????teriye ula??mad??ysa teslimat problemleri m????teri hizmetlerine info@nishman.com.tr e-mail adresi kullan??lmak sureti ile derhal bildirilmelidir.</br>' +
        'Zarar g??rm???? paket durumunda; Zarar g??rm???? paketler teslim al??nmayarak Kargo ??irketi yetkilisine tutanak tutturulmal??d??r. E??er Kargo ??irketi yetkilisi paketin hasarl?? olmad?????? g??r??????nde ise, paketin orada a????larak ??r??nlerin hasars??z teslim edildi??ini </br>' +
        'kontrol ettirme ve durumun yine bir tutanakla tespit edilmesini isteme hakk?? al??c??da vard??r. Paket Al??c?? taraf??ndan teslim al??nd??ktan sonra Kargo ??irketinin g??revini tam olarak yapt?????? kabul edilmi?? olur. Paket kabul edilmemi?? ve tutanak tutulmu?? ise, durum,</br>' +
        'tutana????n Al??c?????da kalan kopyas??yla birlikte en k??sa zamanda sat??c?? M????teri Hizmetlerine bildirilmelidir.</br>' +
        'Madde 9- ??r??n ??ade ve Cayma Hakk??na ??li??kin Prosed??r?? </br>' +
        '??r??n ??ade: </br>' +
        'Al??c?? mal?? teslim ald??ktan sonra yedi g??n i??erisinde herhangi bir gerek??e g??stermeksizin ve cezai ??art ??demeksizin s??zle??meden cayma hakk??na sahiptir. 385 say??l?? vergi usul kanunu genel tebli??i uyar??nca iade i??lemlerinin yap??labilmesi i??in al??c??n??n mal ile birlikte</br>' +
        'teslim edilen sat??c??ya ait 2 adet faturan??n alt k??sm??ndaki iade b??l??mlerini eksiksiz ve do??ru ??ekilde doldurduktan sonra imzalayarak bir n??shas??n?? ??r??n ile birlikte sat??c??ya g??ndermesi di??er n??shas??n?? da uhdesinde tutmas?? gerekmektedir.Cayma hakk?? s??resi al??c??ya mal??n </br>' +
        'teslim edildi??i g??nden itibaren ba??lar. ??ade edilen ??r??n veya ??r??nlerin geri g??nderim bedeli al??c?? taraf??ndan kar????lanmal??d??r.</br>' +
        'Al??c??n??n istekleri ve/veya a????k??a onun ki??isel ihtiya??lar?? do??rultusunda haz??rlanan mallar i??in cayma hakk?? s??z konusu de??ildir.</br>' +
        'Al??c??n??n cayma hakk??n?? kullanmas?? halinde sat??c??, cayma bildirimini i??eren faturan??n ??r??nle birlikte kendisine ula??mas??ndan itibaren en ge?? on g??n i??erisinde alm???? oldu??u toplam bedeli ve varsa t??keticiyi bor?? alt??na sokan her t??rl?? belgeyi t??keticiye hi??bir masraf y??klemeden iade edecektir.</br>' +
        'Teslim al??nm???? olan mal??n de??erinin azalmas?? veya iadeyi imk??ns??z k??lan bir nedenin varl?????? cayma hakk??n??n kullan??lmas??na engel de??ildir. Ancak de??er azalmas?? veya iadenin imk??ns??zla??mas?? t??keticinin kusurundan kaynaklan??yorsa sat??c??ya mal??n de??erini veya de??erindeki azalmay?? tazmin etmesi gerekir.</br>' +
        'Sehven al??nan her ??r??n i??in de genel iade s??resi 7 g??nd??r. Bu s??re i??erisinde, Ambalaj?? a????lm????, kullan??lm????, tahrip edilmi?? vesaire ??ekildeki ??r??nlerin iadesi kabul edilmez. ??ade, orijinal ambalaj ile yap??lmal??d??r.</br>' +
        'Sehven al??nan ??r??nde ve ambalaj??nda herhangi bir a????lma, bozulma, k??r??lma, tahrip, y??rt??lma, kullan??lma ve sair durumlar tespit edildi??i hallerde ve ??r??n??n al??c??ya teslim edildi??i andaki hali ile iade edilememesi durumunda ??r??n iade al??nmaz ve bedeli iade edilmez.</br>' +
        '??r??n iadesi i??in, durum ??ncelikli olarak m????teri hizmetlerine iletilmelidir. ??r??n??n iade olarak g??nderilme bilgisi, sat??c?? taraf??ndan m????teriye iletilir. Bu g??r????meden sonra ??r??n iade ile ilgili bilgileri i??eren fatura ile birlikte al??c?? adresine teslimat?? yapan Kargo ??irketi kanal??yla sat??c??ya ula??t??rmal??d??r.</br>' +
        'Sat??c??ya ula??an iade ??r??n i?? bu s??zle??mede belirtilen ko??ullar?? sa??lad?????? takdirde iade olarak kabul edilir, geri ??demesi de al??c?? kredi kart??na/hesab??na yap??l??r. ??r??n iade edilmeden bedel iadesi yap??lmaz. Kredi Kart??na yap??lan iadelerin kredi kart?? hesaplar??na yans??ma s??resi ilgili bankan??n tasarrufundad??r.</br>' +
        'Al????veri?? kredi kart?? ile ve taksitli olarak yap??lm????sa, kredi kart??na iade prosed??r?? ??u ??ekilde uygulanacakt??r: Al??c?? ??r??n?? ka?? taksit ile sat??n alma talebini iletmi?? ise, Banka al??c??ya geri ??demesini taksitle yapmaktad??r. Sat??c??,bankaya ??r??n bedelinin tamam??n?? tek seferde ??dedikten sonra, Banka poslar??ndan </br>' +
        'yap??lan taksitli harcamalar??n al??c??n??n kredi kart??na iadesi durumundakonuya m??dahil taraflar??n ma??dur duruma d????memesi i??in talep edilen iade tutarlar??,yine taksitli olarak hamil taraf hesaplar??na Banka taraf??ndan aktar??l??r.Al??c??n??n sat???? iptaline kadar ??demi?? oldu??u taksit tutarlar??, e??er iade tarihi ile kart??n</br>' +
        'hesap kesim tarihleri ??ak????mazsa her ay karta 1(bir) iade yans??yacak ve al??c?? iade ??ncesinde ??demi?? oldu??u taksitleri sat??????n taksitleri bittikten sonra, iade ??ncesinde ??demi?? oldu??u taksit say??s?? kadar ay daha alacak ve mevcut bor??lar??ndan d????m???? olacakt??r.</br>' +
        'Kart ile al??nm???? mal ve hizmetin iadesi durumunda sat??c??, Banka ile yapm???? oldu??u s??zle??me gere??i al??c??ya nakit para ile ??deme yapamaz. ??ye i??yeri yani sat??c??, bir iade i??lemi s??z konusu oldu??unda ilgili yaz??l??m arac??l?????? ile iadesini yapacak olup, ??ye i??yeri yani sat??c?? ilgili tutar?? Bankaya nakden veya mahsuben</br>' +
        '??demekle y??k??ml?? oldu??undan yukar??da detaylar?? belirtilen prosed??r gere??ince al??c??ya nakit olarak ??deme yap??lamamaktad??r. Kredi kart??na iade, al??c??n??n Bankaya bedeli tek seferde ??demesinden sonra, Banka taraf??ndan yukar??daki prosed??r gere??ince yap??lacakt??r.</br>' +
        'Madde 10-Garanti </br>' +
        'Kullanma talimat??na uygun ??ekilde kullan??lan ve temizli??i yap??lan ??r??nler her t??rl?? ??retim hatas??na kar???? a??a????da belirtilen ??artlar dahilinde 2 y??l garantilidir: Sat??c??n??n garanti sorumlulu??u yaln??zca 4077 say??l?? kanun kapsam??na giren t??keticiler i??in ge??erlidir. Ticari nitelikteki i??ler i??in T??rk Ticaret Kanununu </br>' +
        'h??k??mleri ge??erli olacakt??r. </br>' +
        'Madde 11- Gizlilik </br>' +
        'Al??c?? taraf??ndan i?? bu s??zle??mede belirtilen bilgiler ile ??deme yapmak amac?? ile sat??c??ya bildirdi??i bilgiler sat??c?? taraf??ndan 3. ??ah??slarla payla????lmayacakt??r.</br>' +
        'Sat??c?? bu bilgileri sadece idari/ yasal zorunlulu??un mevcudiyeti ??er??evesinde a????klayabilecektir. Ara??t??rma ehliyeti belgelenmi?? her t??rl?? adli soru??turma dahilinde sat??c?? kendisinden istenen bilgiyi elinde bulunduruyorsa ilgili makama sa??layabilir.</br>' +
        'Kredi Kart?? bilgileri kesinlikle saklanmaz,Kredi Kart?? bilgileri sadece tahsilat i??lemi s??ras??nda ilgili bankalara g??venli bir ??ekilde iletilerek provizyon al??nmas?? i??in kullan??l??r ve provizyon sonras?? sistemden silinir.</br>' +
        'Al??c??ya ait e-posta adresi, posta adresi ve telefon gibi bilgiler yaln??zca sat??c?? taraf??ndan standart ??r??n teslim ve bilgilendirme prosed??rleri i??in kullan??l??r. Baz?? d??nemlerde kampanya bilgileri, yeni ??r??nler hakk??nda bilgiler, promosyon bilgileri al??c??ya onay?? sonras??nda g??nderilebilir.</br>' +
        'Madde 12- Uyu??mazl??k Durumunda Yetkili Mahkeme ve ??cra Daireleri </br>' +
        '????bu s??zle??menin uygulanmas??ndan kaynaklanan uyu??mazl??k halinde, Sanayi ve Ticaret Bakanl??????nca her y??l Aral??k ay??nda ilan edilen de??ere kadar T??ketici Hakem Heyetleri ile Al??c?????n??n veya Sat??c?????n??n yerle??im yerindeki T??ketici Mahkemeleri yetkilidir.</br>' +
        'Sipari??in ger??ekle??mesi durumunda Al??c?? i??bu s??zle??menin t??m ko??ullar??n?? kabul etmi?? say??l??r.' + orderDate +
        '</body></html>';





    const orderAgreement = new OrderAgreement({
        orderId: orderId,
        agreement: agreement
    });

    const resultAgreement = await orderAgreement.save();


};

