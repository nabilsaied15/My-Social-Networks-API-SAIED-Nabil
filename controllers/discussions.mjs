import Discussion from '../models/Discussion.mjs';
import Group from '../models/Group.mjs';
import Event from '../models/Event.mjs';
import User from '../models/User.mjs';

const Discussions = {
  async create(req, res) {
    try {
      const { title, description, group, event } = req.body;

      if (!title) {
        return res.status(400).json({
          message: 'Le titre est obligatoire.',
        });
      }

      const discussion = new Discussion({
        title,
        description,
        group,
        event,
      });

      await discussion.save();

      return res.status(201).json({
        message: 'Discussion créée avec succès.',
        discussion,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la création.',
      });
    }
  },
  async getAll(req, res) {
    try {
      const discussions = await Discussion.find()
        .populate('group')
        .populate('event')
        .populate('messages.author')
        .populate('messages.comments.author');

      return res.status(200).json({
        count: discussions.length,
        discussions,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la récupération.',
      });
    }
  },
  async getById(req, res) {
    try {
      const discussion = await Discussion.findById(req.params.id)
        .populate('group')
        .populate('event')
        .populate('messages.author')
        .populate('messages.comments.author');

      if (!discussion) {
        return res.status(404).json({
          message: 'Discussion introuvable.',
        });
      }

      return res.status(200).json(discussion);
    } catch (error) {
      return res.status(400).json({
        message: 'Identifiant invalide.',
      });
    }
  },
  async update(req, res) {
    try {
      const discussion = await Discussion.findById(req.params.id);

      if (!discussion) {
        return res.status(404).json({
          message: 'Discussion introuvable.',
        });
      }

      ['title', 'description', 'group', 'event'].forEach((field) => {
        if (req.body[field] !== undefined) {
          discussion[field] = req.body[field];
        }
      });

      await discussion.save();

      return res.status(200).json({
        message: 'Discussion modifiée avec succès.',
        discussion,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification.',
      });
    }
  },
  async delete(req, res) {
    try {
      const discussion = await Discussion.findByIdAndDelete(req.params.id);

      if (!discussion) {
        return res.status(404).json({
          message: 'Discussion introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Discussion supprimée avec succès.',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression.',
      });
    }
  },
  async addMessage(req, res) {
    try {
      const { content, author } = req.body;

      if (!content || !author) {
        return res.status(400).json({
          message: 'Le contenu et l’auteur sont obligatoires.',
        });
      }

      const discussion = await Discussion.findById(req.params.id);

      if (!discussion) {
        return res.status(404).json({
          message: 'Discussion introuvable.',
        });
      }

      const user = await User.findById(author);

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur introuvable.',
        });
      }

      let authorized = false;

      if (discussion.group) {
        const group = await Group.findById(discussion.group);

        authorized = group && (
          group.members.some((id) => id.toString() === author)
          || group.admins.some((id) => id.toString() === author)
        );
      }

      if (discussion.event) {
        const event = await Event.findById(discussion.event);

        authorized = event && (
          event.participants.some((id) => id.toString() === author)
          || event.organizers.some((id) => id.toString() === author)
        );
      }

      if (!authorized) {
        return res.status(403).json({
          message: 'Utilisateur non autorisé.',
        });
      }

      discussion.messages.push({ content, author });
      await discussion.save();

      return res.status(201).json({
        message: 'Message ajouté avec succès.',
        discussion,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l’ajout du message.',
      });
    }
  },
  async addComment(req, res) {
    try {
      const { content, author } = req.body;

      if (!content || !author) {
        return res.status(400).json({
          message: 'Le contenu et l’auteur sont obligatoires.',
        });
      }

      const discussion = await Discussion.findById(req.params.id);

      if (!discussion) {
        return res.status(404).json({
          message: 'Discussion introuvable.',
        });
      }

      const message = discussion.messages.id(req.params.messageId);

      if (!message) {
        return res.status(404).json({
          message: 'Message introuvable.',
        });
      }

      const user = await User.findById(author);

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur introuvable.',
        });
      }

      let authorized = false;

      if (discussion.group) {
        const group = await Group.findById(discussion.group);

        authorized = group && group.members.some(
          (id) => id.toString() === author
        );
      }

      if (discussion.event) {
        const event = await Event.findById(discussion.event);

        authorized = event && event.participants.some(
          (id) => id.toString() === author
        );
      }

      if (!authorized) {
        return res.status(403).json({
          message: 'Utilisateur non autorisé à commenter.',
        });
      }

      message.comments.push({ content, author });
      await discussion.save();

      return res.status(201).json({
        message: 'Commentaire ajouté avec succès.',
        discussion,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l’ajout du commentaire.',
      });
    }
  },

};

export default Discussions;
