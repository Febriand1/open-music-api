const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class ActivitiesService {
  constructor() {
    this.pool = new Pool();
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;

    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this.pool.query(query);
    return result.rows[0].id;
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, activities.action, activities.time
            FROM activities
            LEFT JOIN users ON users.id = activities.user_id
            LEFT JOIN songs ON songs.id = activities.song_id
            WHERE activities.playlist_id = $1
            ORDER BY activities.time ASC`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }
}

module.exports = ActivitiesService;
