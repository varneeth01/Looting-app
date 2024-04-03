import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import SubscriptionPlan from '../../../models/SubscriptionPlan';
import { createSubscription } from '../../../utils/payments';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();

      const { userId, subscriptionPlanId } = req.body;

      // Find the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the subscription plan
      const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);

      if (!subscriptionPlan) {
        return res.status(404).json({ error: 'Subscription plan not found' });
      }

      // Create a Stripe checkout session
      const sessionId = await createSubscription(user.id, subscriptionPlan.stripeProductId);

      return res.status(200).json({ sessionId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
