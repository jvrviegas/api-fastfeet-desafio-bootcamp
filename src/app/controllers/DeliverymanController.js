import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import User from '../models/User';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { filter = '' } = req.query;

    const deliverymans = await Deliveryman.findAll({
      where: {
        name: {
          [Op.iLike]: `%${filter}%`,
        },
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: ['id'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['id', 'path', 'url'],
      },
    });

    return res.json(deliverymans);
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findOne({
      where: { id: req.params.id },
      include: {
        model: File,
        as: 'avatar',
        attributes: ['id', 'path', 'url'],
      },
    });

    if (!deliveryman) {
      return res.status(404).json({ erorr: 'Deliveryman not found' });
    }

    return res.json(deliveryman);
  }

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

  async delete(req, res) {
    const userCheckAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!userCheckAdmin) {
      return res
        .status(401)
        .json({ error: 'Only administrators can list deliverymans.' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    if (!(await deliveryman.destroy())) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ message: 'Deliveryman deleted successfully' });
  }
}

export default new DeliverymanController();
