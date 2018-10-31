var router = global.router; // router in index

let Food = require("../models/FoodModel");
var mongoose = require("mongoose");
let fs = require("fs");

/**TODO: get all*/
router.get("/get_all_food", (request, response, next) => {
    Food.find({}).limit(100).sort({name: 1}).select({
        name: 1,
        foodDescription: 1,
        created_data: 1,
        status: 1,
    }).exec((err, foods) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: foods,
                count: foods.length,
                message: "Query list success",
            });
        }
    });
});

/**TODO: get with id**/
router.get("/get_food_with_id", (request, response, next) => {
    Food.findById(require("mongoose").Types.ObjectId(request.query.food_id), // key == food_id
    //http://localhost:1998/get_food_with_id?food_id=5bcf312992f69a2fc150b5a7
        (err, foods) => {
            if (err) {
                response.json({
                    result: "failed",
                    data: [],
                    message: `Error is: ${err}`
                });
            } else {
                response.json({
                    result: "ok",
                    data: foods,
                    count: foods.length,
                    message: "Query list success",
                });
            }
        }
    );
});

/**Get with criteria (ex: get with name)**/
router.get("/get_food_with_criteria", (request, response, next) => {
    if (!request.query.name) {
        response.json({
            result: "failed",
            data: [],
            message: `Error is: ${err}`
        });
    }
    let criteria = {
        //name: RegExp(request.query.name, "i"),  
        name: RegExp("^" + request.query.name + "$", "i"),
    };
    const limit = parseInt(request.query.limit) > 0 ? parseInt(request.query.limit) : 100;
    // http://localhost:1998/get_food_with_criteria?name=cat&limit=5
    Food.find(criteria).limit(limit).sort({name: 1}).select({
        name: 1,
        foodDescription: 1,
        create_date: 1,
        status: 1,
    }).exec((err, foods) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: foods,
                count: foods.length,
                message: "Query list success",
            });
        }
    });
});

/**TODO: insert**/
router.post("/insert_food", (request, response, next) => {
    const newFood = new Food({
        name: request.body.name, //key=name, body=value,
        foodDescription: request.body.foodDescription,
        status: request.body.status,
    });
    newFood.save((err) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                message: `Error ${err}`,
            });
        } else {
            response.json({
                result: "ok",
                data: {
                    name: request.body.name,
                    foodDescription: request.body.foodDescription,
                    status: request.body.status,
                    message: "Insert Success",
                }
            });
        }
    });
});

/**TODO: POST Images**/
router.post("/insert_image", (request, response, next) => {
    let formidable = require("formidable");
    /**parse a file upload**/
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads"; // dir for upload
    form.keepExtensions = true; // keep .png, .jpg
    form.maxFieldsSize = 10*1024*1024 // 10mb max for an image
    form.multiples = true,
    form.parse(request, (err, fields, files) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                message: `Cannot upload images.Error is ${err}`,
            });
        } 

        var arrayOffFiles = files[""]; // file for update
        if (arrayOffFiles.length > 0) {
            var fileNames = [];
            arrayOffFiles.forEach((eachFile) => {
                //fileNames.push(eachFile.path);
                fileNames.push(eachFile.path.split("/")[1]) // split 1 array => 2 array
            });
            response.json({
                result: "ok",
                data: fileNames,
                numberOffImages: fileNames.length,
                message: "upload is success"
            });
        } else {
            response.json({
                result: "failed",
                data: {},
                numberOffImages: 0,
                message: `Cannot upload images.Error is ${err}`,
            })
        }
    });
});

/**TODO: get an image**/
router.get("/open_images", (request, response, next) => {
    let imagesName = "uploads/" + request.query.image_name;
    fs.readFile(imagesName, (err, imageData) => {
        if (err) {
            response.json({
                result: "failed",
            }); 
        }
        response.writeHead(200, {"Content-Type": "image/jpeg"});
        response.end(imageData);
    });
});

/**TODO: update**/
router.put("/update_food", (request, response, next) => {
    /**critera for _id = value id**/
    let conditions = {};
    if (mongoose.Types.ObjectId.isValid(request.body.food_id) == true) {
        conditions._id = mongoose.Types.ObjectId(request.body.food_id);
    } else {
        response.json({
            result: "failed",
            data: {},
            message: "You must enter to update",
        });
    }
    
    /**value for update**/
    let newValues = {};
    if (request.body.name && request.body.name.length > 2) {
        newValues.name = request.body.name;
    }

    // update image
    if (request.body.image_name && request.body.image_name.length > 0) {
        // http://localhost:1998/open_images?image_name=upload_480d8ca9e34f5fdb1a1c52394dccd0a8.jpg
        const serverName = require("os").hostname();
        const serverPort = require("../app").settings.port;
        newValues.imageUrl = `${serverName}:${serverPort}/open_images?image_name=${request.body.image_name}`;
    }

    /**option**/
    const options = {
        new: true, // return the modified document rather than the original
        multi: true, // update muiltiple
    };

    /**add category_id to food**/
    if (mongoose.Types.ObjectId.isValid(request.body.category_id) == true) {
        newValues.categoryId = mongoose.Types.ObjectId(request.body.category_id);
    }

    Food.findOneAndUpdate(conditions, {$set: newValues}, options, (err, updatedFood) => {
        if (err) {

        } else {
            response.json({
                result: "ok",
                data: updatedFood,
                message: "Success",
            });
        }
    });
});

router.delete("/delete_food", (request, response, next) => {
    response.end("DELETE requested => delete");
});

module.exports = router;
