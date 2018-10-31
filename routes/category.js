var router = global.router;
let Category = require("../models/CategoryModel");
let Food = require("../models/FoodModel");
var mongoose = require("mongoose");

router.post("/inser_new_category", (request, response, next) => {
    const critera = {
        name: new RegExp("^" + request.body.name.trim() + "$", "i"),
    }
    Category.find(critera).limit(1).exec((err, categorys) =>{
        if (err) {

        } else {
            //TODO: if name is exists, do not allow insert
            if (categorys.length > 0) {

            } else {
                // can insert
                const newCategory = new Category({
                    name: request.body.name,
                    description: request.body.description,
                });
                debugger;
                newCategory.save((err, addedCategory) => {
                    if (err) {
                        response.json({
                            result: "failed",
                            data: [],
                            message: `Error is: ${err}`
                        });
                    } else {
                        response.json({
                            result: "ok",
                            data: addedCategory,
                            message: "Success"
                        });
                    }
                })
            }
        }
    });
});

router.delete("/delete_a_category", (request, response, next) => {
    Category.findOneAndRemove({_id: mongoose.Types.ObjectId(request.body.category_id)}, (err) => {
        if (err) {
            response.json({
                result: "failed",
                message: `Can not remove ${err}`,
            });
            return;
        }
        Food.findOneAndRemove({categoryId: mongoose.Types.ObjectId(request.body.category_id)}, (err) => {
            if (err) {
                response.json({
                    result: "failed",
                    data: [],
                    message: `Can not remove ${request.body.category_id}`,
                });
                return;
            }
            response.json({
                result: "ok",
                message: "Success",
            });
        })
    });
});

module.exports = router;