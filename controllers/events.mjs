
import Event from '../models/Event.mjs';

const Events = {
    async create(req, res) {
    try {
      const {
        title,
        description,
        date,
        location,
        organizers,
        participants,
      } = req.body;

      if (!title || !date || !location) {
        return res.status(400).json({
          message: 'Le titre, la date et le lieu sont obligatoires.',
        });
      }

      const event = new Event({
        title,
        description,
        date,
        location,
        organizers,
        participants,
      });

      await event.save();

      return res.status(201).json({
        message: 'Événement créé avec succès.',
        event,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la création de l’événement.',
      });
    }
  },
  async getAll(req, res) {
    try {
      const events = await Event.find()
        .populate('organizers', 'firstName lastName email')
        .populate('participants', 'firstName lastName email');

      return res.status(200).json({
        count: events.length,
        events,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la récupération des événements.',
      });
    }
  },

  async getById(req, res) {
    try {
      const event = await Event.findById(req.params.id)
        .populate('organizers', 'firstName lastName email')
        .populate('participants', 'firstName lastName email');

      if (!event) {
        return res.status(404).json({
          message: 'Événement introuvable.',
        });
      }

      return res.status(200).json(event);

    } catch (error) {
      return res.status(400).json({
        message: 'Identifiant événement invalide.',
      });
    }
  },

  async update(req, res) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          message: 'Événement introuvable.',
        });
      }

      const allowedFields = [
        'title',
        'description',
        'date',
        'location',
        'organizers',
        'participants',
        'shoppingListEnabled',
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          event[field] = req.body[field];
        }
      });

      await event.save();

      return res.status(200).json({
        message: 'Événement modifié avec succès.',
        event,
      });

    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification de l’événement.',
      });
    }
  },

  async delete(req, res) {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);

      if (!event) {
        return res.status(404).json({
          message: 'Événement introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Événement supprimé avec succès.',
      });

    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression de l’événement.',
      });
    }
  },

};

export default Events;
