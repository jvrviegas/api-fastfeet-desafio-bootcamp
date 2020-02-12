import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(6),
      street_name: Yup.string()
        .required()
        .min(6),
      number: Yup.number().required(),
      complement: Yup.string()
        .required()
        .min(6),
      state: Yup.string()
        .required()
        .min(2),
      town: Yup.string()
        .required()
        .min(6),
      postal_code: Yup.number()
        .required()
        .min(7),
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
}

export default new RecipientController();
