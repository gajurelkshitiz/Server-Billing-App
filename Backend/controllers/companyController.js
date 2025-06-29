const {StatusCodes} = require('http-status-codes');
const Company = require('../models/company');
const { UnauthenticatedError } = require('../errors');

const getCompaniesbyAdmin = async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new UnauthenticatedError('Not Authorized to get companies');
    }

    const companies = await Company.find({ adminID: req.user.tokenID }).select('name _id');
    res.status(StatusCodes.OK).json({ companies});
}

module.exports = {
    getCompaniesbyAdmin,
}