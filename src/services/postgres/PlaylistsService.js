const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username AS user_username FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this.pool.query(query);

    const playlists = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      username: row.user_username,
    }));

    return playlists;
  }

  async getPlaylistsCollaboration(userId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username AS user_username FROM playlists 
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id 
      LEFT JOIN users ON users.id = playlists.owner WHERE collaborations.user_id = $1`,
      values: [userId],
    };

    const result = await this.pool.query(query);

    const playlists = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      username: row.user_username,
    }));

    return playlists;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner1(id, owner) {
    const query = {
      text: `
      SELECT owner
      FROM playlists
      WHERE id = $1 AND owner = $2`,
      values: [id, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini atau playlist tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: `SELECT playlists.*, collaborations.user_id AS collaborator FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner && playlist.collaborator !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
