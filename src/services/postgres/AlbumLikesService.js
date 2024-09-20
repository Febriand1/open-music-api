const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async addLike({ userId, albumId }) {
    await this.checkedAlbum(albumId);
    await this.verifyLike(userId, albumId);

    const id = `album_like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length || !result.rows[0].id) {
      throw new NotFoundError('Menyukai album gagal');
    }

    await this.cacheService.delete(`albums:${albumId}`);

    return result.rows[0].id;
  }

  async deleteLike({ userId, albumId }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Batal menyukai album gagal');
    }

    await this.cacheService.delete(`albums:${albumId}`);
  }

  async getLikes(albumId) {
    try {
      const result = await this.cacheService.get(`albums:${albumId}`);
      return {
        fromCache: true,
        data: JSON.parse(result),
      };
    } catch (error) {
      const query = {
        text: `SELECT COUNT(user_album_likes.album_id) AS likes
            FROM user_album_likes 
            WHERE user_album_likes.album_id = $1`,
        values: [albumId],
      };

      const result = await this.pool.query(query);
      const likes = parseInt(result.rows[0].likes, 10);
      const responseData = { likes };

      await this.cacheService.set(
        `albums:${albumId}`,
        JSON.stringify(responseData),
      );

      return {
        fromCache: false,
        data: responseData,
      };
    }
  }

  async checkedAlbum(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async verifyLike(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this.pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Album sudah disukai');
    }
  }
}

module.exports = AlbumLikesService;
