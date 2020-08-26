const { Router } = require('express');
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');

router.get('/', async (req, res) => {
    const photos = await Photo.find();
    console.log(photos);
    res.render('images', photos);       
});

router.get('/images/add', async (req, res) => {
    const photos = await Photo.find();
    res.render('image_form', {photos});
});

router.post('/images/add', async (req , res) => {
    const {title, decription } = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const newPhoto = new Photo({
        title,
        decription,
        imageURL: result.url,
        public_id: result.public_id
    }); 
    await newPhoto.save();
    await fs.unlink(req.file.path);
    res.send('Received');
});

module.exports = router;
