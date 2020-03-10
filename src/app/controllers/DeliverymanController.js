import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import User from '../models/User';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userCheckAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!userCheckAdmin) {
      return res
        .status(401)
        .json({ error: 'Only administrators can register deliverymans.' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const checkDeliverymanAdmin = await User.findOne({
      where: { email: req.body.email, admin: true },
    });

    if (checkDeliverymanAdmin) {
      return res
        .status(401)
        .json({ error: 'Administrators cannot be deliverymans' });
    }

    const { name, email } = await Deliveryman.create(req.body);

    return res.json({
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userCheckAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!userCheckAdmin) {
      return res
        .status(401)
        .json({ error: 'Only administrators can update deliverymans.' });
    }

    const { email } = req.body;

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman already exists' });
      }
    }

    const checkDeliverymanAdmin = await User.findOne({
      where: { email: req.body.email, admin: true },
    });

    if (checkDeliverymanAdmin) {
      return res
        .status(401)
        .json({ error: 'Administrators cannot be deliverymans' });
    }

    const { id, name } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new DeliverymanController();
