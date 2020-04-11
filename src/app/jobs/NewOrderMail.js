import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { deliveryman, order } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova encomenda',
      template: 'newPackage',
      context: {
        deliveryman: deliveryman.name,
        product: order.product,
      },
    });
  }
}

export default new NewOrderMail();
