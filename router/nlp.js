const router = require("express").Router();
// const { dockStart } = require('@nlpjs/basic');
const { dockStart } = require('@nlpjs/basic');
const data = require("./corpus.json");
const fs = require('fs');
const path = require('path');
const Corpus = require("./template");
const Intents = require("../model/intents");
const homedir = require('os').homedir();



router.post("/reply", async (req, res) => {
    const { text } = req.body;
    const response = await manager.process('en', text);
    res.json(response.answer);
})


router.get("/intents", async (req, res) => {
    const intents = await Intents.find({ project: "1034ad5" });
    let data = [];
    intents.map(i => {
        const file = require(i.url);
        const intentData = JSON.parse(JSON.stringify(file)).data;
        let stats = { intents: 0, question: 0, answers: 0 };
        stats.intents = intentData.length;

        intentData.map(d => {
            stats.question += d.utterances?.length;
            stats.answers += d.answers?.length;
        })
        data.push({ id: i._id, name: i.name, description: i.description, stats: stats })
    })
    res.json(data);
})

router.get("/intents/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id, req.params);
    const intent = await Intents.findById(`${id}`);
    const data = { id: intent._id, name: intent.name, description: intent.description };
    const file = fs.readFileSync(intent.url);
    const cData = JSON.parse(file).data;
    data.data = cData;

    res.json(data);
})


router.post("/intents", async (req, res) => {
    if (!fs.existsSync(`${homedir}/.corpuses`)) {
        fs.mkdir(path.join(homedir, '.corpuses'), (err) => {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
    const { name, description } = req.body;
    const newCorpus = new Corpus(name);
    const corpus = JSON.stringify(newCorpus);
    const filePath = `${homedir}/.corpuses/${name}.json`;
    fs.writeFile(filePath, corpus, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');

    });

    const intent = await new Intents({
        name,
        description,
        url: filePath,
        project: "1034ad5"
    })

    await intent.save();

    res.json(intent);
})


router.put("/intents/:id", async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    console.log(data, "hello", id)
    const intent = await Intents.findById(`${id}`);
    const file = fs.readFileSync(intent.url);
    const corpus = { ...JSON.parse(file) };
    console.log(intent, corpus)
    corpus.data = data;
    console.log(corpus.data[0].utterances, "new")
    fs.writeFile(intent.url, JSON.stringify(corpus), function (err) {
        if (err) throw err;
        console.log('File is updated successfully.');

    });

    res.json({ msg: `${intent.name} is updated successfully` })



})

router.put("/answers", async (req, res) => {

})

router.delete("/question", async (req, res) => {

})

router.delete("/answers", async (req, res) => {

})

router.post("/train/:id", async (req, res) => {
    const { id } = req.params;
    const intent = await Intents.findById(`${id}`);
    console.log(intent, `${__dirname}/${id}`);
    if (await fs.existsSync(`${path.resolve('./../')}/${id}`)) {

        console.log("already exists, removing")
        await fs.unlink(`${path.resolve('./../')}/${id}`, (err) => {
            console.log("deletd");
        })
    }

    const dock = await dockStart({ use: ['Basic'] });
    const nlp = dock.get('nlp');
    console.log(require(intent.url));
    await nlp.addCorpus(require(intent.url));
    await nlp.train();
    await nlp.save(id)
    delete dock;
    delete nlp;
    res.json("trained success fulyy")

})

router.post("/reply/:id", async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const dock = await dockStart({ use: ['Basic'] });
    const nlp = dock.get('nlp');
    nlp.load(id);
    const response = await nlp.process('en', message);
    console.log(response.answer)
    delete dock;
    delete nlp;
    res.json({ message: response?.answer, ...response, id })
})




module.exports = router;