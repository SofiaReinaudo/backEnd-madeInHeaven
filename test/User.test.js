import { expect } from "chai";
import supertest from 'supertest';
import { logger } from "../src/utils/logger.js";

const request = supertest('http://http://localhost:8080');

describe('Testing Users', () => {
    // testing login
    describe('Test Post Login', async () => {
        const user = {
            email: 'sofiareinaudo22@gmail.com',
            password:'123456'
        };
        const {statusCode, ok, body } = (await request.post('/api/auth/login')).setEncoding(user);

        logger.info(statusCode);
        logger.info(ok);
        logger.info(JSON.stringify(body));
    });

    // testing registro
    describe('RegisterTest', async()=>{
        const user = {
            name:'',
            lastName:'',
            email:'',
            password:'',
        };
        
        const {statusCode, ok, body} = await request.post('/api/auth/register').send(user);
        logger.info(statusCode)
        logger.info(ok)
        logger.info(JSON.stringify(body))
    });

    describe('Testing Users Dao', () => {

        before(function (done) {
            mongoose.connection.collections.users.drop()
    
            this.timeout(5000)
            done()
        })
    
        after(function (done) {
            mongoose.connection.collections.users.drop()
    
            logger.info('Done!!')
            done()
        })
    
        describe('Users', () => {
    
            it('El dao debe poder obtener los usuarios', async () => {
                const usersDao = new UserDAO()
                const result = await usersDao.get({})
    
                logger.info({ result })
    
                assert.strictEqual(Array.isArray(result), true)
    
                expect(Array.isArray(result)).to.be.equal(true)
                expect(result).to.be.deep.eq([])
            })
    
            it('El dao debe poder crear usuarios', async () => {
                let mockUser = {
                    first_name: 'Matias',
                    last_name: 'Silva',
                    email: 'matiassilva@gmail.com',
                    password: 'secret'
                }
    
                const usersDao = new UserDAO()
                const result = await usersDao.save(mockUser)
    
                assert.deepStrictEqual(result.pets, [])
    
                expect(result.pets).to.be.deep.equal([])
            })
    
            it('El dao debe poder buscar por email', async () => {
                let mockUser = {
                    first_name: 'Yanina',
                    last_name: 'Molina',
                    email: 'yanimolina@gmail.com',
                    password: '123456'
                }
    
                const usersDao = new UserDAO()
                const result = await usersDao.save(mockUser)
    
                const user = await usersDao.getBy({ email: 'yanimolina@gmail.com' })
    
                assert.strictEqual(typeof (user), 'object')
                assert.strictEqual(user.first_name, 'Yanina')
    
                expect(typeof (user)).to.be.eq('object')
                expect(user.first_name).to.be.eq('Yanina')
            })
        })
    })
});