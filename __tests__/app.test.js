require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    const favorite = 
      {
        title:'pulp fiction',
        year:1994,
        overview:'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.',
        poster: 'http://www.placekitten.com/300/300',
        rating:85,
        movie_db_id:680
      };
    const dbFavorite = {
      ...favorite,
      owner_id:2,
      id: 4
    };
    
    test('creates a favorite', async() => {
    
      const data = await fakeRequest(app)
        .post('/api/favorites')
        .send(favorite)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(dbFavorite);
    });

    test('gets favorites', async() => {
    
      const data = await fakeRequest(app)
        .get('/api/favorites')
        
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(dbFavorite);
    });

    test('deletes a favorite', async() => {
    
      const data = await fakeRequest(app)
        .delete('/api/favorites/4')
        
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(dbFavorite);
    });

    // test('returns animals', async() => {

    //   const expectation = [
    //     {
    //       'id': 1,
    //       'name': 'bessie',
    //       'coolfactor': 3,
    //       'owner_id': 1
    //     },
    //     {
    //       'id': 2,
    //       'name': 'jumpy',
    //       'coolfactor': 4,
    //       'owner_id': 1
    //     },
    //     {
    //       'id': 3,
    //       'name': 'spot',
    //       'coolfactor': 10,
    //       'owner_id': 1
    //     }
    //   ];

    //   const data = await fakeRequest(app)
    //     .get('/animals')
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });
  });
});
