import { isBefore, isAfter, getHours } from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class StartDeliveryController {
  async update(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const order = await Order.findOne({
      where: { id: req.params.orderId, canceled_at: null },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.start_date !== null) {
      return res
        .status(406)
        .json({ error: 'You cannot withdraw 2 times the same order' });
    }

    const date = new Date();
    const hours = getHours(date);

    if (isBefore(hours, 8) || isAfter(hours, 18)) {
      return res
        .status(406)
        .json({ error: 'Withdraw time is between 8:00 and 18:00' });
    }

    const countDeliveries = await Order.findAll({
      where: {
        deliveryman_id: deliveryman.id,
        start_date: {
          [Op.ne]: null,
        },
      },
    });

    if (countDeliveries.length > 5) {
      return res
        .status(406)
        .json({ error: 'You can make only 5 withdrawals a day' });
    }

    order.start_date = new Date();
    await order.save();

    return res.json(order);
  }
}

export default new StartDeliveryController();
