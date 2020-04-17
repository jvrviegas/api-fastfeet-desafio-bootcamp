import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import OpenOrdersController from './app/controllers/OpenOrdersController';
import DeliveredOrdersController from './app/controllers/DeliveredOrdersController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import EndDeliveryController from './app/controllers/EndDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();
const upload = multer(multerConfig);

// Users
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Deliverymans
routes.get('/deliverymans/:id', DeliverymanController.show);
routes.get('/deliveryman/:id/deliveries', OpenOrdersController.index);
routes.get('/deliveryman/:id/delivered', DeliveredOrdersController.index);
routes.put(
  '/deliveryman/:deliverymanId/start_delivery/:orderId',
  StartDeliveryController.update
);
routes.put(
  '/deliveryman/:deliverymanId/end_delivery/:orderId',
  upload.single('file'),
  EndDeliveryController.update
);
routes.post('/files', upload.single('file'), FileController.store);

// Delivery Problems
routes.get('/delivery/:orderId/problems', DeliveryProblemController.show);
routes.post('/delivery/:orderId/problems', DeliveryProblemController.store);
routes.put('/delivery/:orderId/problems', DeliveryProblemController.update);

// Middleware to verify authentication
routes.use(authMiddleware);

// Authenticated Users
routes.put('/users', UserController.update);

// Middleware to verify if user is admin
routes.use(adminMiddleware);

// Deliveryman Management
routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

// Recipients Management
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

// Packages Management
routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

// Deliveries Problems
routes.get('/deliveries/problems', DeliveryProblemController.index);
routes.delete('/problem/:id/cancel-delivery', CancelDeliveryController.create);

export default routes;
