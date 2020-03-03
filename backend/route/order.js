const router = require('express').Router();
const mongoose = require('mongoose');

let Restaurant = require('../model/restaurant');
let MenuItem = require('../model/menuitem');
let User = require('../model/user');
let Order = require('../model/order');

router.route('/all').get(async (req, res) => {
   try {
       let all = await Order.find();
       res.status(200).json(all);
   } catch (err) {
       res.status(400).json(err);
   }
});

router.route('/update').post(async (req, res) => {
    if(!req.headers.customerid || !req.headers.restaurantid){
        res.status(400).json("requires customer id and restaurant id");
        return;
    }
    try {
        let order = await Order.findOne({customerId: req.headers.customerId, restaurantId: req.headers.restaurantId});
        if(!req.headers.status){
            res.status(400).json("requires status");
            return;
        }
        if(req.headers.status!=="IN_PROGRESS"&&req.headers!=="COMPLETE"){
            res.status(400).json("status can only be IN_PROGRESS or COMPLETE");
            return;
        }
        order.status = req.headers.status;
        order.save();
        res.status(200).json("status has been updated");
        return;
    } catch (err) {
        res.status(500).json(err);
    }
});

router.route('/create').post(async (req, res) => {
    if(!req.body.customerId || !req.body.restaurantId){
        res.status(400).json("bad req");
        return
    }

    try {
        let rest = await Restaurant.findById(req.body.restaurantId);
        let cust = await User.findById(req.body.customerId);

        if(!rest || !cust) 
            throw "Restaurant or customer does not exist";
        
        let orderObj = req.body; 
        
        let price = 0; 
        let itemList = [];

        for(const itemId of orderObj.order_items){
            let item = await MenuItem.findById(itemId);
            itemList.push(item);
            if(item) price+=item.price;
        }

        orderObj.price = price;

        let createdOrder = new Order({
            restaurantId: mongoose.Types.ObjectId(req.body.restaurantId),
            customerId: mongoose.Types.ObjectId(req.body.customerId),
            order_items: itemList,
            price : orderObj.price, 
        });

        await linkOrderToRestaurantAndCustomer(createdOrder._id, createdOrder.restaurantId, createdOrder.customerId);
        await createdOrder.save();

        res.status(201).json(createdOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

async function linkOrderToRestaurantAndCustomer(orderId, restoId, customerId){
    let restaurant = await Restaurant.findByIdAndUpdate(restoId,
        { $push: { orders: orderId } },
        { new: true, useFindAndModify: false });
    
    let user = await User.findByIdAndUpdate(customerId,
        { $push: { orders: orderId } },
        { new: true, useFindAndModify: false });

}

module.exports = router;