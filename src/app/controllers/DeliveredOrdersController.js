import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveredOrdersController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    const deliveredOrders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: [
        'id',
        'deliveryman_id',
        'recipient_id',
        'created_at',
        'canceled_at',
        'start_date',
        'end_date',
        'signature_id',
      ],
      order: [['created_at', 'desc']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!deliveredOrders) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json(deliveredOrders);
  }
}

export default new DeliveredOrdersController();
