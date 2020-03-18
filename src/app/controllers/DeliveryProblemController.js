import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import User from '../models/User';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
    const userCheckAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!userCheckAdmin) {
      return res
        .status(401)
        .json({ error: 'Only administrators can list deliveries problems.' });
    }

    const deliveriesProblem = await DeliveryProblem.findAll();

    return res.json(deliveriesProblem);
  }

  async show(req, res) {
    const userCheckAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!userCheckAdmin) {
      return res
        .status(401)
        .json({ error: 'Only administrators can see a delivery problem.' });
    }

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: req.params.orderId },
    });

    if (deliveryProblems.length === 0) {
      return res
        .status(404)
        .json({ message: 'This order does not have delivery problems' });
    }

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findOne({
      where: { id: req.params.orderId, end_date: null, canceled_at: null },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: order.id,
      description: req.body.description,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
