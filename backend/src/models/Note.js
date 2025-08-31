class Note {
  constructor(id, userId, content, date = new Date()) {
    this.id = id;
    this.userId = userId;
    this.content = content;
    this.date = date;
  }

  static fromSupabaseRow(row) {
    return new Note(
      row.id,
      row.user_id,
      row.content,
      new Date(row.created_at)
    );
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      date: this.date
    };
  }
}

module.exports = Note;