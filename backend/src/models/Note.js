class Note {
  constructor(id, userId, content, dateAt, createdAt = new Date()) {
    this.id = id;
    this.userId = userId;
    this.content = content;
    this.dateAt = dateAt; // User-specified date for the note
    this.createdAt = createdAt; // System timestamp when note was created
  }

  static fromSupabaseRow(row) {
    return new Note(
      row.id,
      row.user_id,
      row.content,
      row.date_at ? new Date(row.date_at) : null,
      new Date(row.created_at)
    );
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      dateAt: this.dateAt,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Note;
