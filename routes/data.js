const express = require("express");
const router = express.Router();

let initData = [
    {
        id: 1,
        date: new Date('2020-02-02'), 
        type: 'Run',
        distance: 4,
        comment: 'nice'
    },
    {
        id: 2,
        date: new Date('2020-01-02'), 
        type: 'Ski',
        distance: 35,
        comment: 'nice'
    },
    {
        id: 3,
        date: new Date('2020-12-23'), 
        type: 'Run',
        distance: 4,
        comment: 'nice'
    },
    {
        id: 4,
        date: new Date('2020-02-02'), 
        type: 'Bike',
        distance: 35,
        comment: 'nice'
    },
    {
        id: 5,
        date: new Date('2020-03-04'), 
        type: 'Walk',
        distance: 1,
        comment: 'nice'
    },
    {
        id: 6,
        date: new Date('2019-01-03'), 
        type: 'Run',
        distance: 46,
        comment: 'nice'
    },
    {
        id: 7,
        date: new Date('2020-04-05'), 
        type: 'Run',
        distance: 5,
        comment: 'nice'
    },
    {
        id: 8,
        date: new Date('2017-02-02'), 
        type: 'Bike',
        distance: 35,
        comment: 'nice'
    },


]

router.get("/trainings", (req, res, next) => {
    res.send(initData);
});

router.delete("/trainings/:id", (req, res, next) => {
    const id = req.params.id;
    const indexToDelete = initData.findIndex((it) => parseInt(it.id) === parseInt(id));
    const deletedItem = initData.splice(indexToDelete, 1);
    res.send(deletedItem);
});

router.post("/addrow", (req, res, next) => {
    const data = req.body;
    initData.push(data);
    res.send(data);
});

router.put("/refreshdata", (req, res, next) => {
    const data = req.body;
    const idsToUpdate = data.map((item) => item.id);
    const newData = initData.map((item) => {
        if (idsToUpdate.includes(item.id)) {
            return data.find((it) => it.id === item.id);
        }
        return item
    });
    initData = newData;
    res.send(data);
});


module.exports = router;
