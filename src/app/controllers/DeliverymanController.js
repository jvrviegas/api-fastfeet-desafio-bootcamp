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

    const { name, email } = await Deliveryman.create(req.body);

    return res.json({
      name,
      email,
    });
  }
}

export default new DeliverymanController();
