require('dotenv').config({ path: '.env' });

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');


const mongoose = require('mongoose');


chai.use(chaiHttp);




describe('Test', () => {





it('should POST a valid course', (done) => {
        
    
    let newCourse = {
        title : "zaevfa",
        description : "aveaev",
        fullDescription : "eafafz",
        picturePath : "aelnfae" ,
        courseCategory:"category",
    };
    chai.request(server)
    .post('/course/add')
    .send(newCourse)
    .end((err, res) => {
        res.should.have.status(201);
        
        done();

    });

});

});