CREATE VIRTUAL TABLE paragraph_fts USING fts5(description, content='', content_rowid='id');
INSERT INTO paragraph_fts (rowid, description) SELECT ROWID, content as description FROM paragraph;