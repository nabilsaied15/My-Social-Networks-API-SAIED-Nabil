import Album from '../models/Album.mjs';
import Event from '../models/Event.mjs';

const Albums = {
  async create(req, res) {
    try {
      const { title, event } = req.body;

      if (!title || !event) {
        return res.status(400).json({
          message: 'Le titre et l’événement sont obligatoires.',
        });
      }

      const eventExists = await Event.findById(event);

      if (!eventExists) {
        return res.status(404).json({
          message: 'Événement introuvable.',
        });
      }

      const album = new Album({ title, event });

      await album.save();

      return res.status(201).json({
        message: 'Album créé avec succès.',
        album,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la création de l’album.',
      });
    }
  },

  async getAll(req, res) {
    try {
      const albums = await Album.find()
        .populate('event')
        .populate('photos.author')
        .populate('photos.comments.author');

      return res.status(200).json({
        count: albums.length,
        albums,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erreur lors de la récupération des albums.',
      });
    }
  },

  async getById(req, res) {
    try {
      const album = await Album.findById(req.params.id)
        .populate('event')
        .populate('photos.author')
        .populate('photos.comments.author');

      if (!album) {
        return res.status(404).json({
          message: 'Album introuvable.',
        });
      }

      return res.status(200).json(album);
    } catch (error) {
      return res.status(400).json({
        message: 'Identifiant invalide.',
      });
    }
  },

  async update(req, res) {
    try {
      const album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(404).json({
          message: 'Album introuvable.',
        });
      }

      if (req.body.title !== undefined) {
        album.title = req.body.title;
      }

      await album.save();

      return res.status(200).json({
        message: 'Album modifié avec succès.',
        album,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la modification.',
      });
    }
  },

  async delete(req, res) {
    try {
      const album = await Album.findByIdAndDelete(req.params.id);

      if (!album) {
        return res.status(404).json({
          message: 'Album introuvable.',
        });
      }

      return res.status(200).json({
        message: 'Album supprimé avec succès.',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la suppression.',
      });
    }
  },

  async addPhoto(req, res) {
    try {
      const { url, author } = req.body;

      if (!url || !author) {
        return res.status(400).json({
          message: 'La photo et son auteur sont obligatoires.',
        });
      }

      const album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(404).json({
          message: 'Album introuvable.',
        });
      }

      const event = await Event.findById(album.event);

      const authorized = event && event.participants.some(
        (id) => id.toString() === author
      );

      if (!authorized) {
        return res.status(403).json({
          message: 'Seul un participant peut publier une photo.',
        });
      }

      album.photos.push({ url, author });

      await album.save();

      return res.status(201).json({
        message: 'Photo ajoutée avec succès.',
        album,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l’ajout de la photo.',
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

      const album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(404).json({
          message: 'Album introuvable.',
        });
      }

      const photo = album.photos.id(req.params.photoId);

      if (!photo) {
        return res.status(404).json({
          message: 'Photo introuvable.',
        });
      }

      const event = await Event.findById(album.event);

      const authorized = event && event.participants.some(
        (id) => id.toString() === author
      );

      if (!authorized) {
        return res.status(403).json({
          message: 'Seul un participant peut commenter une photo.',
        });
      }

      photo.comments.push({ content, author });

      await album.save();

      return res.status(201).json({
        message: 'Commentaire ajouté avec succès.',
        album,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l’ajout du commentaire.',
      });
    }
  },

};
export default Albums;
