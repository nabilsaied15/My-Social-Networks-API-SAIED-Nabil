import Billetterie from '../models/Billetterie.mjs';
import Event from '../models/Event.mjs';

const BilletterieController = {

  async create(req, res) {
    try {
      const { event, creator, typesBillets } = req.body;

      if (!event || !creator || !typesBillets || typesBillets.length < 1) {
        return res.status(400).json({
          message: 'Informations de la billetterie incomplètes.',
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
          message: 'Seul un organisateur peut créer une billetterie.',
        });
      }

      const billetterieExistante = await Billetterie.findOne({ event });

      if (billetterieExistante) {
        return res.status(409).json({
          message: 'Cet événement possède déjà une billetterie.',
        });
      }

      const billetterie = await Billetterie.create({
        event,
        typesBillets,
      });

      return res.status(201).json({
        message: 'Billetterie créée avec succès.',
        billetterie,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la création de la billetterie.',
      });
    }
  },

  async getAll(req, res) {
    try {
      const billetteries = await Billetterie.find().populate('event');

      return res.status(200).json(billetteries);
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la récupération des billetteries.',
      });
    }
  },

  async getById(req, res) {
    try {
      const billetterie = await Billetterie.findById(req.params.id)
        .populate('event');

      if (!billetterie) {
        return res.status(404).json({
          message: 'Billetterie introuvable.',
        });
      }

      return res.status(200).json(billetterie);
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la récupération de la billetterie.',
      });
    }
  },

  async update(req, res) {
    try {
      const billetterie = await Billetterie.findById(req.params.id);

      if (!billetterie) {
        return res.status(404).json({
          message: 'Billetterie introuvable.',
        });
      }

      if (req.body.typesBillets !== undefined) {
        billetterie.typesBillets = req.body.typesBillets;
      }

      await billetterie.save();

      return res.status(200).json({
        message: 'Billetterie modifiée avec succès.',
        billetterie,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification de la billetterie.',
      });
    }
  },

  async delete(req, res) {
    try {
      const billetterie = await Billetterie.findByIdAndDelete(req.params.id);

      if (!billetterie) {
        return res.status(404).json({
          message: 'Billetterie introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Billetterie supprimée avec succès.',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression de la billetterie.',
      });
    }
  },

  async acheterBillet(req, res) {
    try {
      const { typeBillet, nom, prenom, adresse } = req.body;

      if (!typeBillet || !nom || !prenom || !adresse) {
        return res.status(400).json({
          message: 'Informations de l’acheteur incomplètes.',
        });
      }

      const billetterie = await Billetterie.findById(req.params.id);

      if (!billetterie) {
        return res.status(404).json({
          message: 'Billetterie introuvable.',
        });
      }

      const type = billetterie.typesBillets.id(typeBillet);

      if (!type) {
        return res.status(404).json({
          message: 'Type de billet introuvable.',
        });
      }

      const billetExistant = billetterie.billetsAchetes.find(
        (billet) => billet.nom.toLowerCase() === nom.trim().toLowerCase()
          && billet.prenom.toLowerCase() === prenom.trim().toLowerCase()
          && billet.adresse.toLowerCase() === adresse.trim().toLowerCase(),
      );

      if (billetExistant) {
        return res.status(409).json({
          message: 'Cette personne possède déjà un billet.',
        });
      }

      const billetsVendus = billetterie.billetsAchetes.filter(
        (billet) => billet.typeBillet.toString() === typeBillet,
      ).length;

      if (billetsVendus >= type.quantite) {
        return res.status(400).json({
          message: 'La quantité de billets disponibles est épuisée.',
        });
      }

      billetterie.billetsAchetes.push({
        typeBillet,
        nom,
        prenom,
        adresse,
      });

      await billetterie.save();

      return res.status(201).json({
        message: 'Billet acheté avec succès.',
        billetterie,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l’achat du billet.',
      });
    }
  },
};

export default BilletterieController;
