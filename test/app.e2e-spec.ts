import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

// mở prisma studio on 'TEST' Db
// npx dotenv -e .env.test -- prisma studio
// mở prisma studio on 'DEV'
// npx dotenv -e .env -- prisma studio
const PORT = 3003;
describe('App EndToEnd tests', () => {
  let app: INestApplication;
  let prismaServices: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaServices = app.get(PrismaService);
    await prismaServices.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  //START TEST
  describe('Test Authencation', () => {
    // test register
    describe('Register', () => {
      it('email invalid', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: 'test@gmail', password: '123456789' })
          .expectStatus(400);
      });

      it('password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: 'test@gmail', password: '' })
          .expectStatus(400);
      });

      it('Should Register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: 'test@gmail.com', password: '123456789' })
          .expectStatus(201);
        // .inspect();
      });
    });

    //test login
    describe('Login', () => {
      it('Should Login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: 'test@gmail.com', password: '123456789' })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });
    });
  });

  //TEST USER
  describe('User', () => {
    describe('Get Detail User', () => {
      it('should get detail user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });
  });

  //TEST NOTE
  describe('Test Note', () => {
    // insert note
    describe('insert note', () => {
      // it('should get detail user', () => {
      //   return pactum.spec().post('/note/').expectStatus(200);
      // });
    });
    // get all note
    describe('get all note', () => {
      // it('should get detail user', () => {
      //   return pactum.spec().post('/note').expectStatus(200);
      // });
    });
    // get note by id
    describe('get all note', () => {
      // it('should get detail user', () => {
      //   return pactum.spec().post('/note').expectStatus(200);
      // });
    });
    // delete note
    describe('Delete note', () => {
      // it('should get detail user', () => {
      //   return pactum.spec().post('/note').expectStatus(200);
      // });
    });
  });

  //END TEST
  afterAll(async () => {
    app.close();
  });

  it.todo('should Pass ');
});
