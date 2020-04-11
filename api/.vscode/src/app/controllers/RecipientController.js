import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { filter = '' } = req.query;

    const recipients = await Recipient.findAll({
      where: {
        name: {
          [Op.iLike]: `%${filter}%`,
        },
      },
      order: ['id'],
    });

    res.status(200).json(recipients);
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street_name: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      town: Yup.string().required(),
      postal_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists!' });
    }

    const {
      id,
      name,
      street_name,
      number,
      complement,
      state,
      town,
      postal_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street_name,
      number,
      complement,
      state,
      town,
      postal_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street_name: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      town: Yup.string(),
      postal_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    const {
      id,
      name,
      street_name,
      number,
      complement,
      state,
      town,
      postal_code,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street_name,
      number,
      complement,
      state,
      town,
      postal_code,
    });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    if (!(await recipient.destroy())) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ message: 'Recipient deleted successfully' });
  }
}

export default new RecipientController();
