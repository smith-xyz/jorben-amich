CREATE VIRTUAL TABLE article_fts USING fts5(description, content='', content_rowid='id');
INSERT INTO article_fts (rowid, description) SELECT ROWID, content as description FROM article_content;