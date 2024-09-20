const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const albumQuery = 'albums.id AS album_id, albums.name AS album_name, albums.year AS album_year, albums.cover AS album_cover';
    const songQuery = 'songs.id AS song_id, songs.title AS song_title, songs.performer';
    const query = {
      text: `SELECT ${albumQuery}, ${songQuery} FROM albums LEFT JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const albums = {
      id: result.rows[0].album_id,
      name: result.rows[0].album_name,
      year: result.rows[0].album_year,
      coverUrl: result.rows[0].album_cover,
    };

    const songs = {
      songs: result.rows.filter((row) => row.song_id !== null).map((row) => ({
        id: row.song_id,
        title: row.song_title,
        performer: row.performer,
      })),
    };

    return { ...albums, ...songs };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addImage(id, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $2 WHERE id = $1 RETURNING id',
      values: [id, cover],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Cover gagal ditambahkan ke album');
    }

    return result.rows[0].id;
  }
}

module.exports = AlbumsService;
