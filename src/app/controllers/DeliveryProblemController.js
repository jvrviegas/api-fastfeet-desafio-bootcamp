import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import User from '../models/User';
import Order from '../models/Order';

import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const userCheckAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!userCheckAdmin) {
      return res
        .status(401)
        .json({ error: 'Only administrators can list deliverymans.' });
    }

    const deliveriesProblem = await DeliveryProblem.findAll();

    return res.json(deliveriesProblem);
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
