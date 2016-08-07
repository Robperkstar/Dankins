var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var photoRouter = express.Router();
photoRouter.use(bodyParser.json());
var Photos = require('../models/photos');
var Verify = require('./verify');

photoRouter.route('/')
.get(function (req, res, next) {
    Photos.find(req.query)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.post( function (req, res, next) {
        
    Photos.create(req.body, function (err, photo) {
        if (err) return next(err);
        console.log('Photo created!');
        var id = photo._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added the photo with id: ' + id);
    });
})

.delete( function (req, res, next) {
    Photos.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

photoRouter.route('/:photoId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Photos.findById(req.params.photoId)
        .populate('comments.postedBy')
        .exec(function (err, photo) {
        if (err) return next(err);
        res.json(photo);
    });
})

.put(function (req, res, next) {
    Photos.findByIdAndUpdate(req.params.photoId, {
        $set: req.body
    }, {
        new: true
    }, function (err, photo) {
        if (err) return next(err);
        res.json(photo);
    });
})

.delete( function (req, res, next) {
        Photos.findByIdAndRemove(req.params.photoId, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = photoRouter;