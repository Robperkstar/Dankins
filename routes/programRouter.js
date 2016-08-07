var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var programRouter = express.Router();
programRouter.use(bodyParser.json());
var Programs = require('../models/programs');
var Verify = require('./verify');

programRouter.route('/')
.get(function (req, res, next) {
    Programs.find(req.query)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.post( function (req, res, next) {
        
    Programs.create(req.body, function (err, program) {
        if (err) return next(err);
        console.log('Program created!');
        var id = program._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added the program with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,  function (req, res, next) {
    Programs.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

programRouter.route('/:programId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Programs.findById(req.params.programId)
        .populate('comments.postedBy')
        .exec(function (err, program) {
        if (err) return next(err);
        res.json(program);
    });
})

.put(function (req, res, next) {
    Programs.findByIdAndUpdate(req.params.programId, {
        $set: req.body
    }, {
        new: true
    }, function (err, program) {
        if (err) return next(err);
        res.json(program);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Programs.findByIdAndRemove(req.params.programId, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

programRouter.route('/:programId/comments')


.get(Verify.verifyOrdinaryUser,function (req, res, next) {
    Programs.findById(req.params.programId)
        .populate('comments.postedBy')
        .exec(function (err, program) {
        if (err) return next(err);
        res.json(program.comments);
    });
})

.post(Verify.verifyOrdinaryUser,function (req, res, next) {
    Programs.findById(req.params.programId, function (err, program) {
        if (err) return next(err);
        req.body.postedBy = req.decoded._id;
        program.comments.push(req.body);
        program.save(function (err, program) {
            if (err) return next(err);
            console.log('Updated Comments!');
            res.json(program);
        });
    });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
    Programs.findById(req.params.programId, function (err, program) {
        if (err) return next(err);
        for (var i = (program.comments.length - 1); i >= 0; i--) {
            program.comments.id(program.comments[i]._id).remove();
        }
        program.save(function (err, result) {
            if (err) return next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

programRouter.route('/:programId/comments/:commentId')


.get(Verify.verifyOrdinaryUser,function (req, res, next) {
    Programs.findById(req.params.programId)
        .populate('comments.postedBy')
        .exec(function (err, program) {
        if (err) return next(err);
        res.json(program.comments.id(req.params.commentId));
    });
})

.put(Verify.verifyOrdinaryUser,function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Programs.findById(req.params.programId, function (err, program) {
        if (err) return next(err);
        program.comments.id(req.params.commentId).remove();
                req.body.postedBy = req.decoded._id;
        program.comments.push(req.body);
        program.save(function (err, program) {
            if (err) return next(err);
            console.log('Updated Comments!');
            res.json(program);
        });
    });
})

.delete(function (req, res, next) {
    Programs.findById(req.params.programId, function (err, program) {
        if (program.comments.id(req.params.commentId).postedBy
           != req.decoded._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        program.comments.id(req.params.commentId).remove();
        program.save(function (err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });
});
module.exports = programRouter;
