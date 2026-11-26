import ShoppingList from '../models/ShoppingList.mjs';
import Event from '../models/Event.mjs';
import User from '../models/User.mjs';
const ShoppingListController = {

  async create(req, res) {
    try {
      const { event, user, nom, quantite, heureArrivee } = req.body;

      if (!event || !user || !nom || !quantite || !heureArrivee) {
        return res.status(400).json({
          message: 'Informations incomplètes.',
        });
      }

      const evenement = await Event.findById(event);

      if (!evenement) {
        return res.status(404).json({
          message: 'Événement introuvable.',
        });
      }

      if (!evenement.shoppingListEnabled) {
        return res.status(400).json({
          message: 'La Shopping List n’est pas activée pour cet événement.',
        });
      }

      const utilisateur = await User.findById(user);

      if (!utilisateur) {
        return res.status(404).json({
          message: 'Utilisateur introuvable.',
        });
      }

      const elementExistant = await ShoppingList.findOne({
        event,
        nom: nom.trim(),
      });

      if (elementExistant) {
        return res.status(409).json({
          message: 'Cet élément existe déjà pour cet événement.',
        });
      }

      const element = await ShoppingList.create({
        event,
        user,
        nom,
        quantite,
        heureArrivee,
      });

      return res.status(201).json({
        message: 'Élément ajouté à la Shopping List.',
        element,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l’ajout de l’élément.',
      });
    }
  },

  async getAll(req, res) {
    try {
      const elements = await ShoppingList.find()
        .populate('event')
        .populate('user');

      return res.status(200).json(elements);
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la récupération de la Shopping List.',
      });
    }
  },
  async getById(req, res) {
    try {
      const element = await ShoppingList.findById(req.params.id)
        .populate('event')
        .populate('user');

      if (!element) {
        return res.status(404).json({
          message: 'Élément introuvable.',
        });
      }

      return res.status(200).json(element);
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la récupération de l’élément.',
      });
    }
  },
  async update(req, res) {
    try {
      const element = await ShoppingList.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );

      if (!element) {
        return res.status(404).json({
          message: 'Élément introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Élément modifié avec succès.',
        element,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification.',
      });
    }
  },
  async delete(req, res) {
    try {
      const element = await ShoppingList.findByIdAndDelete(req.params.id);

      if (!element) {
        return res.status(404).json({
          message: 'Élément introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Élément supprimé avec succès.',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression.',
      });
    }
  },
};
export default ShoppingListController;
