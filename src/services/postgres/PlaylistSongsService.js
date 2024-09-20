const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    await this.checkedSong(songId);

    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylist(playlistId) {
    const playlist = await this.checkedPlaylist(playlistId);

    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    const songs = result.rows;

    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs,
    };
  }

  async deleteSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan dalam playlist');
    }
  }

  async checkedSong(songId) {
    const query = {
      text: 'SELECT 1 FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }

  async checkedPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
             FROM playlists 
             LEFT JOIN users ON playlists.owner = users.id 
             WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = PlaylistSongsService;
