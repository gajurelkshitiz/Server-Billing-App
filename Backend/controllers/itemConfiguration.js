const ItemConfiguration = require("../models/itemConfiguration");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError, notFoundError } = require("../errors");
const itemConfiguration = require("../models/itemConfiguration");

const createItemConfig = async (req, res) => {
    console.log(req.body);
    const { itemCode, description, group, hsCode, unit, salesPrice, purchasePrice, companyID } = req.body;
    if ( !itemCode || !description || !companyID ) {
        throw new BadRequestError("Please Provide Necessary Values for Item Configuration.")
    }
    req.body.adminID = req.user.tokenID;

    // create a itemconfig:
    const itemConfig = await ItemConfiguration.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ itemConfig });
    
}

const getAllItemsConfig = async (req, res) => {
    companyID = req.query.companyID;
    const itemsConfig = await itemConfiguration.find({ companyID });
    res.status(StatusCodes.OK).json({ itemsConfig, count: itemsConfig.length })
}

const getItemConfig = async (req, res) => {
    const {
        params: { id: itemID }
    } = req;

    const itemConfig = await ItemConfiguration.findOne({ _id: itemID});

    if (!itemConfig) {
        throw new notFoundError("No item with such id found.");
    }

    res.status(StatusCodes.OK).json({ itemConfig });
}

const updateItemConfig = async (req, res) => {
    const {
        params: { id: itemID },
        body: { itemCode, description, group, hsCode, unit, salesPrice, purchasePrice }
    } = req;

    if ( itemCode === "" || description === "" || group === "" || hsCode === "" || unit === "" || salesPrice === "" || purchasePrice === "" ) {
        throw new BadRequestError("All the Fields cannot be empty at once.");
    }

    const itemConfig = await ItemConfiguration.findOneAndUpdate(
        {_id: itemID},
        req.body,
        { new: true, runValidators: true }
    );

    if (!itemConfig) {
        throw new notFoundError("No item with ID found.")
    }
    res.status(StatusCodes.OK).json({ itemConfig });
}


// will write the code later of this:
const deleteItemConfig = async (req, res) => {
    const {
        params: {id: itemID},
    } = req;

    const itemConfig = await ItemConfiguration.findOneAndDelete({
        _id: itemID
    });
    
    if (!itemConfig) {
        throw new notFoundError("No Item Config found with this id.");
    }
    res.status(StatusCodes.OK).send();
}


module.exports = {
    getAllItemsConfig,
    createItemConfig,
    getItemConfig,
    updateItemConfig,
    deleteItemConfig
}