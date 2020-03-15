import * as Yup from 'yup';
import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import Mail from '../../lib/Mail';

class PackageController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!(await Recipient.findByPk(req.body.recipient_id))) {
      return res.status(400).json({ error: 'Unable to find recipient' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Unable to find deliveryman' });
    }

    const pack = await Package.create(req.body);

    if (!pack) {
      return res.status(500).json({
        error: 'Fail to create the package, try again in a few seconds',
      });
    }

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova encomenda',
      text: 'Você possui uma nova encomenda para entrega',
    });

    return res.status(201).json(pack);
  }
}

export default new PackageController();
