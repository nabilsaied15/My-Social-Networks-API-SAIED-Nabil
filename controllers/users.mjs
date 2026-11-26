
import User from '../models/User.mjs';

const Users = {

  async create(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        profilePicture,
      } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          message: 'Tous les champs obligatoires doivent être renseignés.',
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: 'Cette adresse email est déjà utilisée.',
        });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        profilePicture,
      });

      await user.save();

      const userData = user.toObject();
      delete userData.password;

      return res.status(201).json({
        message: 'Utilisateur créé avec succès.',
        user: userData,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la création de l’utilisateur.',
      });
    }
  },

  async getAll(req, res) {
    try {
      const users = await User.find();

      return res.status(200).json({
        count: users.length,
        users,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la récupération des utilisateurs.',
      });
    }
  },

  async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur introuvable.',
        });
      }

      return res.status(200).json(user);

    } catch (error) {
      return res.status(400).json({
        message: 'Identifiant utilisateur invalide.',
      });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur introuvable.',
        });
      }

      const allowedFields = [
        'firstName',
        'lastName',
        'email',
        'password',
        'profilePicture',
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      await user.save();

      const userData = user.toObject();
      delete userData.password;

      return res.status(200).json({
        message: 'Utilisateur modifié avec succès.',
        user: userData,
      });

    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification de l’utilisateur.',
      });
    }
  },

  async delete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Utilisateur supprimé avec succès.',
      });

    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression de l’utilisateur.',
      });
    }
  },

};

export default Users;
