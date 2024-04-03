import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import Card from '../../../models/Card';
import CollectedCard from '../../../models/CollectedCard';
import ParticipatedEvent from '../../../models/ParticipatedEvent';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();

      const { userId, cardId, eventId } = req.body;

      // Find the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the card
      const card = await Card.findById(cardId);

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      // Check if the user has already collected the card
      const collectedCard = await CollectedCard.findOne({ user: userId, card: cardId });

      if (collectedCard) {
        return res.status(400).json({ error: 'Card already collected' });
      }

      // Create a new collected card document
      const newCollectedCard = new CollectedCard({ user: userId, card: cardId });
      await newCollectedCard.save();

      // Update the user's wallet assets based on the card's values
      user.walletAssets.pinkCash += card.pinkCashValue;
      user.walletAssets.greenCash += card.greenCashValue;
      user.walletAssets.goldCoins += card.goldCoinValue;
      user.walletAssets.silverCoins += card.silverCoinValue;
      await user.save();

      // If an event ID is provided, handle event participation
      if (eventId) {
        const event = await Event.findById(eventId);

        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the user has already participated in the event
        const participatedEvent = await ParticipatedEvent.findOne({ user: userId, event: eventId });

        if (participatedEvent) {
          return res.status(400).json({ error: 'User has already participated in the event' });
        }

        // Deduct the entry fee from the user's wallet assets
        const entryFee = event.entryFee;
        user.walletAssets.pinkCash -= entryFee.pinkCash;
        user.walletAssets.greenCash -= entryFee.greenCash;
        user.walletAssets.goldCoins -= entryFee.goldCoins;
        user.walletAssets.silverCoins -= entryFee.silverCoins;
        await user.save();

        // Create a new participated event document
        const newParticipatedEvent = new ParticipatedEvent({ user: userId, event: eventId });
        await newParticipatedEvent.save();

        // Add the user to the event's participants list
        event.participants.push(userId);
        await event.save();
      }

      return res.status(200).json({ message: 'Card collected successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
