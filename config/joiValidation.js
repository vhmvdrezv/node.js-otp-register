import joi from 'joi';

const phoneValidator = joi.string().pattern(/^(091|099|093|092)\d{8}$/)

export default phoneValidator;