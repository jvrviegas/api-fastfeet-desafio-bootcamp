import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class OpenOrdersController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    const openOrders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
      attributes: [
        'id',
        'deliveryman_id',
        'recipient_id',
        'created_at',
        'start_date',
        'end_date',
        'signature_id',
      ],
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!openOrders) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json(openOrders);
  }
}

export default new OpenOrdersController();
