import Group from '../models/Group.mjs';
const Groups = {

  async create(req, res) {
    try {
      const {
        name,
        description,
        admins,
        members,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          message: 'Le nom du groupe est obligatoire.',
        });
      }

      const group = new Group({
        name,
        description,
        admins,
        members,
      });

      await group.save();

      return res.status(201).json({
        message: 'Groupe créé avec succès.',
        group,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la création du groupe.',
      });
    }
  },

  async getAll(req, res) {
    try {
      const groups = await Group.find()
        .populate('admins', 'firstName lastName email')
        .populate('members', 'firstName lastName email');

      return res.status(200).json({
        count: groups.length,
        groups,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la récupération des groupes.',
      });
    }
  },

  async getById(req, res) {
    try {
      const group = await Group.findById(req.params.id)
        .populate('admins', 'firstName lastName email')
        .populate('members', 'firstName lastName email');

      if (!group) {
        return res.status(404).json({
          message: 'Groupe introuvable.',
        });
      }

      return res.status(200).json(group);

    } catch (error) {
      return res.status(400).json({
        message: 'Identifiant du groupe invalide.',
      });
    }
  },

  async update(req, res) {
    try {
      const group = await Group.findById(req.params.id);

      if (!group) {
        return res.status(404).json({
          message: 'Groupe introuvable.',
        });
      }

      const allowedFields = [
        'name',
        'description',
        'admins',
        'members',
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          group[field] = req.body[field];
        }
      });

      await group.save();

      return res.status(200).json({
        message: 'Groupe modifié avec succès.',
        group,
      });

    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification du groupe.',
      });
    }
  },

  async delete(req, res) {
    try {
      const group = await Group.findByIdAndDelete(req.params.id);

      if (!group) {
        return res.status(404).json({
          message: 'Groupe introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Groupe supprimé avec succès.',
      });

    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression du groupe.',
      });
    }
  },

};

export default Groups;
