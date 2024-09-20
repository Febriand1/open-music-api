/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      foreignKey: { name: 'fk_user_album_likes_user_id', references: 'users(id)' },
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      foreignKey: { name: 'fk_user_album_likes_album_id', references: 'albums(id)' },
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes_album_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
