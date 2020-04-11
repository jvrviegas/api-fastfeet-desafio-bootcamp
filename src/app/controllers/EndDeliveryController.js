import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class EndDeliveryController {
  async update(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const order = await Order.findOne({
      where: { id: req.params.orderId, end_date: null, canceled_at: null },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.start_date === null) {
      return res
        .status(406)
        .json({ error: 'You cannot end an order without withdraw first' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Please upload the signature file' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    await order.update({
      end_date: new Date(),
      signature_id: file.id,
    });

    return res.json(order);
  }
}

export default new EndDeliveryController();
