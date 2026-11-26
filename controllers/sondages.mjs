import Sondage from '../models/Sondage.mjs';
import Event from '../models/Event.mjs';
const Sondages = {

  async create(req, res) {
    try {
      const { title, event, creator, questions } = req.body;

      if (!title || !event || !creator || !questions || questions.length < 1) {
        return res.status(400).json({
          message: 'Informations du sondage incomplètes.',
        });
      }

      const evenement = await Event.findById(event);

      if (!evenement) {
        return res.status(404).json({
          message: 'Événement introuvable.',
        });
      }

      if (!evenement.organizers.some((id) => id.toString() === creator)) {
        return res.status(403).json({
          message: 'Seul un organisateur peut créer un sondage.',
        });
      }

      const sondage = await Sondage.create(req.body);

      return res.status(201).json({
        message: 'Sondage créé avec succès.',
        sondage,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la création du sondage.',
      });
    }
  },

  async getAll(req, res) {
    try {
      const sondages = await Sondage.find()
        .populate('event')
        .populate('creator')
        .populate('votes.participant');

      return res.status(200).json(sondages);
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la récupération des sondages.',
      });
    }
  },

  async getById(req, res) {
    try {
      const sondage = await Sondage.findById(req.params.id)
        .populate('event')
        .populate('creator')
        .populate('votes.participant');

      if (!sondage) {
        return res.status(404).json({
          message: 'Sondage introuvable.',
        });
      }

      return res.status(200).json(sondage);
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la récupération du sondage.',
      });
    }
  },

  async update(req, res) {
    try {
      const sondage = await Sondage.findById(req.params.id);

      if (!sondage) {
        return res.status(404).json({
          message: 'Sondage introuvable.',
        });
      }

      if (req.body.title !== undefined) {
        sondage.title = req.body.title;
      }

      if (req.body.questions !== undefined) {
        sondage.questions = req.body.questions;
      }

      await sondage.save();

      return res.status(200).json({
        message: 'Sondage modifié avec succès.',
        sondage,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification du sondage.',
      });
    }
  },

  async delete(req, res) {
    try {
      const sondage = await Sondage.findByIdAndDelete(req.params.id);

      if (!sondage) {
        return res.status(404).json({
          message: 'Sondage introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Sondage supprimé avec succès.',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression du sondage.',
      });
    }
  },

  async vote(req, res) {
    try {
      const { participant, question, reponse } = req.body;

      const sondage = await Sondage.findById(req.params.id);
      if (!sondage) {
        return res.status(404).json({
          message: 'Sondage introuvable.',
        });
      }

      const evenement = await Event.findById(sondage.event);

      if (!evenement.participants.some((id) => id.toString() === participant)) {
        return res.status(403).json({
          message: 'Seul un participant peut voter.',
        });
      }

      const questionTrouvee = sondage.questions.id(question);

      if (!questionTrouvee) {
        return res.status(404).json({
          message: 'Question introuvable.',
        });
      }

      const reponseTrouvee = questionTrouvee.reponses.id(reponse);

      if (!reponseTrouvee) {
        return res.status(400).json({
          message: 'Cette réponse ne correspond pas à la question.',
        });
      }

      const voteExistant = sondage.votes.find(
        (vote) => vote.participant.toString() === participant
          && vote.question.toString() === question,
      );

      if (voteExistant) {
        return res.status(409).json({
          message: 'Vous avez déjà répondu à cette question.',
        });
      }

      sondage.votes.push({
        participant,
        question,
        reponse,
      });

      await sondage.save();

      return res.status(201).json({
        message: 'Vote enregistré avec succès.',
        sondage,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l’enregistrement du vote.',
      });
    }
  },
};
export default Sondages;
