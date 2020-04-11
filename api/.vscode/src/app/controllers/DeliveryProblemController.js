import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
    const deliveriesProblems = await DeliveryProblem.findAll({
      order: ['id'],
      include: {
        model: Order,
        as: 'order',
        attributes: ['id'],
      },
    });

    return res.json(deliveriesProblems);
  }

  async show(req, res) {
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

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery_problem = await DeliveryProblem.findByPk(req.params.id);

    await delivery_problem.update(req.body);

    return res.json(delivery_problem);
  }

  async delete(req, res) {
    const delivery_problem = await DeliveryProblem.findByPk(req.params.id);

    if (!delivery_problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (!(await delivery_problem.destroy())) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ message: 'Problem deleted successfully' });
  }
}

export default new DeliveryProblemController();
