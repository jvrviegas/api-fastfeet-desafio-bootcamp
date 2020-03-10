import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Users
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Authenticated Users
routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);

// Deliveryman Management
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
