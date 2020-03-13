import * as Yup from 'yup';
import Package from '../models/Package';

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

    const pack = await Package.create(req.body);

    if (!pack) {
      return res.status(500).json({
        error: 'Fail to create the package, try again in a few seconds',
      });
    }

    return res.status(201).json(pack);
  }
}

export default new PackageController();
