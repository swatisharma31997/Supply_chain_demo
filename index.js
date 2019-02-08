"use strict";

var functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.database();
var ref = db.ref('supplyChain/orders/');
//var orderRef = ref.child('orders/{pushId}');

module.exports = {
    addOrder: functions.https.onRequest(function (req, res) {
        console.log("Function Add Order entered");
        console.log("Function Add Order exited");
        res.status(200).send("Successfully done");
        return addNewPurchaseOrder(req, res);
    }),
    createUserData: functions.database.ref('supplyChain/orders/').onWrite(event => {
        var orderDataWritten = event.data.val();
        var rolesDataInOrder = orderDataWritten.roles;
        db.ref('/supplyChain/users/').on(value, function (snapshot) {
            var userDataArray = snapshot.val();
            var flag = 0;
            userDataArray.forEach((userData) => {
                var rolesDataArray = userData.roles.role;
                rolesDataArray.forEach((roleData) => {
                    if (rolesDataInOrder[roleData.roleCode] !== undefined) {
                        flag = 1;
                    }
                })
                userData.orders.order = db.ref('/supplyChain/users/' + userData.userId + '/orders/order').child('/' + orderDataWritten.orderNo + '/').update({
                    orderNo: orderDataWritten.orderNo,
                    companyIdNo: orderDataWritten.companyIdNo
                })
            })
        })
        //db.ref('supplyChain/users/').child('/' + data.userid + '/').set(data);
    }),
    createNewUser: functions.https.onRequest(function (req, res) {
        console.log("Function Add user entered ");
        return addNewUser(req, res);
    })
}

/**
 * 
 */

function addNewUser(request, response){
    var orderData = {};
    request.body.orders.order.forEach(function (snapshot) {
        orderData[snapshot.orderNo] = snapshot
    })
    var rolesData = {};
    request.body.roles.role.forEach(function (snapshot) {
        rolesData[snapshot.roleCode] = snapshot
    })
    return db.ref('supplyChain/users/').child('/' + request.body.userid + '/').update({

        userid: request.body.userid,
        username: request.body.username,
        createdate: request.body.createdate,
        companyDetails: request.body.companyDetails,
        tokens: request.body.tokens,
        roles: rolesData,
        orders: orderData
    })
}

/**
 * Function to Add new Purchase Order to the List
 * @param {*} request 
 * @param {*} response 
 */
function addNewPurchaseOrder(request, response) {

            var skuDocs = {};
            request.body.skuDetails.sku.forEach(function (snapshot) {
                skuDocs[snapshot.skuId] = snapshot

            })

            var roleDocs = {};
            request.body.roles.role.forEach(function (snapshot) {
                roleDocs[snapshot.roleCode] = snapshot
            })

            return ref.child('/' + request.body.companyIdNo + '/' + request.body.orderNo + '/').update({
                varianceType: request.body.varianceType,
                varianceDesc: request.body.varianceDesc,
                companyIdNo: request.body.companyIdNo,
                orderNo: request.body.orderNo,
                orderStatusIdNo: request.body.orderStatusIdNo,
                orderStatusDesc: request.body.orderStatusDesc,
                branchIdNo: request.body.branchIdNo,
                branchCode: request.body.branchCode,
                branchName: request.body.branchName,
                promoInd: request.body.promoInd,
                styleIdNo: request.body.styleIdNo,
                styleCode: request.body.styleCode,
                styleDesc: request.body.styleDesc,
                deptIdNo: request.body.deptIdNo,
                deptCode: request.body.deptCode,
                deptDesc: request.body.deptDesc,
                varSubType: request.body.varSubType,
                inDcDate: request.body.inDcDate,
                dateBooked: request.body.dateBooked,
                daysDiff: request.body.daysDiff,
                expectedQty: request.body.expectedQty,
                highestBookedVarperc: request.body.highestBookedVarperc,
                highestgrv2Varperc: request.body.highestgrv2Varperc,
                //skuDetails: request.body.skuDetails,
                // roles: request.body.roles,
                varApproved: request.body.varApproved,
                varApprovedDate: request.body.varApprovedDate,
                varApprovedBy: request.body.varApprovedBy,
                varRejected: request.body.varRejected,
                varRejectDate: request.body.varRejectDate,
                varRejectedBy: request.body.varRejectedBy,
                skuDetails: skuDocs,
                roles: roleDocs
            });

        }
    