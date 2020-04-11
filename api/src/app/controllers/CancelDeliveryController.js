import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import CancelDeliveryMail from '../jobs/CancelDeliveryMail';
import Queue from '../../lib/Queue';

class CancelDeliveryController {
  async update(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(req.params.id);

    if (!deliveryProblem) {
      return res.status(404).json({ error: 'Delivery problem not found' });
    }

    const order = await Order.findOne({
      where: { id: deliveryProblem.delivery_id },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.canceled_at !== null) {
      return res.status(406).json({ error: 'Order already canceled' });
    }

    await order.update({
      canceled_at: new Date(),
    });

    await Queue.add(CancelDeliveryMail.key, {
      order,
    });

    return res.json({ message: 'Delivery canceled successfully' });
  }
}

export default new CancelDeliveryController();
